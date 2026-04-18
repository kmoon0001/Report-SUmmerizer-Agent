import argparse
from datetime import datetime
import json
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor

try:
    import shap
except Exception as exc:  # pragma: no cover
    raise RuntimeError(
        "The 'shap' package is required. Install with: pip install shap"
    ) from exc


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Build resident-level SHAP explanations from command center patient insights."
    )
    parser.add_argument("--input", required=True, help="Input patient insights CSV path.")
    parser.add_argument("--output", required=True, help="Output SHAP explanations CSV path.")
    parser.add_argument(
        "--feature-output",
        required=True,
        help="Output SHAP feature-importance CSV path.",
    )
    parser.add_argument("--summary-output", required=True, help="Output markdown summary path.")
    return parser.parse_args()


def to_bool_series(series: pd.Series) -> pd.Series:
    return (
        series.fillna("")
        .astype(str)
        .str.strip()
        .str.lower()
        .isin(["true", "1", "yes", "y"])
        .astype(int)
    )


def to_numeric_series(series: pd.Series) -> pd.Series:
    return pd.to_numeric(series, errors="coerce")


def ensure_parent(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)


def main() -> int:
    args = parse_args()
    input_path = Path(args.input)
    output_path = Path(args.output)
    feature_output_path = Path(args.feature_output)
    summary_output_path = Path(args.summary_output)

    if not input_path.exists():
        raise FileNotFoundError(f"Input file not found: {input_path}")

    df = pd.read_csv(input_path, dtype=str).fillna("")
    if df.empty:
        raise ValueError("Input patient insights file is empty.")

    required = ["ResidentSourceId", "ResidentName", "UnitCode", "PriorityScore"]
    missing = [c for c in required if c not in df.columns]
    if missing:
        raise ValueError(f"Input is missing required columns: {', '.join(missing)}")

    numeric_cols = [
        "AgeYears",
        "DocumentationItemCount",
        "OutstandingDocCount",
        "OverdueDocCount",
        "TherapyLineCount",
        "TherapyMinutes",
        "DaysSinceLastTherapy",
        "DaysSinceAdmission",
        "HeartRate",
        "SystolicBP",
        "DiastolicBP",
        "RespiratoryRate",
        "TemperatureF",
        "SpO2Percent",
        "WeightLbs",
        "PainScore",
    ]

    bool_cols = ["HasDocumentationItems", "HasTherapy", "VitalsAvailable"]
    cat_cols = ["UnitCode", "PriorityBand", "ProgressLevel"]

    features = pd.DataFrame(index=df.index)
    for col in numeric_cols:
        if col in df.columns:
            features[col] = to_numeric_series(df[col])

    for col in bool_cols:
        if col in df.columns:
            features[col] = to_bool_series(df[col])

    for col in cat_cols:
        if col in df.columns:
            features[col] = df[col].astype(str).str.strip().replace("", "Unknown")

    target = to_numeric_series(df["PriorityScore"])
    valid_mask = target.notna()
    features = features.loc[valid_mask].copy()
    df_valid = df.loc[valid_mask].copy()
    target = target.loc[valid_mask].copy()

    if len(df_valid) < 20:
        raise ValueError("Not enough valid rows for stable SHAP modeling (need at least 20).")
    if float(target.var()) == 0.0:
        raise ValueError("PriorityScore has zero variance; SHAP model cannot be trained.")

    cat_existing = [c for c in cat_cols if c in features.columns]
    x_encoded = pd.get_dummies(features, columns=cat_existing, dummy_na=False)
    x_encoded = x_encoded.apply(pd.to_numeric, errors="coerce")
    x_encoded = x_encoded.replace([np.inf, -np.inf], np.nan)
    medians = x_encoded.median(numeric_only=True)
    x_encoded = x_encoded.fillna(medians).fillna(0.0)

    model = RandomForestRegressor(
        n_estimators=300,
        random_state=42,
        min_samples_leaf=2,
        n_jobs=-1,
    )
    model.fit(x_encoded, target)

    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(x_encoded)
    if isinstance(shap_values, list):
        shap_values = shap_values[0]
    shap_values = np.asarray(shap_values)

    if shap_values.shape != x_encoded.shape:
        raise ValueError(
            f"Unexpected SHAP matrix shape {shap_values.shape}; expected {x_encoded.shape}."
        )

    expected_value = explainer.expected_value
    if isinstance(expected_value, (list, np.ndarray)):
        base_value = float(np.asarray(expected_value).reshape(-1)[0])
    else:
        base_value = float(expected_value)

    predicted = model.predict(x_encoded)
    feature_names = list(x_encoded.columns)
    now_iso = datetime.utcnow().replace(microsecond=0).isoformat() + "Z"

    out_rows = []
    for i in range(len(df_valid)):
        row_shap = shap_values[i, :]
        abs_idx = np.argsort(np.abs(row_shap))[::-1]
        top_idx = abs_idx[:3]

        def feature_triplet(rank: int):
            idx = int(top_idx[rank]) if rank < len(top_idx) else None
            if idx is None:
                return ("", 0.0, "")
            fname = feature_names[idx]
            contribution = float(row_shap[idx])
            raw_val = x_encoded.iloc[i, idx]
            return (fname, contribution, raw_val)

        f1, c1, v1 = feature_triplet(0)
        f2, c2, v2 = feature_triplet(1)
        f3, c3, v3 = feature_triplet(2)

        source = df_valid.iloc[i]
        out_rows.append(
            {
                "SnapshotDateKey": source.get("SnapshotDateKey", ""),
                "ResidentSourceId": source.get("ResidentSourceId", ""),
                "ResidentName": source.get("ResidentName", ""),
                "UnitCode": source.get("UnitCode", ""),
                "ModelName": "RandomForestRegressor",
                "PredictedPriorityScore": round(float(predicted[i]), 4),
                "ObservedPriorityScore": round(float(target.iloc[i]), 4),
                "BaseValue": round(base_value, 6),
                "TopFeature1": f1,
                "TopFeature1Contribution": round(c1, 6),
                "TopFeature1RawValue": v1,
                "TopFeature2": f2,
                "TopFeature2Contribution": round(c2, 6),
                "TopFeature2RawValue": v2,
                "TopFeature3": f3,
                "TopFeature3Contribution": round(c3, 6),
                "TopFeature3RawValue": v3,
                "ExplanationGeneratedAt": now_iso,
            }
        )

    out_df = pd.DataFrame(out_rows)
    out_df = out_df.sort_values(
        by=["PredictedPriorityScore", "ObservedPriorityScore"], ascending=[False, False]
    ).reset_index(drop=True)

    mean_abs = np.mean(np.abs(shap_values), axis=0)
    feature_importance = pd.DataFrame(
        {
            "FeatureName": feature_names,
            "MeanAbsShap": mean_abs,
        }
    ).sort_values(by="MeanAbsShap", ascending=False)
    feature_importance["Rank"] = np.arange(1, len(feature_importance) + 1)
    feature_importance["GeneratedAt"] = now_iso

    ensure_parent(output_path)
    ensure_parent(feature_output_path)
    ensure_parent(summary_output_path)

    out_df.to_csv(output_path, index=False)
    feature_importance.to_csv(feature_output_path, index=False)

    top_features = feature_importance.head(10).to_dict(orient="records")
    summary_lines = [
        "# Command Center SHAP Summary",
        "",
        f"Generated: {now_iso}",
        "",
        f"Input rows used: {len(df_valid)}",
        f"Output rows: {len(out_df)}",
        "Model: RandomForestRegressor",
        "",
        "Top global SHAP features:",
    ]
    for item in top_features:
        summary_lines.append(
            f"- {item['Rank']}. {item['FeatureName']} (mean_abs_shap={item['MeanAbsShap']:.6f})"
        )

    summary_output_path.write_text("\n".join(summary_lines), encoding="utf-8")

    print(
        json.dumps(
            {
                "status": "ok",
                "input_rows": int(len(df_valid)),
                "output_rows": int(len(out_df)),
                "top_feature": top_features[0]["FeatureName"] if top_features else "",
            }
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

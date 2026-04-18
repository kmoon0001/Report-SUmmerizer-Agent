import pandas as pd  # type: ignore
import shap  # type: ignore
from sklearn.ensemble import RandomForestClassifier  # type: ignore

# ---------------------------------------------------------
# Microsoft Fabric / Azure ML: XAI Urgency Pipeline
# ---------------------------------------------------------


def fetch_dataverse_briefings():
    """Mock Dataverse row extraction."""
    return pd.DataFrame([
        {
            "cr917_recordid": "REC-101",
            "sessionCount": 10,
            "daysSinceLastPN": 12,
            "certExpiresIn": 3,
            "goalProgressPercent": 20
        },
        {
            "cr917_recordid": "REC-102",
            "sessionCount": 2,
            "daysSinceLastPN": 2,
            "certExpiresIn": 25,
            "goalProgressPercent": 80
        }
    ])


def push_xai_scores_to_dataverse(record_id, urgency_score, factors_text):
    """Mock PUSH to Dataverse cr917_xai_topfactorstext."""
    print(
        f"Upserting REC: {record_id} | "
        f"Urgency: {urgency_score}% | Factors: {factors_text}"
    )


def run_shap_pipeline():
    df = fetch_dataverse_briefings()
    features = df.drop(columns=['cr917_recordid'])

    y_dummy = [1, 0]
    model = RandomForestClassifier(random_state=42).fit(features, y_dummy)

    explainer = shap.TreeExplainer(model)
    shap_vals = explainer.shap_values(features)

    try:
        predictions = model.predict_proba(features)[:, 1] * 100

        for i, row in df.iterrows():
            try:
                record_id = row['cr917_recordid']
                score = int(predictions[i])

                f_imp = pd.Series(shap_vals[1][i], index=features.columns)
                top_d = f_imp.idxmax()
                top_val = row[top_d]

                factors_text = f"Driven primarily by {top_d} at {top_val}."

                push_xai_scores_to_dataverse(record_id, score, factors_text)

            except Exception as e:
                rc_id = row.get('cr917_recordid', 'Unknown')
                print(f"Failed SHAP for Record {rc_id}: {e}")

    except Exception as e:
        print(f"Critical ML Pipeline Failure: {e}")


if __name__ == "__main__":
    try:
        run_shap_pipeline()
    except Exception as pipeline_error:
        print(f"Pipeline crashed on start: {pipeline_error}")

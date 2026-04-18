import argparse
import json
import os
import sys
from pathlib import Path


def get_env(*names: str) -> str:
    for name in names:
        value = os.environ.get(name, "").strip()
        if value:
            return value
    return ""


def read_jsonl(path: Path) -> list[dict]:
    rows: list[dict] = []
    for line in path.read_text(encoding="utf-8-sig").splitlines():
        text = line.strip()
        if not text:
            continue
        rows.append(json.loads(text))
    return rows


def write_output(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2), encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="Evaluate groundedness for command-center responses.")
    parser.add_argument("--input", required=True, help="Input JSONL dataset path.")
    parser.add_argument("--output", required=True, help="Output JSON summary path.")
    parser.add_argument("--threshold", type=float, default=3.0, help="Groundedness pass threshold.")
    parser.add_argument("--min-average-score", type=float, default=3.5, help="Minimum acceptable average score.")
    parser.add_argument("--min-pass-rate", type=float, default=0.85, help="Minimum acceptable pass rate.")
    args = parser.parse_args()

    input_path = Path(args.input)
    output_path = Path(args.output)

    if not input_path.exists():
        payload = {"status": "FAIL", "reason": f"Input dataset not found: {input_path}"}
        write_output(output_path, payload)
        print(json.dumps(payload))
        return 1

    rows = read_jsonl(input_path)
    if not rows:
        payload = {"status": "SKIP", "reason": "Groundedness dataset is empty.", "rows": 0}
        write_output(output_path, payload)
        print(json.dumps(payload))
        return 0

    try:
        from azure.ai.evaluation import AzureOpenAIModelConfiguration, GroundednessEvaluator
    except Exception:
        payload = {
            "status": "SKIP",
            "reason": "azure-ai-evaluation is not installed.",
            "rows": len(rows),
        }
        write_output(output_path, payload)
        print(json.dumps(payload))
        return 0

    endpoint = get_env("AZURE_OPENAI_EVAL_ENDPOINT", "AZURE_OPENAI_ENDPOINT")
    credential_value = get_env("AZURE_OPENAI_EVAL_API_KEY", "AZURE_OPENAI_API_KEY")
    deployment = get_env("AZURE_OPENAI_EVAL_DEPLOYMENT", "AZURE_OPENAI_DEPLOYMENT", "AZURE_OPENAI_DEPLOYMENT_NAME")
    api_version = get_env("AZURE_OPENAI_EVAL_API_VERSION", "AZURE_OPENAI_API_VERSION") or "2024-02-01"

    missing = []
    if not endpoint:
        missing.append("AZURE_OPENAI_ENDPOINT")
    if not credential_value:
        missing.append("AZURE_OPENAI_API_KEY")
    if not deployment:
        missing.append("AZURE_OPENAI_DEPLOYMENT")

    if missing:
        payload = {
            "status": "SKIP",
            "reason": f"Azure OpenAI groundedness configuration is incomplete: {', '.join(missing)}",
            "rows": len(rows),
        }
        write_output(output_path, payload)
        print(json.dumps(payload))
        return 0

    model_config = AzureOpenAIModelConfiguration(
        **{
            "azure_endpoint": endpoint,
            "api_key": credential_value,
            "azure_deployment": deployment,
            "api_version": api_version,
        }
    )
    evaluator = GroundednessEvaluator(model_config=model_config, threshold=args.threshold)

    result_rows: list[dict] = []
    pass_count = 0
    score_total = 0.0

    for row in rows:
        evaluation = evaluator(
            query=row.get("query", ""),
            context=row.get("context", ""),
            response=row.get("response", ""),
        )
        score = evaluation.get("groundedness")
        if score is None:
            score = evaluation.get("gpt_groundedness")
        score_value = float(score) if score is not None else 0.0
        score_total += score_value

        result_text = str(evaluation.get("groundedness_result", "")).strip().lower()
        passed = result_text == "pass" or score_value >= args.threshold
        if passed:
            pass_count += 1

        result_rows.append(
            {
                "ticketId": row.get("ticket_id", ""),
                "residentSourceId": row.get("resident_source_id", ""),
                "residentName": row.get("resident_name", ""),
                "score": score_value,
                "passed": passed,
                "reason": evaluation.get("groundedness_reason", ""),
                "raw": evaluation,
            }
        )

    row_count = len(result_rows)
    average_score = score_total / row_count if row_count else 0.0
    pass_rate = pass_count / row_count if row_count else 0.0
    status = "PASS" if average_score >= args.min_average_score and pass_rate >= args.min_pass_rate else "FAIL"

    payload = {
        "status": status,
        "mode": "AzureAIEvaluation",
        "rows": row_count,
        "threshold": args.threshold,
        "minAverageScore": args.min_average_score,
        "minPassRate": args.min_pass_rate,
        "averageScore": round(average_score, 4),
        "passRate": round(pass_rate, 4),
        "passCount": pass_count,
        "failCount": row_count - pass_count,
        "results": result_rows,
    }
    write_output(output_path, payload)
    print(json.dumps(payload))
    return 0 if status == "PASS" else 1


if __name__ == "__main__":
    raise SystemExit(main())

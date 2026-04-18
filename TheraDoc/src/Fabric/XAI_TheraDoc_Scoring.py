import pandas as pd # type: ignore
import shap # type: ignore
from sklearn.ensemble import RandomForestRegressor # type: ignore

# ---------------------------------------------------------
# THERADOC XAI: Explainable Note Urgency
# ---------------------------------------------------------

def run_theradoc_shap():
    # Mock Clinical Note Data
    data = pd.DataFrame([
        {"NoteID": "N1", "WordCount": 50, "KeywordsFound": 2, "IsPostOp": 1, "UrgencyScore": 90},
        {"NoteID": "N2", "WordCount": 200, "KeywordsFound": 1, "IsPostOp": 0, "UrgencyScore": 40}
    ])
    
    features = data.drop(columns=['NoteID', 'UrgencyScore'])
    y = data['UrgencyScore']
    
    model = RandomForestRegressor(random_state=42).fit(features, y)
    explainer = shap.Explainer(model, features)
    shap_values = explainer(features)
    
    for i, row in data.iterrows():
        note_id = row['NoteID']
        top_feature_idx = shap_values.values[i].argmax()
        top_feature_name = features.columns[top_feature_idx]
        
        explanation = f"XAI Insight: Note {note_id} scored as high urgency due to {top_feature_name} contribution."
        print(f"ID: {note_id} | {explanation}")

if __name__ == "__main__":
    run_theradoc_shap()

# PLATINUM_ADVANCED_STABILITY.md

This manifest defines the elite techniques for ensuring frictionless user experiences and 99.9% logical stability.

## 1. Implicit Context Injection (The "Mind Reader")
- **Standard**: "Please select your facility."
- **Platinum**: Fetch the `preferredLanguage`, `officeLocation`, and `jobTitle` from Azure AD globally.
- **Implementation**: Every orchestrator must prefix its prompt with: `"The current user is a [JobTitle] at [OfficeLocation]. Adjust the clinical complexity of your output to match this persona."`

## 2. Chain-of-Thought (CoT) Clinical Reasoning
- **Standard**: "Analyze this note."
- **Platinum**: Use Step-by-Step decomposition within the prompt.
- **Formula**:
  1. **Identify**: List all functional measures found.
  2. **Compare**: Compare measures to CMS Chapter 15 safe-harbor thresholds.
  3. **Synthesize**: Generate the final medical necessity statement.
  4. **Self-Audit**: Verify if any meds or WB changes were hallucinated.

## 3. The "Thinking" Card Pattern (UX Fluidity)
- **Goal**: Eliminate "Chatbot Hangups" during long AI processing.
- **Logic**: 
  - **Minute 0**: Bot sends an Adaptive Card with a "⚙️ Processing Clinical Data..." indicator and a "Review in Progress" status.
  - **Minute 1**: Power Automate finishes, calls the Teams `Update Message` API, and overwrites the thinking card with the final **Platinum Inline Editor**.
  - **Benefit**: The user sees immediate "Life" in the bot, preventing repeat clicks.

## 4. Multi-Modal Vision Fallback
- **Logic**: If the ETL fails to parse a raw EHR JSON record, the bot prompts: "I encountered a formatting error. Please upload a screenshot of the PCC report, and I will use Platinum Vision to analyze it."

## 5. Elastic Topic Scaling
- **Logic**: Use a single "Universal Analysis" topic that accepts a `SchemaType` variable (Eval, Progress, etc.) and dynamically swaps the prompt tool, rather than having 4 separate nearly-identical topics.

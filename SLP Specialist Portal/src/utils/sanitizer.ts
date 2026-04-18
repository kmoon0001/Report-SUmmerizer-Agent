export const sanitizePrompt = (prompt: string): string => {
  // Basic regex for email addresses
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  // Basic regex for phone numbers (simple format)
  const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g;
  
  let sanitized = prompt.replace(emailRegex, "[EMAIL_REMOVED]");
  sanitized = sanitized.replace(phoneRegex, "[PHONE_REMOVED]");
  
  return sanitized;
};

/**
 * Sanitizes chat content by removing potential PII.
 * This is a basic implementation and should be expanded based on specific PII patterns.
 */
export const sanitizeChatContent = (content: string): string => {
  // Basic regex for email addresses
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  // Basic regex for phone numbers (simple format)
  const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g;
  
  let sanitized = content.replace(emailRegex, "[EMAIL_REMOVED]");
  sanitized = sanitized.replace(phoneRegex, "[PHONE_REMOVED]");
  
  return sanitized;
};

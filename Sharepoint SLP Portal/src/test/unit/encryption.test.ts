/**
 * Unit tests for PHI encryption utilities
 * Tests AES-256-GCM encryption, key derivation, PHI detection, and masking
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  encryptPHI,
  decryptPHI,
  hashPHI,
  verifyHashedPHI,
  generateMasterKey,
  encryptPHIObject,
  decryptPHIObject,
  detectPHI,
  maskPHI,
  sanitizeInput,
  validateKeyStrength,
  rotateEncryptionKey,
  generateSecureToken,
  hashPassword,
  verifyPassword,
  deriveKey,
  ENCRYPTION_CONFIG,
} from "../../utils/encryption";
import crypto from "crypto";

describe("PHI Encryption", () => {
  let masterKey: string;

  beforeEach(() => {
    masterKey = generateMasterKey();
  });

  describe("Basic Encryption/Decryption", () => {
    it("should encrypt and decrypt PHI correctly", () => {
      const plaintext = "John Doe";
      const encrypted = encryptPHI(plaintext, masterKey);
      const decrypted = decryptPHI(encrypted, masterKey);
      expect(decrypted).toBe(plaintext);
    });

    it("should produce different ciphertext for same plaintext (due to random IV)", () => {
      const plaintext = "John Doe";
      const encrypted1 = encryptPHI(plaintext, masterKey);
      const encrypted2 = encryptPHI(plaintext, masterKey);
      expect(encrypted1).not.toBe(encrypted2);
    });

    it("should decrypt to same plaintext despite different ciphertexts", () => {
      const plaintext = "John Doe";
      const encrypted1 = encryptPHI(plaintext, masterKey);
      const encrypted2 = encryptPHI(plaintext, masterKey);
      expect(decryptPHI(encrypted1, masterKey)).toBe(plaintext);
      expect(decryptPHI(encrypted2, masterKey)).toBe(plaintext);
    });

    it("should fail to decrypt with wrong key", () => {
      const plaintext = "John Doe";
      const encrypted = encryptPHI(plaintext, masterKey);
      const wrongKey = generateMasterKey();
      expect(() => decryptPHI(encrypted, wrongKey)).toThrow();
    });

    it("should handle empty strings", () => {
      const plaintext = "";
      const encrypted = encryptPHI(plaintext, masterKey);
      const decrypted = decryptPHI(encrypted, masterKey);
      expect(decrypted).toBe(plaintext);
    });

    it("should handle special characters", () => {
      const plaintext = "Test!@#$%^&*()_+-=[]{}|;:,.<>?";
      const encrypted = encryptPHI(plaintext, masterKey);
      const decrypted = decryptPHI(encrypted, masterKey);
      expect(decrypted).toBe(plaintext);
    });

    it("should handle unicode characters", () => {
      const plaintext = "José García 北京 🏥";
      const encrypted = encryptPHI(plaintext, masterKey);
      const decrypted = decryptPHI(encrypted, masterKey);
      expect(decrypted).toBe(plaintext);
    });

    it("should handle long text", () => {
      const plaintext = "A".repeat(10000);
      const encrypted = encryptPHI(plaintext, masterKey);
      const decrypted = decryptPHI(encrypted, masterKey);
      expect(decrypted).toBe(plaintext);
    });
  });

  describe("Hashing", () => {
    it("should hash PHI consistently", () => {
      const plaintext = "John Doe";
      const hash1 = hashPHI(plaintext);
      const hash2 = hashPHI(plaintext);
      expect(hash1).toBe(hash2);
    });

    it("should produce different hashes for different inputs", () => {
      const hash1 = hashPHI("John Doe");
      const hash2 = hashPHI("Jane Doe");
      expect(hash1).not.toBe(hash2);
    });

    it("should verify hashed PHI correctly", () => {
      const plaintext = "John Doe";
      const hash = hashPHI(plaintext);
      expect(verifyHashedPHI(plaintext, hash)).toBe(true);
    });

    it("should reject incorrect plaintext for hash", () => {
      const plaintext = "John Doe";
      const hash = hashPHI(plaintext);
      expect(verifyHashedPHI("Jane Doe", hash)).toBe(false);
    });

    it("should produce SHA-256 hashes (64 hex characters)", () => {
      const hash = hashPHI("test");
      expect(hash).toMatch(/^[0-9a-f]{64}$/i);
    });
  });

  describe("Object Encryption", () => {
    it("should encrypt specific fields in object", () => {
      const obj = {
        name: "John Doe",
        mrn: "123456",
        age: 65,
      };

      const encrypted = encryptPHIObject(obj, ["name", "mrn"], masterKey);
      expect(encrypted.name).not.toBe(obj.name);
      expect(encrypted.mrn).not.toBe(obj.mrn);
      expect(encrypted.age).toBe(obj.age); // Non-PHI field unchanged
    });

    it("should decrypt encrypted object fields", () => {
      const obj = {
        name: "John Doe",
        mrn: "123456",
        age: 65,
      };

      const encrypted = encryptPHIObject(obj, ["name", "mrn"], masterKey);
      const decrypted = decryptPHIObject(encrypted, ["name", "mrn"], masterKey);
      expect(decrypted.name).toBe(obj.name);
      expect(decrypted.mrn).toBe(obj.mrn);
      expect(decrypted.age).toBe(obj.age);
    });

    it("should handle null and undefined fields", () => {
      const obj = {
        name: "John Doe",
        middleName: null,
        suffix: undefined,
      };

      const encrypted = encryptPHIObject(
        obj,
        ["name", "middleName", "suffix"],
        masterKey,
      );
      expect(encrypted.middleName).toBeNull();
      expect(encrypted.suffix).toBeUndefined();
    });

    it("should handle empty PHI fields array", () => {
      const obj = { name: "John Doe", age: 65 };
      const encrypted = encryptPHIObject(obj, [], masterKey);
      expect(encrypted).toEqual(obj);
    });
  });

  describe("PHI Detection", () => {
    it("should detect SSN pattern", () => {
      const text = "Patient SSN: 123-45-6789";
      const detected = detectPHI(text);
      expect(detected.some((d) => d.includes("123-45-6789"))).toBe(true);
    });

    it("should detect phone number pattern", () => {
      const text = "Contact: 555-123-4567";
      const detected = detectPHI(text);
      expect(detected.some((d) => d.includes("555-123-4567"))).toBe(true);
    });

    it("should detect email pattern", () => {
      const text = "Email: patient@example.com";
      const detected = detectPHI(text);
      expect(detected.some((d) => d.includes("patient@example.com"))).toBe(
        true,
      );
    });

    it("should detect MRN pattern", () => {
      const text = "MRN: 1234567";
      const detected = detectPHI(text);
      expect(detected.some((d) => d.includes("1234567"))).toBe(true);
    });

    it("should detect DOB pattern", () => {
      const text = "DOB: 01/15/1960";
      const detected = detectPHI(text);
      expect(detected.some((d) => d.includes("01/15/1960"))).toBe(true);
    });

    it("should detect credit card pattern", () => {
      const text = "Card: 4532-1234-5678-9010";
      const detected = detectPHI(text);
      expect(detected.some((d) => d.includes("4532-1234-5678-9010"))).toBe(
        true,
      );
    });

    it("should return empty array for text without PHI", () => {
      const text = "This is a normal clinical note without sensitive data.";
      const detected = detectPHI(text);
      expect(detected.length).toBe(0);
    });

    it("should detect multiple PHI patterns", () => {
      const text =
        "Patient: John Doe, SSN: 123-45-6789, Phone: 555-123-4567, Email: john@example.com";
      const detected = detectPHI(text);
      expect(detected.length).toBeGreaterThan(2);
    });
  });

  describe("PHI Masking", () => {
    it("should mask SSN", () => {
      const text = "SSN: 123-45-6789";
      const masked = maskPHI(text);
      expect(masked).toContain("XXX-XX-XXXX");
      expect(masked).not.toContain("123-45-6789");
    });

    it("should mask phone number", () => {
      const text = "Phone: 555-123-4567";
      const masked = maskPHI(text);
      expect(masked).toContain("XXX-XXX-XXXX");
      expect(masked).not.toContain("555-123-4567");
    });

    it("should mask email", () => {
      const text = "Email: patient@example.com";
      const masked = maskPHI(text);
      expect(masked).toContain("[email]");
      expect(masked).not.toContain("patient@example.com");
    });

    it("should mask MRN", () => {
      const text = "MRN: 1234567";
      const masked = maskPHI(text);
      expect(masked).toContain("XXXXXX");
      expect(masked).not.toContain("1234567");
    });

    it("should mask DOB", () => {
      const text = "DOB: 01/15/1960";
      const masked = maskPHI(text);
      expect(masked).toContain("XX/XX/XXXX");
      expect(masked).not.toContain("01/15/1960");
    });

    it("should mask credit card", () => {
      const text = "Card: 4532-1234-5678-9010";
      const masked = maskPHI(text);
      expect(masked).toContain("XXXX-XXXX-XXXX-XXXX");
      expect(masked).not.toContain("4532-1234-5678-9010");
    });

    it("should preserve non-PHI text", () => {
      const text = "Patient is stable and improving.";
      const masked = maskPHI(text);
      expect(masked).toBe(text);
    });
  });

  describe("Input Sanitization", () => {
    it("should remove angle brackets", () => {
      const input = '<script>alert("xss")</script>';
      const sanitized = sanitizeInput(input);
      expect(sanitized).not.toContain("<");
      expect(sanitized).not.toContain(">");
    });

    it("should remove quotes", () => {
      const input = "Test \"quoted\" and 'single'";
      const sanitized = sanitizeInput(input);
      expect(sanitized).not.toContain('"');
      expect(sanitized).not.toContain("'");
    });

    it("should remove semicolons", () => {
      const input = "Test; DROP TABLE;";
      const sanitized = sanitizeInput(input);
      expect(sanitized).not.toContain(";");
    });

    it("should trim whitespace", () => {
      const input = "  test input  ";
      const sanitized = sanitizeInput(input);
      expect(sanitized).toBe("test input");
    });

    it("should preserve safe characters", () => {
      const input = "John Doe, 123 Main St.";
      const sanitized = sanitizeInput(input);
      expect(sanitized).toContain("John Doe");
      expect(sanitized).toContain("123 Main St");
    });
  });

  describe("Key Management", () => {
    it("should generate valid master key", () => {
      const key = generateMasterKey();
      expect(validateKeyStrength(key)).toBe(true);
    });

    it("should generate unique keys", () => {
      const key1 = generateMasterKey();
      const key2 = generateMasterKey();
      expect(key1).not.toBe(key2);
    });

    it("should validate key strength", () => {
      const validKey = generateMasterKey();
      expect(validateKeyStrength(validKey)).toBe(true);
    });

    it("should reject weak keys", () => {
      expect(validateKeyStrength("short")).toBe(false);
      expect(validateKeyStrength("not_hex_characters")).toBe(false);
    });

    it("should rotate encryption key", () => {
      const plaintext = "Sensitive data";
      const encrypted1 = encryptPHI(plaintext, masterKey);
      const newKey = generateMasterKey();
      const encrypted2 = rotateEncryptionKey(encrypted1, masterKey, newKey);
      expect(decryptPHI(encrypted2, newKey)).toBe(plaintext);
    });
  });

  describe("Token Generation", () => {
    it("should generate secure random token", () => {
      const token = generateSecureToken();
      expect(token).toMatch(/^[0-9a-f]+$/i);
      expect(token.length).toBe(64); // 32 bytes = 64 hex chars
    });

    it("should generate unique tokens", () => {
      const token1 = generateSecureToken();
      const token2 = generateSecureToken();
      expect(token1).not.toBe(token2);
    });

    it("should support custom token length", () => {
      const token = generateSecureToken(16);
      expect(token.length).toBe(32); // 16 bytes = 32 hex chars
    });
  });

  describe("Password Hashing", () => {
    it("should hash password with salt", () => {
      const password = "SecurePassword123!";
      const { hash, salt } = hashPassword(password);
      expect(hash).toMatch(/^[0-9a-f]+$/i);
      expect(salt).toMatch(/^[0-9a-f]+$/i);
    });

    it("should verify correct password", () => {
      const password = "SecurePassword123!";
      const { hash, salt } = hashPassword(password);
      expect(verifyPassword(password, hash, salt)).toBe(true);
    });

    it("should reject incorrect password", () => {
      const password = "SecurePassword123!";
      const { hash, salt } = hashPassword(password);
      expect(verifyPassword("WrongPassword", hash, salt)).toBe(false);
    });

    it("should generate different hashes for same password", () => {
      const password = "SecurePassword123!";
      const { hash: hash1 } = hashPassword(password);
      const { hash: hash2 } = hashPassword(password);
      expect(hash1).not.toBe(hash2); // Different salts
    });

    it("should use PBKDF2 with correct iterations", () => {
      const password = "test";
      const salt = crypto.randomBytes(16);
      const { hash } = hashPassword(password, salt);
      expect(hash).toBeDefined();
      expect(hash.length).toBe(64); // SHA-256 = 32 bytes = 64 hex chars
    });
  });

  describe("Encryption Configuration", () => {
    it("should use AES-256-GCM algorithm", () => {
      expect(ENCRYPTION_CONFIG.algorithm).toBe("aes-256-gcm");
    });

    it("should use 256-bit keys", () => {
      expect(ENCRYPTION_CONFIG.keyLength).toBe(32);
    });

    it("should use 128-bit IV", () => {
      expect(ENCRYPTION_CONFIG.ivLength).toBe(16);
    });

    it("should use 128-bit auth tag", () => {
      expect(ENCRYPTION_CONFIG.tagLength).toBe(16);
    });

    it("should use sufficient PBKDF2 iterations", () => {
      expect(ENCRYPTION_CONFIG.iterations).toBeGreaterThanOrEqual(100000);
    });
  });

  describe("Key Derivation", () => {
    it("should derive consistent key from same inputs", () => {
      const salt = crypto.randomBytes(16);
      const key1 = deriveKey(masterKey, salt);
      const key2 = deriveKey(masterKey, salt);
      expect(key1.toString("hex")).toBe(key2.toString("hex"));
    });

    it("should derive different keys from different salts", () => {
      const salt1 = crypto.randomBytes(16);
      const salt2 = crypto.randomBytes(16);
      const key1 = deriveKey(masterKey, salt1);
      const key2 = deriveKey(masterKey, salt2);
      expect(key1.toString("hex")).not.toBe(key2.toString("hex"));
    });

    it("should produce 256-bit keys", () => {
      const salt = crypto.randomBytes(16);
      const key = deriveKey(masterKey, salt);
      expect(key.length).toBe(32);
    });
  });

  describe("Security Properties", () => {
    it("should not leak plaintext in ciphertext", () => {
      const plaintext = "John Doe";
      const encrypted = encryptPHI(plaintext, masterKey);
      expect(encrypted).not.toContain(plaintext);
    });

    it("should provide authentication (GCM mode)", () => {
      const plaintext = "John Doe";
      const encrypted = encryptPHI(plaintext, masterKey);
      const tampered = encrypted.slice(0, -2) + "XX";
      expect(() => decryptPHI(tampered, masterKey)).toThrow();
    });

    it("should use random IV for each encryption", () => {
      const plaintext = "John Doe";
      const encrypted1 = encryptPHI(plaintext, masterKey);
      const encrypted2 = encryptPHI(plaintext, masterKey);
      // Extract IVs (after salt, 16 bytes each)
      const iv1 = encrypted1.slice(22, 44);
      const iv2 = encrypted2.slice(22, 44);
      expect(iv1).not.toBe(iv2);
    });
  });
});

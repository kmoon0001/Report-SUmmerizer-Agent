import { describe, it, expect, beforeEach } from "vitest";
import {
  generateKey,
  importKey,
  exportKey,
  encryptData,
  decryptData,
} from "../../utils/web-crypto";

describe("Web Crypto Utilities", () => {
  let testKey: CryptoKey;

  beforeEach(async () => {
    // Generate a test key for each test
    testKey = await generateKey();
  });

  describe("generateKey", () => {
    it("should generate a valid CryptoKey", async () => {
      const key = await generateKey();
      expect(key).toBeDefined();
      expect(key.type).toBe("secret");
      expect(key.algorithm.name).toBe("AES-GCM");
    });

    it("should generate different keys on each call", async () => {
      const key1 = await generateKey();
      const key2 = await generateKey();

      const exported1 = await exportKey(key1);
      const exported2 = await exportKey(key2);

      expect(exported1).not.toBe(exported2);
    });

    it("should generate keys with correct algorithm", async () => {
      const key = await generateKey();
      expect(key.algorithm.name).toBe("AES-GCM");
    });

    it("should generate keys with 256-bit length", async () => {
      const key = await generateKey();
      expect((key.algorithm as any).length).toBe(256);
    });

    it("should generate extractable keys", async () => {
      const key = await generateKey();
      expect(key.extractable).toBe(true);
    });

    it("should generate keys with encrypt/decrypt usages", async () => {
      const key = await generateKey();
      expect(key.usages).toContain("encrypt");
      expect(key.usages).toContain("decrypt");
    });
  });

  describe("exportKey", () => {
    it("should export key as base64 string", async () => {
      const exported = await exportKey(testKey);
      expect(typeof exported).toBe("string");
      expect(exported.length).toBeGreaterThan(0);
    });

    it("should export key in valid base64 format", async () => {
      const exported = await exportKey(testKey);
      // Base64 should only contain valid characters
      expect(/^[A-Za-z0-9+/]*={0,2}$/.test(exported)).toBe(true);
    });

    it("should produce consistent exports", async () => {
      const exported1 = await exportKey(testKey);
      const exported2 = await exportKey(testKey);
      expect(exported1).toBe(exported2);
    });
  });

  describe("importKey", () => {
    it("should import exported key", async () => {
      const exported = await exportKey(testKey);
      const imported = await importKey(exported);

      expect(imported).toBeDefined();
      expect(imported.type).toBe("secret");
      expect(imported.algorithm.name).toBe("AES-GCM");
    });

    it("should import key with correct algorithm", async () => {
      const exported = await exportKey(testKey);
      const imported = await importKey(exported);

      expect(imported.algorithm.name).toBe("AES-GCM");
    });

    it("should import key with correct usages", async () => {
      const exported = await exportKey(testKey);
      const imported = await importKey(exported);

      expect(imported.usages).toContain("encrypt");
      expect(imported.usages).toContain("decrypt");
    });

    it("should handle invalid base64 gracefully", async () => {
      const invalidBase64 = "not-valid-base64!!!";
      await expect(importKey(invalidBase64)).rejects.toThrow();
    });
  });

  describe("encryptData", () => {
    it("should encrypt data to base64 string", async () => {
      const plaintext = "Hello, World!";
      const encrypted = await encryptData(plaintext, testKey);

      expect(typeof encrypted).toBe("string");
      expect(encrypted.length).toBeGreaterThan(0);
      expect(/^[A-Za-z0-9+/]*={0,2}$/.test(encrypted)).toBe(true);
    });

    it("should encrypt different data to different ciphertexts", async () => {
      const plaintext1 = "Hello, World!";
      const plaintext2 = "Hello, World!";

      const encrypted1 = await encryptData(plaintext1, testKey);
      const encrypted2 = await encryptData(plaintext2, testKey);

      // Different IVs should produce different ciphertexts
      expect(encrypted1).not.toBe(encrypted2);
    });

    it("should encrypt empty string", async () => {
      const plaintext = "";
      const encrypted = await encryptData(plaintext, testKey);

      expect(typeof encrypted).toBe("string");
      expect(encrypted.length).toBeGreaterThan(0);
    });

    it("should encrypt long text", async () => {
      const plaintext = "A".repeat(10000);
      const encrypted = await encryptData(plaintext, testKey);

      expect(typeof encrypted).toBe("string");
      expect(encrypted.length).toBeGreaterThan(plaintext.length);
    });

    it("should encrypt special characters", async () => {
      const plaintext = "!@#$%^&*()_+-=[]{}|;:,.<>?";
      const encrypted = await encryptData(plaintext, testKey);

      expect(typeof encrypted).toBe("string");
      expect(encrypted.length).toBeGreaterThan(0);
    });

    it("should encrypt unicode characters", async () => {
      const plaintext = "你好世界 🌍 مرحبا بالعالم";
      const encrypted = await encryptData(plaintext, testKey);

      expect(typeof encrypted).toBe("string");
      expect(encrypted.length).toBeGreaterThan(0);
    });
  });

  describe("decryptData", () => {
    it("should decrypt encrypted data", async () => {
      const plaintext = "Hello, World!";
      const encrypted = await encryptData(plaintext, testKey);
      const decrypted = await decryptData(encrypted, testKey);

      expect(decrypted).toBe(plaintext);
    });

    it("should decrypt empty string", async () => {
      const plaintext = "";
      const encrypted = await encryptData(plaintext, testKey);
      const decrypted = await decryptData(encrypted, testKey);

      expect(decrypted).toBe(plaintext);
    });

    it("should decrypt long text", async () => {
      const plaintext = "A".repeat(10000);
      const encrypted = await encryptData(plaintext, testKey);
      const decrypted = await decryptData(encrypted, testKey);

      expect(decrypted).toBe(plaintext);
    });

    it("should decrypt special characters", async () => {
      const plaintext = "!@#$%^&*()_+-=[]{}|;:,.<>?";
      const encrypted = await encryptData(plaintext, testKey);
      const decrypted = await decryptData(encrypted, testKey);

      expect(decrypted).toBe(plaintext);
    });

    it("should decrypt unicode characters", async () => {
      const plaintext = "你好世界 🌍 مرحبا بالعالم";
      const encrypted = await encryptData(plaintext, testKey);
      const decrypted = await decryptData(encrypted, testKey);

      expect(decrypted).toBe(plaintext);
    });

    it("should fail to decrypt with wrong key", async () => {
      const plaintext = "Hello, World!";
      const encrypted = await encryptData(plaintext, testKey);

      const wrongKey = await generateKey();
      await expect(decryptData(encrypted, wrongKey)).rejects.toThrow();
    });

    it("should fail to decrypt corrupted data", async () => {
      const plaintext = "Hello, World!";
      const encrypted = await encryptData(plaintext, testKey);

      // Corrupt the encrypted data
      const corrupted = encrypted.slice(0, -10) + "corrupted!";
      await expect(decryptData(corrupted, testKey)).rejects.toThrow();
    });

    it("should fail to decrypt invalid base64", async () => {
      const invalidBase64 = "not-valid-base64!!!";
      await expect(decryptData(invalidBase64, testKey)).rejects.toThrow();
    });
  });

  describe("Encryption Roundtrip", () => {
    it("should handle encrypt-decrypt roundtrip", async () => {
      const testCases = [
        "Hello, World!",
        "",
        "A".repeat(1000),
        "!@#$%^&*()",
        "你好世界",
        '{"key": "value"}',
        "Line1\nLine2\nLine3",
      ];

      for (const plaintext of testCases) {
        const encrypted = await encryptData(plaintext, testKey);
        const decrypted = await decryptData(encrypted, testKey);
        expect(decrypted).toBe(plaintext);
      }
    });

    it("should handle multiple roundtrips with same key", async () => {
      const plaintexts = ["First", "Second", "Third"];

      for (const plaintext of plaintexts) {
        const encrypted = await encryptData(plaintext, testKey);
        const decrypted = await decryptData(encrypted, testKey);
        expect(decrypted).toBe(plaintext);
      }
    });

    it("should handle export-import-encrypt-decrypt flow", async () => {
      const plaintext = "Test data";

      // Export key
      const exported = await exportKey(testKey);

      // Import key
      const imported = await importKey(exported);

      // Encrypt with imported key
      const encrypted = await encryptData(plaintext, imported);

      // Decrypt with imported key
      const decrypted = await decryptData(encrypted, imported);

      expect(decrypted).toBe(plaintext);
    });
  });

  describe("Security Properties", () => {
    it("should use different IVs for each encryption", async () => {
      const plaintext = "Same plaintext";

      // Encrypt same plaintext multiple times
      const encrypted1 = await encryptData(plaintext, testKey);
      const encrypted2 = await encryptData(plaintext, testKey);
      const encrypted3 = await encryptData(plaintext, testKey);

      // All ciphertexts should be different due to random IVs
      expect(encrypted1).not.toBe(encrypted2);
      expect(encrypted2).not.toBe(encrypted3);
      expect(encrypted1).not.toBe(encrypted3);
    });

    it("should produce valid AES-GCM ciphertexts", async () => {
      const plaintext = "Test data";
      const encrypted = await encryptData(plaintext, testKey);

      // Decrypt to verify it's valid
      const decrypted = await decryptData(encrypted, testKey);
      expect(decrypted).toBe(plaintext);
    });

    it("should include IV in encrypted output", async () => {
      const plaintext = "Test data";
      const encrypted = await encryptData(plaintext, testKey);

      // Encrypted data should be base64 encoded (IV + ciphertext)
      // IV is 12 bytes, so encrypted should be at least 16 bytes when decoded
      const decoded = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0));
      expect(decoded.length).toBeGreaterThanOrEqual(12);
    });
  });
});

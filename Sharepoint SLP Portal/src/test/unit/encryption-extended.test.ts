import { describe, it, expect, beforeEach } from "vitest";
import {
  encryptPHI,
  decryptPHI,
  rotateEncryptionKey,
  generateMasterKey,
} from "../../utils/encryption";

describe("Encryption Utility - Extended Coverage", () => {
  let masterKey: string;

  beforeEach(() => {
    masterKey = generateMasterKey();
  });

  describe("Basic Encryption/Decryption", () => {
    it("should encrypt and decrypt simple text", () => {
      const plaintext = "John Doe";
      const encrypted = encryptPHI(plaintext, masterKey);
      const decrypted = decryptPHI(encrypted, masterKey);
      expect(decrypted).toBe(plaintext);
    });

    it("should encrypt and decrypt SSN", () => {
      const ssn = "123-45-6789";
      const encrypted = encryptPHI(ssn, masterKey);
      const decrypted = decryptPHI(encrypted, masterKey);
      expect(decrypted).toBe(ssn);
    });

    it("should encrypt and decrypt email", () => {
      const email = "patient@example.com";
      const encrypted = encryptPHI(email, masterKey);
      const decrypted = decryptPHI(encrypted, masterKey);
      expect(decrypted).toBe(email);
    });

    it("should encrypt and decrypt phone number", () => {
      const phone = "555-123-4567";
      const encrypted = encryptPHI(phone, masterKey);
      const decrypted = decryptPHI(encrypted, masterKey);
      expect(decrypted).toBe(phone);
    });

    it("should produce different ciphertexts for same plaintext", () => {
      const plaintext = "test data";
      const encrypted1 = encryptPHI(plaintext, masterKey);
      const encrypted2 = encryptPHI(plaintext, masterKey);
      expect(encrypted1).not.toBe(encrypted2);
    });

    it("should fail decryption with wrong key", () => {
      const plaintext = "secret data";
      const encrypted = encryptPHI(plaintext, masterKey);
      const wrongKey = generateMasterKey();

      expect(() => {
        decryptPHI(encrypted, wrongKey);
      }).toThrow();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty string", () => {
      const encrypted = encryptPHI("", masterKey);
      const decrypted = decryptPHI(encrypted, masterKey);
      expect(decrypted).toBe("");
    });

    it("should handle very long text", () => {
      const longText = "a".repeat(10000);
      const encrypted = encryptPHI(longText, masterKey);
      const decrypted = decryptPHI(encrypted, masterKey);
      expect(decrypted).toBe(longText);
    });

    it("should handle special characters", () => {
      const special = "!@#$%^&*()_+-=[]{}|;:,.<>?";
      const encrypted = encryptPHI(special, masterKey);
      const decrypted = decryptPHI(encrypted, masterKey);
      expect(decrypted).toBe(special);
    });

    it("should handle unicode characters", () => {
      const unicode = "Café, naïve, résumé, 日本語";
      const encrypted = encryptPHI(unicode, masterKey);
      const decrypted = decryptPHI(encrypted, masterKey);
      expect(decrypted).toBe(unicode);
    });

    it("should handle newlines and tabs", () => {
      const multiline = "line1\nline2\tline3";
      const encrypted = encryptPHI(multiline, masterKey);
      const decrypted = decryptPHI(encrypted, masterKey);
      expect(decrypted).toBe(multiline);
    });

    it("should handle JSON strings", () => {
      const json = JSON.stringify({ name: "John", age: 30 });
      const encrypted = encryptPHI(json, masterKey);
      const decrypted = decryptPHI(encrypted, masterKey);
      expect(decrypted).toBe(json);
    });

    it("should handle base64 strings", () => {
      const base64 = Buffer.from("test data").toString("base64");
      const encrypted = encryptPHI(base64, masterKey);
      const decrypted = decryptPHI(encrypted, masterKey);
      expect(decrypted).toBe(base64);
    });
  });

  describe("Object Encryption", () => {
    it("should encrypt and decrypt text", () => {
      const plaintext = "sensitive data";
      const encrypted = encryptPHI(plaintext, masterKey);
      const decrypted = decryptPHI(encrypted, masterKey);
      expect(decrypted).toBe(plaintext);
    });

    it("should handle object-like strings", () => {
      const objString = JSON.stringify({ name: "John", ssn: "123-45-6789" });
      const encrypted = encryptPHI(objString, masterKey);
      const decrypted = decryptPHI(encrypted, masterKey);
      expect(decrypted).toBe(objString);
    });

    it("should preserve data types in JSON", () => {
      const data = { name: "John", age: 30, active: true };
      const jsonString = JSON.stringify(data);
      const encrypted = encryptPHI(jsonString, masterKey);
      const decrypted = decryptPHI(encrypted, masterKey);
      const parsed = JSON.parse(decrypted);

      expect(parsed.name).toBe("John");
      expect(parsed.age).toBe(30);
      expect(parsed.active).toBe(true);
    });

    it("should handle null values in JSON", () => {
      const data = { name: "John", ssn: null };
      const jsonString = JSON.stringify(data);
      const encrypted = encryptPHI(jsonString, masterKey);
      const decrypted = decryptPHI(encrypted, masterKey);
      const parsed = JSON.parse(decrypted);

      expect(parsed.ssn).toBeNull();
    });

    it("should handle undefined values in JSON", () => {
      const data = { name: "John", ssn: undefined };
      const jsonString = JSON.stringify(data);
      const encrypted = encryptPHI(jsonString, masterKey);
      const decrypted = decryptPHI(encrypted, masterKey);
      const parsed = JSON.parse(decrypted);

      expect(parsed.name).toBe("John");
    });

    it("should preserve object structure", () => {
      const data = { name: "John", ssn: "123-45-6789", age: 30 };
      const jsonString = JSON.stringify(data);
      const encrypted = encryptPHI(jsonString, masterKey);
      const decrypted = decryptPHI(encrypted, masterKey);
      const parsed = JSON.parse(decrypted);

      expect(parsed).toHaveProperty("name");
      expect(parsed).toHaveProperty("ssn");
      expect(parsed).toHaveProperty("age");
    });

    it("should handle nested objects in JSON", () => {
      const data = {
        name: "John",
        contact: { email: "john@example.com", phone: "555-1234" },
        age: 30,
      };
      const jsonString = JSON.stringify(data);
      const encrypted = encryptPHI(jsonString, masterKey);
      const decrypted = decryptPHI(encrypted, masterKey);
      const parsed = JSON.parse(decrypted);

      expect(parsed.contact.email).toBe("john@example.com");
      expect(parsed.contact.phone).toBe("555-1234");
    });
  });

  describe("Key Rotation", () => {
    it("should rotate encryption key", () => {
      const plaintext = "sensitive data";
      const encrypted = encryptPHI(plaintext, masterKey);

      const newKey = generateMasterKey();
      const rotated = rotateEncryptionKey(encrypted, masterKey, newKey);

      const decrypted = decryptPHI(rotated, newKey);
      expect(decrypted).toBe(plaintext);
    });

    it("should fail decryption with old key after rotation", () => {
      const plaintext = "sensitive data";
      const encrypted = encryptPHI(plaintext, masterKey);

      const newKey = generateMasterKey();
      const rotated = rotateEncryptionKey(encrypted, masterKey, newKey);

      expect(() => {
        decryptPHI(rotated, masterKey);
      }).toThrow();
    });

    it("should preserve data integrity during rotation", () => {
      const data = [
        "John Doe",
        "123-45-6789",
        "john@example.com",
        "555-123-4567",
      ];

      const newKey = generateMasterKey();

      for (const plaintext of data) {
        const encrypted = encryptPHI(plaintext, masterKey);
        const rotated = rotateEncryptionKey(encrypted, masterKey, newKey);
        const decrypted = decryptPHI(rotated, newKey);
        expect(decrypted).toBe(plaintext);
      }
    });

    it("should handle multiple key rotations", () => {
      const plaintext = "test data";
      let encrypted = encryptPHI(plaintext, masterKey);
      let currentKey = masterKey;

      for (let i = 0; i < 3; i++) {
        const newKey = generateMasterKey();
        encrypted = rotateEncryptionKey(encrypted, currentKey, newKey);
        currentKey = newKey;
      }

      const decrypted = decryptPHI(encrypted, currentKey);
      expect(decrypted).toBe(plaintext);
    });
  });

  describe("Concurrent Operations", () => {
    it("should handle concurrent encryptions", async () => {
      const plaintexts = ["data1", "data2", "data3", "data4", "data5"];

      const promises = plaintexts.map((text) =>
        Promise.resolve(encryptPHI(text, masterKey)),
      );

      const encrypted = await Promise.all(promises);
      expect(encrypted).toHaveLength(5);
      expect(new Set(encrypted).size).toBe(5); // All different
    });

    it("should handle concurrent decryptions", async () => {
      const plaintexts = ["data1", "data2", "data3"];
      const encrypted = plaintexts.map((text) => encryptPHI(text, masterKey));

      const promises = encrypted.map((cipher) =>
        Promise.resolve(decryptPHI(cipher, masterKey)),
      );

      const decrypted = await Promise.all(promises);
      expect(decrypted).toEqual(plaintexts);
    });

    it("should handle mixed concurrent operations", async () => {
      const operations = [
        Promise.resolve(encryptPHI("data1", masterKey)),
        Promise.resolve(encryptPHI("data2", masterKey)),
        Promise.resolve(encryptPHI("data3", masterKey)),
      ];

      const encrypted = await Promise.all(operations);
      expect(encrypted).toHaveLength(3);
    });
  });

  describe("Data Integrity", () => {
    it("should detect tampering with ciphertext", () => {
      const plaintext = "original data";
      const encrypted = encryptPHI(plaintext, masterKey);

      // Tamper with the encrypted data
      const tampered = encrypted.slice(0, -5) + "xxxxx";

      expect(() => {
        decryptPHI(tampered, masterKey);
      }).toThrow();
    });

    it("should detect truncated ciphertext", () => {
      const plaintext = "original data";
      const encrypted = encryptPHI(plaintext, masterKey);

      // Truncate the encrypted data
      const truncated = encrypted.slice(0, Math.floor(encrypted.length / 2));

      expect(() => {
        decryptPHI(truncated, masterKey);
      }).toThrow();
    });

    it("should validate authentication tag", () => {
      const plaintext = "original data";
      const encrypted = encryptPHI(plaintext, masterKey);

      // Modify a character in the middle
      const modified =
        encrypted.substring(0, 10) +
        (encrypted[10] === "a" ? "b" : "a") +
        encrypted.substring(11);

      expect(() => {
        decryptPHI(modified, masterKey);
      }).toThrow();
    });
  });

  describe("Performance", () => {
    it("should encrypt large data efficiently", () => {
      const largeData = "x".repeat(100000);
      const start = Date.now();
      const encrypted = encryptPHI(largeData, masterKey);
      const duration = Date.now() - start;

      expect(encrypted).toBeDefined();
      expect(duration).toBeLessThan(5000); // Should complete in < 5 seconds
    });

    it("should decrypt large data efficiently", () => {
      const largeData = "x".repeat(100000);
      const encrypted = encryptPHI(largeData, masterKey);

      const start = Date.now();
      const decrypted = decryptPHI(encrypted, masterKey);
      const duration = Date.now() - start;

      expect(decrypted).toBe(largeData);
      expect(duration).toBeLessThan(5000);
    });

    it("should handle batch operations", { timeout: 40000 }, () => {
      const data = Array(100)
        .fill(null)
        .map((_, i) => `data-${i}`);

      const start = Date.now();
      const encrypted = data.map((d) => encryptPHI(d, masterKey));
      const duration = Date.now() - start;

      expect(encrypted).toHaveLength(100);
      expect(duration).toBeLessThan(40000); // Adjusted for system performance variations
    });
  });

  describe("Key Management", () => {
    it("should generate unique master keys", () => {
      const key1 = generateMasterKey();
      const key2 = generateMasterKey();
      expect(key1).not.toBe(key2);
    });

    it("should generate valid master keys", () => {
      const key = generateMasterKey();
      expect(typeof key).toBe("string");
      expect(key.length).toBeGreaterThan(0);
    });

    it("should use different keys for different encryptions", () => {
      const plaintext = "test data";
      const key1 = generateMasterKey();
      const key2 = generateMasterKey();

      const encrypted1 = encryptPHI(plaintext, key1);
      const encrypted2 = encryptPHI(plaintext, key2);

      expect(encrypted1).not.toBe(encrypted2);
    });
  });
});

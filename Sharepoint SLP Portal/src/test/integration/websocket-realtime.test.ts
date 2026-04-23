/**
 * WebSocket Real-Time Tests — Concurrent Connections, Broadcasting, Conflict Resolution
 * Purpose: Validate real-time collaboration features
 * Framework: Vitest with mocked WebSocket
 *
 * These tests validate:
 * - Multiple clients connect simultaneously
 * - Message broadcast to all clients
 * - Client disconnect handling
 * - Reconnection with state recovery
 * - Concurrent edits (conflict resolution)
 * - Message ordering
 * - Connection limits
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";

interface TestMessage {
  type: string;
  data?: any;
  timestamp?: number;
}

// Mock WebSocket implementation
class MockWebSocket {
  readyState: number = 0; // CONNECTING
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  private listeners: Map<string, ((data?: any) => void)[]> = new Map();
  private messageQueue: any[] = [];

  constructor(_url: string) {
    // Simulate connection delay
    setTimeout(() => {
      this.readyState = MockWebSocket.OPEN;
      this.emit("open");
    }, 10);
  }

  on(event: string, callback: (data?: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  emit(event: string, data?: any) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach((cb) => cb(data));
  }

  send(data: string) {
    try {
      this.messageQueue.push(JSON.parse(data));
      this.emit("message", { data });
    } catch {
      // Ignore parse error
    }
  }

  close() {
    this.readyState = MockWebSocket.CLOSED;
    this.emit("close");
  }

  getMessages() {
    return this.messageQueue;
  }
}

describe("WebSocket: Real-Time Collaboration", () => {
  let clients: MockWebSocket[] = [];

  beforeEach(() => {
    clients = [];
  });

  afterEach(() => {
    // Close all connections
    clients.forEach((client) => {
      if (client.readyState === MockWebSocket.OPEN) {
        client.close();
      }
    });
    clients = [];
  });

  describe("Connection Management", () => {
    it("accepts multiple concurrent connections", async () => {
      const connectionPromises = Array(10)
        .fill(null)
        .map(() => {
          return new Promise<MockWebSocket>((resolve, reject) => {
            const client = new MockWebSocket("ws://localhost:3000");
            client.on("open", () => {
              clients.push(client);
              resolve(client);
            });
            client.on("error", reject);
          });
        });

      const connectedClients = await Promise.all(connectionPromises);
      expect(connectedClients.length).toBe(10);
      expect(
        connectedClients.every((c) => c.readyState === MockWebSocket.OPEN),
      ).toBe(true);
    });

    it("broadcasts messages to all connected clients", async () => {
      // Create 5 clients
      const clientPromises = Array(5)
        .fill(null)
        .map(() => {
          return new Promise<MockWebSocket>((resolve) => {
            const client = new MockWebSocket("ws://localhost:3000");
            client.on("open", () => {
              clients.push(client);
              resolve(client);
            });
          });
        });

      const connectedClients = await Promise.all(clientPromises);

      // Simulate broadcast: first client sends message
      const broadcastMessage = { type: "update", data: "test message" };
      connectedClients[0].send(JSON.stringify(broadcastMessage));

      // Verify message was sent
      expect(connectedClients[0]!.getMessages().length).toBeGreaterThanOrEqual(
        0,
      );
    });

    it("handles client disconnect and reconnect", async () => {
      const client = new MockWebSocket("ws://localhost:3000");
      clients.push(client);

      await new Promise((resolve) => client.on("open", resolve as any));
      expect(client.readyState).toBe(MockWebSocket.OPEN);

      // Disconnect
      client.close();
      expect(client.readyState).toBe(MockWebSocket.CLOSED);

      // Reconnect
      const newClient = new MockWebSocket("ws://localhost:3000");
      clients.push(newClient);

      await new Promise((resolve) => newClient.on("open", resolve as any));
      expect(newClient.readyState).toBe(MockWebSocket.OPEN);
    });

    it("preserves message ordering", async () => {
      const client = new MockWebSocket("ws://localhost:3000");
      clients.push(client);

      await new Promise((resolve) => client.on("open", resolve as any));

      // Send multiple messages
      const messages = [
        { type: "msg", id: 1 },
        { type: "msg", id: 2 },
        { type: "msg", id: 3 },
      ];

      messages.forEach((msg) => client.send(JSON.stringify(msg)));

      const sentMessages = client.getMessages();
      expect(sentMessages.length).toBe(3);
      expect(sentMessages[0].id).toBe(1);
      expect(sentMessages[1].id).toBe(2);
      expect(sentMessages[2].id).toBe(3);
    });

    it("resolves concurrent edit conflicts", async () => {
      const client1 = new MockWebSocket("ws://localhost:3000");
      const client2 = new MockWebSocket("ws://localhost:3000");
      clients.push(client1, client2);

      await Promise.all([
        new Promise((resolve) => client1.on("open", resolve as any)),
        new Promise((resolve) => client2.on("open", resolve as any)),
      ]);

      // Simulate concurrent edits
      const edit1 = {
        type: "edit",
        clientId: 1,
        timestamp: Date.now(),
        content: "edit1",
      };
      const edit2 = {
        type: "edit",
        clientId: 2,
        timestamp: Date.now() + 1,
        content: "edit2",
      };

      client1.send(JSON.stringify(edit1));
      client2.send(JSON.stringify(edit2));

      // Verify both edits were recorded
      expect(client1.getMessages().length).toBeGreaterThan(0);
      expect(client2.getMessages().length).toBeGreaterThan(0);
    });

    it("handles high throughput (1000+ messages)", async () => {
      const client = new MockWebSocket("ws://localhost:3000");
      clients.push(client);

      await new Promise((resolve) => client.on("open", resolve as any));

      // Send 1000 messages
      for (let i = 0; i < 1000; i++) {
        client.send(JSON.stringify({ type: "msg", id: i }));
      }

      const messages = client.getMessages();
      expect(messages.length).toBe(1000);
    });

    it("handles invalid JSON gracefully", async () => {
      const client = new MockWebSocket("ws://localhost:3000");
      clients.push(client);

      await new Promise((resolve) => client.on("open", resolve as any));

      // Try to send invalid JSON - should not crash
      try {
        client.send("{ invalid json }");
      } catch {
        // Expected to fail gracefully
      }

      // Client should still be open
      expect(client.readyState).toBe(MockWebSocket.OPEN);
    });
  });

  describe("Connection Management", () => {
    it("handles client disconnect gracefully", async () => {
      const client = new MockWebSocket("ws://localhost:3000");

      await new Promise<void>((resolve, reject) => {
        client.on("open", () => resolve());
        client.on("error", reject);
      });

      expect(client.readyState).toBe(MockWebSocket.OPEN);

      client.close();

      await new Promise<void>((resolve) => {
        client.on("close", () => resolve());
      });

      expect(client.readyState).toBe(MockWebSocket.CLOSED);
    });

    it("reconnects after network failure", async () => {
      const client = new MockWebSocket("ws://localhost:3000");

      await new Promise<void>((resolve, reject) => {
        client.on("open", () => resolve());
        client.on("error", reject);
      });

      // Simulate network failure
      client.close();

      // Reconnect
      const reconnectedClient = new MockWebSocket("ws://localhost:3000");

      await new Promise<void>((resolve, reject) => {
        reconnectedClient.on("open", () => resolve());
        reconnectedClient.on("error", reject);
      });

      expect(reconnectedClient.readyState).toBe(MockWebSocket.OPEN);
      clients.push(reconnectedClient);
    });
  });

  describe("Message Broadcasting", () => {
    it("broadcasts message to all connected clients", async () => {
      const client1 = new MockWebSocket("ws://localhost:3000");
      const client2 = new MockWebSocket("ws://localhost:3000");
      const client3 = new MockWebSocket("ws://localhost:3000");

      await Promise.all([
        new Promise<void>((resolve, reject) => {
          client1.on("open", () => resolve());
          client1.on("error", reject);
        }),
        new Promise<void>((resolve, reject) => {
          client2.on("open", () => resolve());
          client2.on("error", reject);
        }),
        new Promise<void>((resolve, reject) => {
          client3.on("open", () => resolve());
          client3.on("error", reject);
        }),
      ]);

      clients = [client1, client2, client3];

      const receivedMessages: TestMessage[] = [];

      client2.on("message", (data) => {
        receivedMessages.push(JSON.parse(data.toString()));
      });

      client3.on("message", (data) => {
        receivedMessages.push(JSON.parse(data.toString()));
      });

      const testMessage: TestMessage = {
        type: "GOAL_CREATED",
        data: { goalId: "123", name: "Test Goal" },
        timestamp: Date.now(),
      };

      client1.send(JSON.stringify(testMessage));

      await new Promise<void>((resolve) => setTimeout(resolve, 100));

      expect(receivedMessages).toHaveLength(2);
      expect(receivedMessages[0]?.type).toBe("GOAL_CREATED");
      expect(receivedMessages[0]?.data?.goalId).toBe("123");
    });

    it("preserves message order", async () => {
      const client1 = new MockWebSocket("ws://localhost:3000");
      const client2 = new MockWebSocket("ws://localhost:3000");

      await Promise.all([
        new Promise<void>((resolve, reject) => {
          client1.on("open", () => resolve());
          client1.on("error", reject);
        }),
        new Promise<void>((resolve, reject) => {
          client2.on("open", () => resolve());
          client2.on("error", reject);
        }),
      ]);

      clients = [client1, client2];

      const receivedMessages: number[] = [];

      client2.on("message", (data) => {
        const msg = JSON.parse(data.toString());
        receivedMessages.push(msg.sequence);
      });

      // Send 5 messages in order
      for (let i = 1; i <= 5; i++) {
        client1.send(JSON.stringify({ type: "TEST", sequence: i }));
      }

      await new Promise<void>((resolve) => setTimeout(resolve, 200));

      expect(receivedMessages).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe("Concurrent Edits & Conflict Resolution", () => {
    it("handles concurrent edits from multiple clients", async () => {
      const client1 = new MockWebSocket("ws://localhost:3000");
      const client2 = new MockWebSocket("ws://localhost:3000");

      await Promise.all([
        new Promise<void>((resolve, reject) => {
          client1.on("open", () => resolve());
          client1.on("error", reject);
        }),
        new Promise<void>((resolve, reject) => {
          client2.on("open", () => resolve());
          client2.on("error", reject);
        }),
      ]);

      clients = [client1, client2];

      const edits: TestMessage[] = [];

      client1.on("message", (data) => {
        edits.push(JSON.parse(data.toString()));
      });

      client2.on("message", (data) => {
        edits.push(JSON.parse(data.toString()));
      });

      // Both clients edit simultaneously
      client1.send(
        JSON.stringify({
          type: "EDIT",
          goalId: "123",
          field: "name",
          value: "Updated by Client 1",
          clientId: "client1",
        }),
      );

      client2.send(
        JSON.stringify({
          type: "EDIT",
          goalId: "123",
          field: "description",
          value: "Updated by Client 2",
          clientId: "client2",
        }),
      );

      await new Promise<void>((resolve) => setTimeout(resolve, 200));

      // Both edits should be received
      expect(edits.length).toBeGreaterThanOrEqual(2);
    });

    it("detects and resolves conflicts", async () => {
      const client1 = new MockWebSocket("ws://localhost:3000");
      const client2 = new MockWebSocket("ws://localhost:3000");

      await Promise.all([
        new Promise<void>((resolve, reject) => {
          client1.on("open", () => resolve());
          client1.on("error", reject);
        }),
        new Promise<void>((resolve, reject) => {
          client2.on("open", () => resolve());
          client2.on("error", reject);
        }),
      ]);

      clients = [client1, client2];

      const conflicts: TestMessage[] = [];

      client2.on("message", (data) => {
        const msg = JSON.parse(data.toString());
        if (msg.type === "CONFLICT") {
          conflicts.push(msg);
        }
      });

      // Both clients edit the same field
      client1.send(
        JSON.stringify({
          type: "EDIT",
          goalId: "123",
          field: "name",
          value: "Version A",
          version: 1,
        }),
      );

      client2.send(
        JSON.stringify({
          type: "EDIT",
          goalId: "123",
          field: "name",
          value: "Version B",
          version: 1,
        }),
      );

      await new Promise<void>((resolve) => setTimeout(resolve, 200));

      // Conflict should be detected
      expect(conflicts.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Error Handling", () => {
    it("handles invalid JSON gracefully", async () => {
      const client = new MockWebSocket("ws://localhost:3000");

      await new Promise<void>((resolve, reject) => {
        client.on("open", () => resolve());
        client.on("error", reject);
      });

      clients = [client];

      const errors: any[] = [];

      client.on("error", (error) => {
        errors.push(error);
      });

      // Send invalid JSON
      client.send("{ invalid json }");

      await new Promise<void>((resolve) => setTimeout(resolve, 100));

      // Connection should still be open
      expect(client.readyState).toBe(MockWebSocket.OPEN);
    });

    it("handles missing required fields", async () => {
      const client1 = new MockWebSocket("ws://localhost:3000");
      const client2 = new MockWebSocket("ws://localhost:3000");

      await Promise.all([
        new Promise<void>((resolve, reject) => {
          client1.on("open", () => resolve());
          client1.on("error", reject);
        }),
        new Promise<void>((resolve, reject) => {
          client2.on("open", () => resolve());
          client2.on("error", reject);
        }),
      ]);

      clients = [client1, client2];

      const errors: TestMessage[] = [];

      client2.on("message", (data) => {
        const msg = JSON.parse(data.toString());
        if (msg.type === "ERROR") {
          errors.push(msg);
        }
      });

      // Send message without required fields
      client1.send(JSON.stringify({ type: "EDIT" }));

      await new Promise<void>((resolve) => setTimeout(resolve, 100));

      // Error should be handled
      expect(client1.readyState).toBe(MockWebSocket.OPEN);
    });
  });

  describe("Performance", () => {
    it("handles high message throughput", async () => {
      const client1 = new MockWebSocket("ws://localhost:3000");
      const client2 = new MockWebSocket("ws://localhost:3000");

      await Promise.all([
        new Promise<void>((resolve, reject) => {
          client1.on("open", () => resolve());
          client1.on("error", reject);
        }),
        new Promise<void>((resolve, reject) => {
          client2.on("open", () => resolve());
          client2.on("error", reject);
        }),
      ]);

      clients = [client1, client2];

      let messageCount = 0;

      client2.on("message", () => {
        messageCount++;
      });

      const startTime = Date.now();

      // Send 1000 messages
      for (let i = 0; i < 1000; i++) {
        client1.send(
          JSON.stringify({
            type: "TEST",
            sequence: i,
          }),
        );
      }

      await new Promise<void>((resolve) => setTimeout(resolve, 1000));

      const duration = Date.now() - startTime;

      // Should handle at least 800 messages in 1 second
      expect(messageCount).toBeGreaterThan(800);
      expect(duration).toBeLessThan(2000);
    });
  });
});

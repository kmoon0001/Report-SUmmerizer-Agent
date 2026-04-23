import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { collabService } from "../../services/collaboration-service";

describe("CollaborationService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (collabService as any)._resetListeners();
  });

  afterEach(() => {
    vi.clearAllMocks();
    (collabService as any)._resetListeners();
  });

  it("should initialize", () => {
    expect(collabService).toBeDefined();
  });

  it("should broadcast VIEW_CHANGED", () => {
    const listener = vi.fn();
    collabService.subscribe(listener);
    const event = { type: "VIEW_CHANGED" as const, view: "dashboard" };
    collabService.broadcast(event);
    expect(listener).toHaveBeenCalledWith(event);
  });

  it("should broadcast PATIENT_UPDATED", () => {
    const listener = vi.fn();
    collabService.subscribe(listener);
    const event = {
      type: "PATIENT_UPDATED" as const,
      profileId: "patient-123",
    };
    collabService.broadcast(event);
    expect(listener).toHaveBeenCalledWith(event);
  });

  it("should broadcast CURSOR_MOVED", () => {
    const listener = vi.fn();
    collabService.subscribe(listener);
    const event = {
      type: "CURSOR_MOVED" as const,
      x: 100,
      y: 200,
      userId: "user-123",
    };
    collabService.broadcast(event);
    expect(listener).toHaveBeenCalledWith(event);
  });

  it("should broadcast to multiple listeners", () => {
    const listener1 = vi.fn();
    const listener2 = vi.fn();
    const listener3 = vi.fn();
    collabService.subscribe(listener1);
    collabService.subscribe(listener2);
    collabService.subscribe(listener3);
    const event = { type: "VIEW_CHANGED" as const, view: "settings" };
    collabService.broadcast(event);
    expect(listener1).toHaveBeenCalledWith(event);
    expect(listener2).toHaveBeenCalledWith(event);
    expect(listener3).toHaveBeenCalledWith(event);
  });

  it("should subscribe listener", () => {
    const listener = vi.fn();
    collabService.subscribe(listener);
    const event = { type: "VIEW_CHANGED" as const, view: "home" };
    collabService.broadcast(event);
    expect(listener).toHaveBeenCalled();
  });

  it("should return unsubscribe function", () => {
    const listener = vi.fn();
    const unsubscribe = collabService.subscribe(listener);
    expect(typeof unsubscribe).toBe("function");
  });

  it("should unsubscribe listener", () => {
    const listener = vi.fn();
    const unsubscribe = collabService.subscribe(listener);
    const event1 = { type: "VIEW_CHANGED" as const, view: "home" };
    collabService.broadcast(event1);
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
    const event2 = { type: "VIEW_CHANGED" as const, view: "settings" };
    collabService.broadcast(event2);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("should handle multiple subscriptions", () => {
    const listener1 = vi.fn();
    const listener2 = vi.fn();
    const unsub1 = collabService.subscribe(listener1);
    collabService.subscribe(listener2);
    const event1 = { type: "VIEW_CHANGED" as const, view: "home" };
    collabService.broadcast(event1);
    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledTimes(1);
    unsub1();
    const event2 = { type: "VIEW_CHANGED" as const, view: "settings" };
    collabService.broadcast(event2);
    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledTimes(2);
  });

  it("should not call unsubscribed listeners", () => {
    const listener = vi.fn();
    const unsubscribe = collabService.subscribe(listener);
    unsubscribe();
    const event = { type: "VIEW_CHANGED" as const, view: "home" };
    collabService.broadcast(event);
    expect(listener).not.toHaveBeenCalled();
  });

  it("should handle VIEW_CHANGED events", () => {
    const listener = vi.fn();
    collabService.subscribe(listener);
    const event = { type: "VIEW_CHANGED" as const, view: "clinical-library" };
    collabService.broadcast(event);
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "VIEW_CHANGED",
        view: "clinical-library",
      }),
    );
  });

  it("should handle PATIENT_UPDATED events", () => {
    const listener = vi.fn();
    collabService.subscribe(listener);
    const event = { type: "PATIENT_UPDATED" as const, profileId: "p-789" };
    collabService.broadcast(event);
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ type: "PATIENT_UPDATED", profileId: "p-789" }),
    );
  });

  it("should handle CURSOR_MOVED events", () => {
    const listener = vi.fn();
    collabService.subscribe(listener);
    const event = {
      type: "CURSOR_MOVED" as const,
      x: 500,
      y: 600,
      userId: "user-abc",
    };
    collabService.broadcast(event);
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "CURSOR_MOVED",
        x: 500,
        y: 600,
        userId: "user-abc",
      }),
    );
  });

  it("should handle multi-user view changes", () => {
    const user1Listener = vi.fn();
    const user2Listener = vi.fn();
    collabService.subscribe(user1Listener);
    collabService.subscribe(user2Listener);
    collabService.broadcast({
      type: "VIEW_CHANGED" as const,
      view: "dashboard",
    });
    expect(user1Listener).toHaveBeenCalledTimes(1);
    expect(user2Listener).toHaveBeenCalledTimes(1);
    collabService.broadcast({
      type: "VIEW_CHANGED" as const,
      view: "settings",
    });
    expect(user1Listener).toHaveBeenCalledTimes(2);
    expect(user2Listener).toHaveBeenCalledTimes(2);
  });

  it("should handle patient updates across users", () => {
    const listener1 = vi.fn();
    const listener2 = vi.fn();
    collabService.subscribe(listener1);
    collabService.subscribe(listener2);
    collabService.broadcast({
      type: "PATIENT_UPDATED" as const,
      profileId: "patient-123",
    });
    expect(listener1).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "PATIENT_UPDATED",
        profileId: "patient-123",
      }),
    );
    expect(listener2).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "PATIENT_UPDATED",
        profileId: "patient-123",
      }),
    );
  });

  it("should handle cursor tracking", () => {
    const listener = vi.fn();
    collabService.subscribe(listener);
    collabService.broadcast({
      type: "CURSOR_MOVED" as const,
      x: 100,
      y: 200,
      userId: "user-1",
    });
    collabService.broadcast({
      type: "CURSOR_MOVED" as const,
      x: 300,
      y: 400,
      userId: "user-2",
    });
    expect(listener).toHaveBeenCalledTimes(2);
  });
});

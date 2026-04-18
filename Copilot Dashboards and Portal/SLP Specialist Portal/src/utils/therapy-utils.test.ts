import { describe, it, expect } from "vitest";
import {
  getInstructions,
  getInitialGameState,
  GameConfig,
  GameItem,
} from "./therapy-utils";

describe("Therapy Utils", () => {
  describe("getInstructions", () => {
    it("returns correct instructions for matching", () => {
      expect(getInstructions("matching")).toBe("Find the matching pairs.");
    });

    it("returns correct instructions for sequencing", () => {
      expect(getInstructions("sequencing")).toBe(
        "Drag the items into the correct order.",
      );
    });

    it("returns correct instructions for naming", () => {
      expect(getInstructions("naming")).toBe("Name the item shown.");
    });

    it("returns correct instructions for roleplay", () => {
      expect(getInstructions("roleplay", "Barista", "Order coffee")).toBe(
        "Chat with the Barista. Goal: Order coffee",
      );
    });

    it("returns correct instructions for puzzle", () => {
      expect(getInstructions("puzzle")).toBe(
        "Arrange the tiles to complete the picture.",
      );
    });

    it("returns default instructions for unknown type", () => {
      expect(getInstructions("apraxia")).toBe("");
    });
  });

  describe("getInitialGameState", () => {
    const mockItems: GameItem[] = [
      { id: "1", content: "Item 1", type: "text" },
      { id: "2", content: "Item 2", type: "text" },
      { id: "3", content: "Item 3", type: "text" },
    ];

    it("initializes matching game state correctly", () => {
      const game: GameConfig = {
        id: "1",
        title: "Test Game",
        type: "matching",
        items: mockItems,
        instructions: "",
      };
      const { gameState, chatHistory } = getInitialGameState(game);
      expect(gameState.shuffledItems).toHaveLength(3);
      expect(gameState.selected).toEqual([]);
      expect(gameState.matched).toEqual([]);
      expect(chatHistory).toBeNull();
    });

    it("initializes sequencing game state correctly", () => {
      const game: GameConfig = {
        id: "1",
        title: "Test Game",
        type: "sequencing",
        items: mockItems,
        instructions: "",
      };
      const { gameState, chatHistory } = getInitialGameState(game);
      expect(gameState.shuffledItems).toHaveLength(3);
      expect(gameState.ordered).toEqual([]);
      expect(chatHistory).toBeNull();
    });

    it("initializes roleplay game state correctly", () => {
      const game: GameConfig = {
        id: "1",
        title: "Test Game",
        type: "roleplay",
        items: [],
        instructions: "",
        persona: "Doctor",
      };
      const { gameState, chatHistory } = getInitialGameState(game);
      expect(gameState).toEqual({});
      expect(chatHistory).toHaveLength(1);
      expect(chatHistory![0]!.text).toContain("Doctor");
    });

    it("initializes naming game state correctly", () => {
      const game: GameConfig = {
        id: "1",
        title: "Test Game",
        type: "naming",
        items: mockItems,
        instructions: "",
      };
      const { gameState, chatHistory } = getInitialGameState(game);
      expect(gameState.shuffledItems).toHaveLength(3);
      expect(chatHistory).toBeNull();
    });

    it("initializes puzzle game state correctly", () => {
      const game: GameConfig = {
        id: "1",
        title: "Test Game",
        type: "puzzle",
        items: mockItems,
        instructions: "",
      };
      const { gameState, chatHistory } = getInitialGameState(game);
      expect(gameState.tiles).toHaveLength(2);
      expect(gameState.originalTile!.id).toBe("3");
      expect(gameState.isComplete).toBe(false);
      expect(gameState.correctOrder).toEqual(["1", "2"]);
      expect(chatHistory).toBeNull();
    });
  });
});

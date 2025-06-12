import { Tile } from "@/models/tile.model";
import gameReducer, {
  initialState,
  gameActions,
  CREATE_TILE,
} from "@/reducers/game.reducer";
import { act, renderHook } from "@testing-library/react";
import { useReducer } from "react";

/**
 * Test suite for the game reducer
 */
describe("gameReducer", () => {
  /**
   * Helper function to create a test tile
   */
  const createTestTile = (
    position: [number, number],
    value: number = 2,
  ): Tile => ({
    position,
    value,
  });

  /**
   * Helper function to setup reducer hook for testing
   */
  const setupReducerHook = () => {
    return renderHook(() => useReducer(gameReducer, initialState));
  };

  /**
   * Helper function to get current state and dispatch from hook result
   */
  const getStateAndDispatch = (result: any) => {
    const [state, dispatch] = result.current;
    return { state, dispatch };
  };

  describe("Initial State", () => {
    it("should have correct initial state structure", () => {
      expect(initialState).toEqual({
        board: expect.any(Array),
        tiles: {},
      });
    });

    it("should initialize with empty 4x4 board", () => {
      expect(initialState.board).toHaveLength(4);
      expect(initialState.board[0]).toHaveLength(4);
      expect(
        initialState.board.every((row) =>
          row.every((cell) => cell === undefined),
        ),
      ).toBe(true);
    });

    it("should initialize with empty tiles object", () => {
      expect(initialState.tiles).toEqual({});
      expect(Object.keys(initialState.tiles)).toHaveLength(0);
    });
  });

  describe("CREATE_TILE Action", () => {
    it("should create a new tile at specified position", () => {
      const testTile = createTestTile([0, 0], 2);
      const { result } = setupReducerHook();

      act(() => {
        const { dispatch } = getStateAndDispatch(result);
        dispatch(gameActions.createTile(testTile));
      });

      const { state } = getStateAndDispatch(result);

      // Verify tile is placed on board
      expect(state.board[0][0]).toBeDefined();
      expect(typeof state.board[0][0]).toBe("string");

      // Verify tile is added to tiles collection
      expect(Object.keys(state.tiles)).toHaveLength(1);
      expect(Object.values(state.tiles)[0]).toEqual(testTile);
    });

    it("should generate unique tile IDs", () => {
      const testTile1 = createTestTile([0, 0], 2);
      const testTile2 = createTestTile([0, 1], 4);
      const { result } = setupReducerHook();

      act(() => {
        const { dispatch } = getStateAndDispatch(result);
        dispatch(gameActions.createTile(testTile1));
        dispatch(gameActions.createTile(testTile2));
      });

      const { state } = getStateAndDispatch(result);
      const tileIds = Object.keys(state.tiles);

      expect(tileIds).toHaveLength(2);
      expect(tileIds[0]).not.toEqual(tileIds[1]);
      expect(state.board[0][0]).toEqual(tileIds[0]);
      expect(state.board[1][0]).toEqual(tileIds[1]);
    });

    it("should preserve existing tiles when creating new ones", () => {
      const firstTile = createTestTile([0, 0], 2);
      const secondTile = createTestTile([1, 1], 4);
      const { result } = setupReducerHook();

      // Create first tile
      act(() => {
        const { dispatch } = getStateAndDispatch(result);
        dispatch(gameActions.createTile(firstTile));
      });

      // Create second tile
      act(() => {
        const { dispatch } = getStateAndDispatch(result);
        dispatch(gameActions.createTile(secondTile));
      });

      const { state } = getStateAndDispatch(result);

      expect(Object.keys(state.tiles)).toHaveLength(2);
      expect(Object.values(state.tiles)).toContain(firstTile);
      expect(Object.values(state.tiles)).toContain(secondTile);
      expect(state.board[0][0]).toBeDefined();
      expect(state.board[1][1]).toBeDefined();
    });

    it("should handle different tile values correctly", () => {
      const tilesWithDifferentValues = [
        createTestTile([0, 0], 2),
        createTestTile([0, 1], 4),
        createTestTile([0, 2], 8),
        createTestTile([0, 3], 16),
      ];

      const { result } = setupReducerHook();

      tilesWithDifferentValues.forEach((tile) => {
        act(() => {
          const { dispatch } = getStateAndDispatch(result);
          dispatch(gameActions.createTile(tile));
        });
      });

      const { state } = getStateAndDispatch(result);
      const createdTiles = Object.values(state.tiles);

      expect(createdTiles).toHaveLength(4);
      expect(
        createdTiles.map((tile: unknown): number => (tile as Tile)!.value),
      ).toEqual([2, 4, 8, 16]);
    });

    it("should work with legacy action format for backward compatibility", () => {
      const testTile = createTestTile([2, 2], 8);
      const { result } = setupReducerHook();

      act(() => {
        const { dispatch } = getStateAndDispatch(result);
        // Test legacy action format
        dispatch({ type: CREATE_TILE, payload: { tile: testTile } });
      });

      const { state } = getStateAndDispatch(result);

      expect(state.board[2][2]).toBeDefined();
      expect(Object.values(state.tiles)[0]).toEqual(testTile);
    });
  });

  describe("Error Handling", () => {
    it("should throw error for invalid position coordinates", () => {
      const invalidTile = createTestTile([4, 4], 2); // Out of bounds for 4x4 board
      const { result } = setupReducerHook();

      expect(() => {
        act(() => {
          const { dispatch } = getStateAndDispatch(result);
          dispatch(gameActions.createTile(invalidTile));
        });
      }).toThrow("Invalid tile position");
    });

    it("should throw error for negative position coordinates", () => {
      const invalidTile = createTestTile([-1, 0], 2);
      const { result } = setupReducerHook();

      expect(() => {
        act(() => {
          const { dispatch } = getStateAndDispatch(result);
          dispatch(gameActions.createTile(invalidTile));
        });
      }).toThrow("Invalid tile position");
    });

    it("should throw error when trying to place tile on occupied position", () => {
      const firstTile = createTestTile([1, 1], 2);
      const secondTile = createTestTile([1, 1], 4); // Same position
      const { result } = setupReducerHook();

      // Place first tile
      act(() => {
        const { dispatch } = getStateAndDispatch(result);
        dispatch(gameActions.createTile(firstTile));
      });

      // Try to place second tile at same position
      expect(() => {
        act(() => {
          const { dispatch } = getStateAndDispatch(result);
          dispatch(gameActions.createTile(secondTile));
        });
      }).toThrow("Position [1, 1] is already occupied");
    });
  });

  describe("State Immutability", () => {
    it("should not mutate original state", () => {
      const testTile = createTestTile([1, 1], 2);
      const { result } = setupReducerHook();

      const { state: originalState } = getStateAndDispatch(result);
      const originalBoard = originalState.board;
      const originalTiles = originalState.tiles;

      act(() => {
        const { dispatch } = getStateAndDispatch(result);
        dispatch(gameActions.createTile(testTile));
      });

      // Original references should remain unchanged
      expect(originalBoard).toBe(initialState.board);
      expect(originalTiles).toBe(initialState.tiles);
      expect(originalBoard[1][1]).toBeUndefined();
      expect(Object.keys(originalTiles)).toHaveLength(0);
    });

    it("should create new board reference after state change", () => {
      const testTile = createTestTile([0, 0], 2);
      const { result } = setupReducerHook();

      const { state: stateBefore } = getStateAndDispatch(result);

      act(() => {
        const { dispatch } = getStateAndDispatch(result);
        dispatch(gameActions.createTile(testTile));
      });

      const { state: stateAfter } = getStateAndDispatch(result);

      expect(stateAfter.board).not.toBe(stateBefore.board);
      expect(stateAfter.tiles).not.toBe(stateBefore.tiles);
    });
  });

  describe("Action Creators", () => {
    it("should create correct action structure with gameActions.createTile", () => {
      const testTile = createTestTile([2, 3], 16);
      const action = gameActions.createTile(testTile);

      expect(action).toEqual({
        type: CREATE_TILE,
        payload: {
          tile: testTile,
        },
      });
    });
  });

  describe("Unknown Actions", () => {
    it("should return current state for unknown action types", () => {
      const { result } = setupReducerHook();
      const { state: initialStateFromHook } = getStateAndDispatch(result);

      act(() => {
        const { dispatch } = getStateAndDispatch(result);
        // @ts-ignore - Testing unknown action type
        dispatch({ type: "UNKNOWN_ACTION" });
      });

      const { state: stateAfterUnknownAction } = getStateAndDispatch(result);

      expect(stateAfterUnknownAction).toEqual(initialStateFromHook);
    });
  });
});

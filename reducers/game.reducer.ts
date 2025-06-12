import { Tile } from "@/models/tile.model";
import { v4 as uuidv4 } from "uuid";

/**
 * Action types for the game reducer
 */
export const CREATE_TILE = "CREATE_TILE" as const;

/**
 * Type definition for CREATE_TILE action
 */
export type CREATE_TILE_ACTION = typeof CREATE_TILE;

/**
 * Game state interface
 * Represents the current state of the game board and tiles
 */
interface GameState {
  /** 2D grid representing the game board with tile IDs */
  board: string[][];
  /** Map of tile IDs to their corresponding Tile objects */
  tiles: Record<string, Tile>;
}

/**
 * Union type for all possible game actions
 */
type GameAction = {
  type: CREATE_TILE_ACTION;
  payload: {
    tile: Tile;
  };
};

/**
 * Configuration constants for the game
 */
const GAME_CONFIG = {
  DEFAULT_BOARD_SIZE: 4,
} as const;

/**
 * Creates a new empty game board with specified dimensions
 *
 * @param size - The number of tiles per dimension (default: 4)
 * @returns A 2D array representing an empty game board
 *
 * @example
 * ```typescript
 * const board = createBoard(3); // Creates a 3x3 board
 * // Returns: [
 * //   [undefined, undefined, undefined],
 * //   [undefined, undefined, undefined],
 * //   [undefined, undefined, undefined]
 * // ]
 * ```
 */
function createBoard(
  size: number = GAME_CONFIG.DEFAULT_BOARD_SIZE,
): string[][] {
  return Array.from({ length: size }, () => Array(size).fill(undefined));
}

/**
 * Creates a deep copy of the game board
 *
 * @param board - The board to clone
 * @returns A deep copy of the provided board
 */
function cloneBoard(board: string[][]): string[][] {
  return board.map((row) => [...row]);
}

/**
 * Validates if a position is within the board boundaries
 *
 * @param position - The [x, y] coordinates to validate
 * @param boardSize - The size of the board
 * @returns True if the position is valid, false otherwise
 */
function isValidPosition(
  position: [number, number],
  boardSize: number,
): boolean {
  const [x, y] = position;
  return x >= 0 && x < boardSize && y >= 0 && y < boardSize;
}

/**
 * Validates if a board position is empty
 *
 * @param board - The game board
 * @param position - The [x, y] coordinates to check
 * @returns True if the position is empty, false otherwise
 */
function isPositionEmpty(
  board: string[][],
  position: [number, number],
): boolean {
  const [x, y] = position;
  return board[y][x] === undefined;
}

/**
 * Initial state of the game
 */
export const initialState: GameState = {
  board: createBoard(),
  tiles: {},
};

/**
 * Handles the CREATE_TILE action
 * Creates a new tile on the board and adds it to the tiles collection
 *
 * @param state - Current game state
 * @param tile - The tile to be created
 * @returns Updated game state with the new tile
 * @throws Error if the tile position is invalid or already occupied
 */
function handleCreateTile(state: GameState, tile: Tile): GameState {
  const { position } = tile;
  const boardSize = state.board.length;

  // Validate position bounds
  if (!isValidPosition(position, boardSize)) {
    throw new Error(
      `Invalid tile position [${position[0]}, ${position[1]}]. ` +
        `Position must be within bounds [0-${boardSize - 1}, 0-${boardSize - 1}].`,
    );
  }

  // Validate position availability
  if (!isPositionEmpty(state.board, position)) {
    throw new Error(
      `Position [${position[0]}, ${position[1]}] is already occupied.`,
    );
  }

  // Generate unique ID for the new tile
  const tileId = uuidv4();
  const [x, y] = position;

  // Create updated board with new tile
  const updatedBoard = cloneBoard(state.board);
  updatedBoard[y][x] = tileId;

  return {
    ...state,
    board: updatedBoard,
    tiles: {
      ...state.tiles,
      [tileId]: tile,
    },
  };
}

/**
 * Game reducer function
 * Manages the game state based on dispatched actions
 *
 * @param state - Current game state (defaults to initialState)
 * @param action - The action to be processed
 * @returns Updated game state based on the action
 *
 * @example
 * ```typescript
 * const newState = gameReducer(currentState, {
 *   type: CREATE_TILE,
 *   payload: {
 *     tile: { position: [0, 0], value: 2 }
 *   }
 * });
 * ```
 */
export default function gameReducer(
  state: GameState = initialState,
  action: GameAction,
): GameState {
  switch (action.type) {
    case CREATE_TILE:
      return handleCreateTile(state, action.payload.tile);

    default:
      return state;
  }
}

/**
 * Action creators for the game reducer
 */
export const gameActions = {
  /**
   * Creates an action to add a new tile to the game board
   *
   * @param tile - The tile to be created
   * @returns CREATE_TILE action object
   */
  createTile: (tile: Tile): GameAction => ({
    type: CREATE_TILE,
    payload: { tile },
  }),
} as const;

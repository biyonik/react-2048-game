import { Tile } from "@/models/tile.model";
import { v4 as uuidv4 } from "uuid";

type State = {
  board: string[][];
  tiles: {
    [id: string]: Tile;
  };
};

type Action = {
  type: "CREATE_TILE";
  tile: Tile;
};

function createBoard(tileCountPerDimension: number = 4): string[][] {
  const board: string[][] = [];

  for (let i = 0; i < tileCountPerDimension; i++) {
    board[i] = new Array(tileCountPerDimension).fill(undefined);
  }

  return board;
}

export const initialState: State = {
  board: createBoard(),
  tiles: {},
};

export default function gameReducer(
  state: State = initialState,
  action: Action,
) {
  switch (action.type) {
    case "CREATE_TILE": {
      const tileId = uuidv4();
      const [x, y] = action.tile.position;
      const newBoard = JSON.parse(JSON.stringify(state.board));
      newBoard[y][x] = tileId;

      return {
        ...state,
        board: newBoard,
        tiles: {
          ...state.tiles,
          [tileId]: action.tile,
        },
      };
    }
    default:
      return state;
  }
}

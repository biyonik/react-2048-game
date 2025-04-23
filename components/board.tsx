import React from "react";
import styles from "@/styles/board.module.css";
import { v4 as uuidv4 } from "uuid";
import Tile from "./tile";

const Board: React.FC = (): React.ReactNode => {
  return (
    <div className={styles.board}>
      <div className={styles.tiles}>
        <Tile />
      </div>
      <div className={styles.grid}>
        {Array.from({ length: 16 }).map(() => (
          <div key={uuidv4()} className={styles.cell}></div>
        ))}
      </div>
    </div>
  );
};

export default Board;

import React from "react";
import styles from "@/styles/board.module.css";
import { nanoid } from "nanoid";
import Tile from "./tile";

const Board: React.FC = (): React.ReactNode => {
  return (
    <div className={styles.board}>
      <div className={styles.tiles}>
        <Tile />
      </div>
      <div className={styles.grid}>
        {Array.from({ length: 4 }).map(() => {
          return Array.from({ length: 4 }).map(() => (
            <div key={nanoid()} className={styles.cell}></div>
          ));
        })}
      </div>
    </div>
  );
};

export default Board;

import React from "react";
import './Board.css'

interface BoardProps {
  height: number;
  width: number;
  // 他の必要なプロパティを追加
}

const Board: React.FC<BoardProps> = ({ height, width }) => {
    const handleCellClick = (row: number, column: number) => {
      // マスをクリックしたときの処理を記述する
    };
  
    const renderCells = () => {
      const cells = [];
  
      for (let row = 0; row < height; row++) {
        const rowCells = []; // 1行のセルを格納する配列
  
        for (let column = 0; column < width; column++) {
          const cellKey = `${row}-${column}`;
          const cell = (
            <Cell
              key={cellKey}
              isOpen={true}
              hasMine={false}
              adjacentMines={0}
              onClick={() => handleCellClick(row, column)}
            />
          );
          rowCells.push(cell);
        }
  
        const rowElement = <div key={`row-${row}`} className="row">{rowCells}</div>;
        cells.push(rowElement);
      }
  
      return cells;
    };
  
    return <div className="board">{renderCells()}</div>;
  };


interface CellProps {
  isOpen: boolean; // マスが開かれているかどうかを示すフラグ
  hasMine: boolean; // マスに地雷があるかどうかを示すフラグ
  adjacentMines: number; // 隣接するマスに存在する地雷の数
  onClick: () => void; // マスをクリックしたときのハンドラー関数
}

const Cell: React.FC<CellProps> = ({ isOpen, hasMine, adjacentMines, onClick }) => {
  return (
    <div className={`cell ${isOpen ? 'open' : ''}`} onClick={onClick}>
      {isOpen && !hasMine && adjacentMines > 0 && <span className="adjacent-mines">{adjacentMines}</span>}
      {isOpen && hasMine && <span className="mine">💣</span>}
    </div>
  );
};

export default Board;
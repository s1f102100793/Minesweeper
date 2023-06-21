import React, { useState } from 'react';
import './Board.css'

interface BoardProps {
  height: number;
  width: number;
}

const Board: React.FC<BoardProps> = ({ height, width }) => {
  const minesCount = 10;
  const initialBoard = generateInitialBoard(height, width, minesCount);
  const [boardState, setBoardState] = useState(initialBoard); // Add state for board state
  const [isFirstClick, setIsFirstClick] = useState(true); // Add state for isFirstClick

  const openCell = (row: number, column: number) => {
    const newBoardState = JSON.parse(JSON.stringify(boardState));
    const queue: Array<{ row: number; col: number }> = []; // キューに入れる座標を保持
    queue.push({ row, col: column });
  
    while (queue.length > 0) {
      const { row, col } = queue.shift()!;
  
      if (
        row < 0 || row >= height || col < 0 || col >= width ||
        newBoardState[row][col].isOpen || newBoardState[row][col].hasMine
      ) {
        continue;
      }
  
      newBoardState[row][col].isOpen = true;
  
      if (newBoardState[row][col].adjacentMines === 0) {
        for (let r = row - 1; r <= row + 1; r++) {
          for (let c = col - 1; c <= col + 1; c++) {
            if (!(r === row && c === col)) {
              queue.push({ row: r, col: c });
            }
          }
        }
      }
    }
  
    setBoardState(newBoardState); // setBoardState() を openCell() の中で呼び出す
  };

  const handleCellClick = (row: number, column: number) => {
  if (isFirstClick) {
    setIsFirstClick(false);
    const newBoardState = generateInitialBoard(height, width, minesCount, row, column);
    setBoardState(newBoardState);
    openCell(row, column);
  } else {
    if (boardState[row][column].hasMine) {
      alert("Game Over");
      setIsFirstClick(true);
      setBoardState(initialBoard);
    } else {
      openCell(row, column);
    }
  }
};

  const renderCells = () => {
    const cells = [];

    for (let row = 0; row < height; row++) {
      const rowCells = [];

      for (let column = 0; column < width; column++) {
        const cell = boardState[row][column];
        const cellKey = `${row}-${column}`;

        rowCells.push(
          <Cell
            key={cellKey}
            open={cell.isOpen}
            hasMine={cell.hasMine}
            isMineVisible={true} // ここをfalseに変更すると、ボムが非表示になります。
            adjacentMines={cell.adjacentMines}
            onClick={() => handleCellClick(row, column)}
          />
        );
      }

      cells.push(<div key={`row-${row}`} className="row">{rowCells}</div>);
    }

    return cells;
  };

  return (
    <div className="board-container">
      <div className="board">{renderCells()}</div>
    </div>
  );
};


interface CellProps {
  open: boolean;
  hasMine: boolean;
  isMineVisible: boolean;
  adjacentMines: number;
  onClick: () => void;
}

const Cell: React.FC<CellProps> = ({ open, hasMine, isMineVisible, adjacentMines, onClick }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick();
  };

  return (
    <div className={`cell ${open ? 'open' : ''}`} onClick={handleClick}>
      {!hasMine && adjacentMines > 0 && open && <span className="adjacent-mines">{adjacentMines}</span>}
      {hasMine && isMineVisible && open && <span className="mine">💣</span>}
    </div>
  );
};


export default Board;

function generateInitialBoard(
  height: number,
  width: number,
  minesCount: number,
  firstClickRow: number | null = null,
  firstClickColumn: number | null = null
) {
  const board = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => ({
      isOpen: false,
      hasMine: false,
      adjacentMines: 0,
    }))
  );

  let plantedMines = 0;

  while (plantedMines < minesCount) {
    const row = Math.floor(Math.random() * height);
    const col = Math.floor(Math.random() * width);

    if (!board[row][col].hasMine && (firstClickRow === null || row !== firstClickRow || col !== firstClickColumn)) {
      board[row][col].hasMine = true;
      plantedMines++;

      for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
          if (
            r >= 0 &&
            r < height &&
            c >= 0 &&
            c < width &&
            !(r === row && c === col)
          ) {
            board[r][c].adjacentMines++;
          }
        }
      }
    }
  }

  return board;
}
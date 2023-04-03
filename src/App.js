import { useEffect, useState } from "react";
import GridItem from "./GridItem";
import "./styles.css";

export default function App() {
  const [state, setState] = useState();

  const board = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0]
  ];
  const board1 = [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0]
  ];
  const quantities = { smallSq: 0, vertRect: 4, bigSq: 1, horizRect: 0 };

  const assets = [
    { id: "A", width: 100, height: 100, color: "red" },
    { id: "B", width: 100, height: 100, color: "green" },
    { id: "C", width: 100, height: 100, color: "blue" },
    { id: "D", width: 100, height: 100, color: "yellow" },
    { id: "E", width: 200, height: 200, color: "orange" },
    { id: "F", width: 100, height: 200, color: "pink" },
    { id: "G", width: 200, height: 100, color: "purple" }
  ];

  const shapeDimentions = {
    smallSq: { width: 1, height: 1 },
    bigSq: { width: 2, height: 2 },
    horizRect: { width: 2, height: 1 },
    vertRect: { width: 1, height: 2 }
  };

  const result = [];

  const boardHeight = board.length;
  const boardWidth = board[0].length;

  const visited = Array(boardHeight)
    .fill()
    .map(() => Array(boardWidth).fill(false));

  let wellList = [];

  // ============================ function ============================

  function createMatrix(rows, cols, val) {
    // Initialize an empty matrix
    const matrix = [];

    // Loop through the rows and create a new array for each row
    for (let i = 0; i < rows; i++) {
      const row = [];

      // Loop through the columns and push the specified value to the row array for each column
      for (let j = 0; j < cols; j++) {
        row.push(val);
      }

      // Push the row array to the matrix array
      matrix.push(row);
    }

    // Return the completed matrix
    return matrix;
  }

  function createShapeMatrix(dimensions) {
    // Initialize an empty shape matrix object
    const shapeMatrix = {};

    // Loop through each shape in the dimensions object
    for (const shape in dimensions) {
      // Get the width and height of the shape
      const { width, height } = dimensions[shape];

      // Create a matrix with the specified dimensions and use the first character of the shape name as the value for each cell, capitalized
      const matrix = createMatrix(height, width, shape.charAt(0).toUpperCase());

      // Add the matrix to the shape matrix object with the shape name as the key
      shapeMatrix[shape] = matrix;
    }

    // Return the completed shape matrix object
    return shapeMatrix;
  }

  function assignNames(assets) {
    const widths = assets.map((asset) => asset.width);
    const maxWidth = Math.max(...widths);
    const minWidth = Math.min(...widths);

    assets.forEach((asset) => {
      if (asset.width < asset.height) {
        asset.name = "vertRect";
      } else if (asset.width > asset.height) {
        asset.name = "horizRect";
      } else if (
        asset.width === asset.height &&
        asset.width > (maxWidth + minWidth) / 2
      ) {
        asset.name = "bigSq";
      } else if (
        asset.width === asset.height &&
        asset.width < (maxWidth + minWidth) / 2
      ) {
        asset.name = "smallSq";
      }
    });
  }

  function addAssetsToResults() {
    const mergedAssets = new Set();

    for (let i = 0; i < assets.length; i++) {
      for (let j = 0; j < result.length; j++) {
        if (
          assets[i].name === result[j].name &&
          !result[j].hasOwnProperty("id") &&
          !mergedAssets.has(assets[i].id)
        ) {
          result[j] = { ...result[j], ...assets[i] };
          mergedAssets.add(assets[i].id);
        }
      }
    }
    console.log("mergedAssets=", mergedAssets);
  }

  function print(board) {
    for (let row = 0; row < board.length; row++) {
      let rowString = "";
      for (let col = 0; col < board[0].length; col++) {
        rowString += board[row][col] + " ";
      }
      console.log(rowString);
    }
  }

  function shuffleArray(shapeList) {
    for (let i = shapeList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shapeList[i], shapeList[j]] = [shapeList[j], shapeList[i]];
    }
    return shapeList;
  }

  function isValidPlacement(shape, r, c) {
    const shapeRows = shape.length;
    const shapeCols = shape[0].length;
    if (r + shapeRows > boardHeight || c + shapeCols > boardWidth) {
      return false;
    }
    for (let i = 0; i < shapeRows; i++) {
      for (let j = 0; j < shapeCols; j++) {
        if (shape[i][j] !== 0 && board[r + i][c + j] !== 0) {
          return false;
        }
      }
    }
    return true;
  }

  function placeShape(shape, r, c) {
    const shapeRows = shape.length;
    const shapeCols = shape[0].length;
    for (let i = 0; i < shapeRows; i++) {
      for (let j = 0; j < shapeCols; j++) {
        if (shape[i][j] !== 0) {
          board[r + i][c + j] = shape[i][j];
        }
      }
    }
  }

  function removeShape(shape, r, c) {
    const shapeRows = shape.length;
    const shapeCols = shape[0].length;
    for (let i = 0; i < shapeRows; i++) {
      for (let j = 0; j < shapeCols; j++) {
        if (shape[i][j] !== 0) {
          board[r + i][c + j] = 0;
        }
      }
    }
  }

  function backtrack(index) {
    if (index === wellList.length) {
      return true;
    }
    for (let r = 0; r < boardHeight; r++) {
      for (let c = 0; c < boardWidth; c++) {
        if (visited[r][c]) {
          continue;
        }
        const well = wellList[index];
        if (isValidPlacement(well.matrix, r, c)) {
          placeShape(well.matrix, r, c);

          visited[r][c] = true;

          if (backtrack(index + 1)) {
            const rowStart = r + 1;
            const rowEnd = r + well.matrix.length + 1;
            const colStart = c + 1;
            const colEnd = c + well.matrix[0].length + 1;

            result.push({
              name: well.name,
              rowStart: rowStart,
              rowEnd: rowEnd,
              colStart: colStart,
              colEnd: colEnd
            });

            return true;
          } else {
            visited[r][c] = false;
            removeShape(well.shape, r, c);
          }
        }
      }
    }
    return false;
  }

  function fillBoard(board, quantities, shapeMatrix) {
    for (const shape in quantities) {
      for (let i = 0; i < quantities[shape]; i++) {
        wellList.push({ name: shape, matrix: shapeMatrix[shape] });
      }
    }

    wellList = shuffleArray(wellList);

    if (backtrack(0)) {
      print(board);
    } else {
      console.log("No solution found.");
    }
  }

  // ============================ effect ============================

  useEffect(() => {
    const shapeMatrix = createShapeMatrix(shapeDimentions);

    assignNames(assets);
    console.log("assets=", assets);
    fillBoard(board, quantities, shapeMatrix);
    addAssetsToResults();
    console.log(result);
    console.log("====");

    setState(result);
  }, []);

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <div
        className="grid-container"
        style={{
          gridTemplateRows: `repeat(${board.length}, 1fr)`,
          gridTemplateColumns: `repeat(${board[0].length}, 1fr)`
        }}
      >
        <>
          {state &&
            state.map((item, key) => (
              <GridItem
                key={key}
                colStart={item.colStart}
                colEnd={item.colEnd}
                rowStart={item.rowStart}
                rowEnd={item.rowEnd}
                color={item.color}
                id={item.id}
              />
            ))}
        </>
      </div>
    </div>
  );
}

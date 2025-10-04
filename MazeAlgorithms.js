import { UnionFind } from './UnionFind';

export const MAZE_CONFIG = {
  CELL_SIZE: 20,
  DIRECTIONS: [
    { dir: 'top', dr: -1, dc: 0 },
    { dir: 'right', dr: 0, dc: 1 },
    { dir: 'bottom', dr: 1, dc: 0 },
    { dir: 'left', dr: 0, dc: -1 }
  ],
  OPPOSITE_DIR: {
    right: 'left',
    bottom: 'top',
    left: 'right',
    top: 'bottom'
  }
};

export const shuffleArray = (arr) => {
  const newArr = [...arr];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export const createEmptyMaze = (rows, cols) => {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      top: true, right: true, bottom: true, left: true
    }))
  );
};

export const generateWalls = (rows, cols, shuffleArray) => {
  const walls = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (c < cols - 1) walls.push({ r, c, dir: 'right', nr: r, nc: c + 1 });
      if (r < rows - 1) walls.push({ r, c, dir: 'bottom', nr: r + 1, nc: c });
    }
  }
  return shuffleArray(walls);
};

export const removeWall = (maze, wall, OPPOSITE_DIR) => {
  const { r, c, dir, nr, nc } = wall;
  maze[r][c][dir] = false;
  maze[nr][nc][OPPOSITE_DIR[dir]] = false;
};

export const generateMazeKruskal = async (newMaze, rows, cols, delay, updateMaze) => {
  const walls = generateWalls(rows, cols, shuffleArray);
  const uf = new UnionFind(rows * cols);

  for (const wall of walls) {
    const cell1 = wall.r * cols + wall.c;
    const cell2 = wall.nr * cols + wall.nc;

    if (uf.union(cell1, cell2)) {
      removeWall(newMaze, wall, MAZE_CONFIG.OPPOSITE_DIR);
      updateMaze([...newMaze]);
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
};

export const generateMazePrim = async (newMaze, rows, cols, delay, updateMaze) => {
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const walls = [];
  
  const addWalls = (r, c) => {
    visited[r][c] = true;
    for (const { dir, dr, dc } of MAZE_CONFIG.DIRECTIONS) {
      const [nr, nc] = [r + dr, c + dc];
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc]) {
        walls.push({ r, c, dir, nr, nc });
      }
    }
  };

  const startR = Math.floor(Math.random() * rows);
  const startC = Math.floor(Math.random() * cols);
  addWalls(startR, startC);

  while (walls.length > 0) {
    const wallIndex = Math.floor(Math.random() * walls.length);
    const wall = walls[wallIndex];
    walls.splice(wallIndex, 1);

    if (!visited[wall.nr][wall.nc]) {
      removeWall(newMaze, wall, MAZE_CONFIG.OPPOSITE_DIR);
      addWalls(wall.nr, wall.nc);
      updateMaze([...newMaze]);
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
};

export const generateMazeBacktracking = async (newMaze, rows, cols, delay, updateMaze) => {
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const stack = [[0, 0]];
  visited[0][0] = true;

  while (stack.length > 0) {
    const [r, c] = stack[stack.length - 1];
    const unvisitedNeighbors = [];

    for (const { dir, dr, dc } of MAZE_CONFIG.DIRECTIONS) {
      const [nr, nc] = [r + dr, c + dc];
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc]) {
        unvisitedNeighbors.push({ dir, nr, nc });
      }
    }

    if (unvisitedNeighbors.length > 0) {
      const neighbor = unvisitedNeighbors[Math.floor(Math.random() * unvisitedNeighbors.length)];
      removeWall(newMaze, { r, c, dir: neighbor.dir, nr: neighbor.nr, nc: neighbor.nc }, MAZE_CONFIG.OPPOSITE_DIR);
      visited[neighbor.nr][neighbor.nc] = true;
      stack.push([neighbor.nr, neighbor.nc]);
      updateMaze([...newMaze]);
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    } else {
      stack.pop();
    }
  }
};

export const generateMazeEller = async (newMaze, rows, cols, delay, updateMaze) => {
  let sets = Array.from({ length: cols }, (_, i) => i);
  let nextSet = cols;

  const findSet = (cell) => {
    if (sets[cell] === cell) return cell;
    return sets[cell] = findSet(sets[cell]);
  };

  const unionSets = (cell1, cell2) => {
    const root1 = findSet(cell1);
    const root2 = findSet(cell2);
    if (root1 !== root2) {
      sets[root2] = root1;
      return true;
    }
    return false;
  };

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols - 1; c++) {
      if (Math.random() > 0.5 || r === rows - 1) {
        if (unionSets(c, c + 1)) {
          removeWall(newMaze, { r, c, dir: 'right', nr: r, nc: c + 1 }, MAZE_CONFIG.OPPOSITE_DIR);
          updateMaze([...newMaze]);
          if (delay > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }
    }

    if (r < rows - 1) {
      const setCells = {};
      for (let c = 0; c < cols; c++) {
        const setId = findSet(c);
        if (!setCells[setId]) setCells[setId] = [];
        setCells[setId].push(c);
      }

      for (const setId in setCells) {
        const cells = setCells[setId];
        const verticalCount = Math.max(1, Math.floor(Math.random() * cells.length) + 1);
        const shuffled = shuffleArray([...cells]);
        
        for (let i = 0; i < verticalCount; i++) {
          const c = shuffled[i];
          removeWall(newMaze, { r, c, dir: 'bottom', nr: r + 1, nc: c }, MAZE_CONFIG.OPPOSITE_DIR);
          updateMaze([...newMaze]);
          if (delay > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }

      const newSets = Array(cols).fill(-1);
      for (let c = 0; c < cols; c++) {
        if (!newMaze[r][c].bottom) {
          newSets[c] = findSet(c);
        } else {
          newSets[c] = nextSet++;
        }
      }
      sets = newSets;
    }
  }
};
import { PriorityQueue } from './Algorithms/PriorityQueue';
import { MAZE_CONFIG } from './Algorithms/MazeAlgorithms';

export const findPathDFS = async (mazeData, rows, cols) => {
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const parent = Array.from({ length: rows }, () => Array(cols).fill(null));
  const stack = [[0, 0]];
  visited[0][0] = true;
  let visitedCount = 0;
  let found = false;

  while (stack.length && !found) {
    const [r, c] = stack.pop();
    visitedCount++;

    if (r === rows - 1 && c === cols - 1) {
      found = true;
      break;
    }

    for (const { dir, dr, dc } of MAZE_CONFIG.DIRECTIONS) {
      const [nr, nc] = [r + dr, c + dc];
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && 
          !mazeData[r][c][dir] && !visited[nr][nc]) {
        visited[nr][nc] = true;
        parent[nr][nc] = [r, c];
        stack.push([nr, nc]);
      }
    }
  }

  const pathArr = [];
  let curr = [rows - 1, cols - 1];
  while (curr) {
    pathArr.unshift(curr);
    curr = parent[curr[0]][curr[1]];
  }

  return { pathArr, visitedCount };
};

export const findPathBFS = async (mazeData, rows, cols) => {
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const parent = Array.from({ length: rows }, () => Array(cols).fill(null));
  const queue = [[0, 0]];
  visited[0][0] = true;
  let visitedCount = 0;
  let found = false;

  while (queue.length && !found) {
    const [r, c] = queue.shift();
    visitedCount++;

    if (r === rows - 1 && c === cols - 1) {
      found = true;
      break;
    }

    for (const { dir, dr, dc } of MAZE_CONFIG.DIRECTIONS) {
      const [nr, nc] = [r + dr, c + dc];
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && 
          !mazeData[r][c][dir] && !visited[nr][nc]) {
        visited[nr][nc] = true;
        parent[nr][nc] = [r, c];
        queue.push([nr, nc]);
      }
    }
  }

  const pathArr = [];
  let curr = [rows - 1, cols - 1];
  while (curr) {
    pathArr.unshift(curr);
    curr = parent[curr[0]][curr[1]];
  }

  return { pathArr, visitedCount };
};

const heuristic = (a, b) => {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
};

export const findPathAStar = async (mazeData, rows, cols) => {
  const start = [0, 0];
  const end = [rows - 1, cols - 1];
  
  const openSet = new PriorityQueue((a, b) => a.f - b.f);
  const cameFrom = new Map();
  const gScore = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  const fScore = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  const inOpenSet = Array.from({ length: rows }, () => Array(cols).fill(false));
  
  gScore[0][0] = 0;
  fScore[0][0] = heuristic(start, end);
  openSet.enqueue({ pos: start, f: fScore[0][0] });
  inOpenSet[0][0] = true;
  
  let visitedCount = 0;

  while (!openSet.isEmpty()) {
    const current = openSet.dequeue();
    const [r, c] = current.pos;
    
    inOpenSet[r][c] = false;
    visitedCount++;

    if (r === end[0] && c === end[1]) break;

    for (const { dir, dr, dc } of MAZE_CONFIG.DIRECTIONS) {
      const [nr, nc] = [r + dr, c + dc];
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && 
          !mazeData[r][c][dir]) {
        const tentativeG = gScore[r][c] + 1;
        
        if (tentativeG < gScore[nr][nc]) {
          cameFrom.set(`${nr},${nc}`, [r, c]);
          gScore[nr][nc] = tentativeG;
          fScore[nr][nc] = tentativeG + heuristic([nr, nc], end);
          
          if (!inOpenSet[nr][nc]) {
            openSet.enqueue({ pos: [nr, nc], f: fScore[nr][nc] });
            inOpenSet[nr][nc] = true;
          }
        }
      }
    }
  }

  const pathArr = [];
  let curr = end;
  while (curr && (curr[0] !== start[0] || curr[1] !== start[1])) {
    pathArr.unshift(curr);
    const key = `${curr[0]},${curr[1]}`;
    curr = cameFrom.get(key);
  }
  if (pathArr.length > 0) {
    pathArr.unshift(start);
  }

  return { pathArr, visitedCount };
};
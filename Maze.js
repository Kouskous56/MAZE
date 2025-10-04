import React, { useCallback } from 'react';
import { MAZE_CONFIG } from './Algorithms/MazeAlgorithms';

const Maze = ({ maze, path, rows, cols }) => {
  const isInPath = useCallback((r, c) => 
    path.some(([pr, pc]) => pr === r && pc === c), [path]);

  const getCellColor = useCallback((r, c) => {
    if (r === 0 && c === 0) return '#10b981';
    if (r === rows - 1 && c === cols - 1) return '#ef4444';
    if (isInPath(r, c)) return '#fbbf24';
    return 'white';
  }, [rows, cols, isInPath]);

  const renderWall = useCallback((r, c, wall) => {
    if (!maze[r] || !maze[r][c] || !maze[r][c][wall]) return null;
    
    const coords = {
      top: [c * MAZE_CONFIG.CELL_SIZE + 1, r * MAZE_CONFIG.CELL_SIZE + 1, (c + 1) * MAZE_CONFIG.CELL_SIZE + 1, r * MAZE_CONFIG.CELL_SIZE + 1],
      right: [(c + 1) * MAZE_CONFIG.CELL_SIZE + 1, r * MAZE_CONFIG.CELL_SIZE + 1, (c + 1) * MAZE_CONFIG.CELL_SIZE + 1, (r + 1) * MAZE_CONFIG.CELL_SIZE + 1],
      bottom: [c * MAZE_CONFIG.CELL_SIZE + 1, (r + 1) * MAZE_CONFIG.CELL_SIZE + 1, (c + 1) * MAZE_CONFIG.CELL_SIZE + 1, (r + 1) * MAZE_CONFIG.CELL_SIZE + 1],
      left: [c * MAZE_CONFIG.CELL_SIZE + 1, r * MAZE_CONFIG.CELL_SIZE + 1, c * MAZE_CONFIG.CELL_SIZE + 1, (r + 1) * MAZE_CONFIG.CELL_SIZE + 1]
    };

    const [x1, y1, x2, y2] = coords[wall];
    return <line key={`${r}-${c}-${wall}`} {...{x1, y1, x2, y2}} stroke="#1f2937" strokeWidth="2" />;
  }, [maze]);

  const renderWalls = useCallback((r, c) => {
    if (!maze[r] || !maze[r][c]) return null;
    return ['top', 'right', 'bottom', 'left']
      .map(wall => renderWall(r, c, wall))
      .filter(Boolean);
  }, [maze, renderWall]);

  if (!maze.length) return null;

  return (
    <div className="flex justify-center overflow-auto">
      <svg
        width={Math.min(cols * MAZE_CONFIG.CELL_SIZE + 2, 800)}
        height={Math.min(rows * MAZE_CONFIG.CELL_SIZE + 2, 600)}
        className="border-2 border-gray-800 bg-white rounded-lg"
        viewBox={`0 0 ${cols * MAZE_CONFIG.CELL_SIZE + 2} ${rows * MAZE_CONFIG.CELL_SIZE + 2}`}
      >
        {maze.map((row, r) =>
          row.map((cell, c) => (
            <g key={`${r}-${c}`}>
              <rect
                x={c * MAZE_CONFIG.CELL_SIZE + 1}
                y={r * MAZE_CONFIG.CELL_SIZE + 1}
                width={MAZE_CONFIG.CELL_SIZE}
                height={MAZE_CONFIG.CELL_SIZE}
                fill={getCellColor(r, c)}
              />
              {renderWalls(r, c)}
            </g>
          ))
        )}
      </svg>
    </div>
  );
};

export default Maze;
import React from 'react';

const Controls = ({
  rows,
  setRows,
  cols,
  setCols,
  animationSpeed,
  setAnimationSpeed,
  mazeAlgorithm,
  setMazeAlgorithm,
  pathAlgorithm,
  setPathAlgorithm,
  generateMaze,
  findPath,
  isGenerating,
  isFindingPath,
  maze
}) => {
  const disabled = isGenerating || isFindingPath;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <label className="flex items-center font-semibold text-gray-700">
            Số hàng:
            <input
              type="number"
              value={rows}
              onChange={(e) => setRows(Math.max(5, Math.min(30, +e.target.value || 5)))}
              className="ml-2 w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              min="5"
              max="30"
              disabled={disabled}
            />
          </label>
          
          <label className="flex items-center font-semibold text-gray-700">
            Số cột:
            <input
              type="number"
              value={cols}
              onChange={(e) => setCols(Math.max(5, Math.min(40, +e.target.value || 5)))}
              className="ml-2 w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              min="5"
              max="40"
              disabled={disabled}
            />
          </label>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <label className="flex items-center font-semibold text-gray-700">
            Tốc độ:
            <select
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(+e.target.value)}
              className="ml-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={disabled}
            >
              <option value={10}>Chậm</option>
              <option value={50}>Trung bình</option>
              <option value={90}>Nhanh</option>
              <option value={100}>Rất nhanh</option>
            </select>
          </label>

          <label className="flex items-center font-semibold text-gray-700">
            Thuật toán tạo:
            <select
              value={mazeAlgorithm}
              onChange={(e) => setMazeAlgorithm(e.target.value)}
              className="ml-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={disabled}
            >
              <option value="kruskal">Kruskal</option>
              <option value="prim">Prim</option>
              <option value="backtracking">Backtracking (DFS)</option>
              <option value="eller">Eller</option>
            </select>
          </label>

          <label className="flex items-center font-semibold text-gray-700">
            Thuật toán tìm:
            <select
              value={pathAlgorithm}
              onChange={(e) => setPathAlgorithm(e.target.value)}
              className="ml-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={disabled}
            >
              <option value="bfs">BFS (Breadth-First)</option>
              <option value="dfs">DFS (Depth-First)</option>
              <option value="astar">A* (Heuristic)</option>
            </select>
          </label>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={generateMaze}
          disabled={disabled}
          className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold shadow-md"
        >
          {isGenerating ? 'Đang tạo...' : 'Tạo Mê Cung (Ctrl+G)'}
        </button>
        
        <button
          onClick={findPath}
          disabled={!maze.length || disabled}
          className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold shadow-md"
        >
          {isFindingPath ? 'Đang tìm...' : 'Tìm Đường (Ctrl+F)'}
        </button>
      </div>
    </div>
  );
};

export default Controls;
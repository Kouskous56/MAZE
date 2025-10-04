import React from 'react';

const Stats = ({ stats }) => {
  if (!stats.generationTime && !stats.pathfindingTime) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
      <div className="text-center">
        <div className="text-sm text-gray-600">Thời gian tạo</div>
        <div className="font-semibold text-purple-700">{stats.generationTime.toFixed(0)}ms</div>
      </div>
      <div className="text-center">
        <div className="text-sm text-gray-600">Thời gian tìm</div>
        <div className="font-semibold text-blue-700">{stats.pathfindingTime.toFixed(0)}ms</div>
      </div>
      <div className="text-center">
        <div className="text-sm text-gray-600">Độ dài đường</div>
        <div className="font-semibold text-green-700">{stats.pathLength} ô</div>
      </div>
      <div className="text-center">
        <div className="text-sm text-gray-600">Ô đã duyệt</div>
        <div className="font-semibold text-orange-700">{stats.visitedCells}</div>
      </div>
    </div>
  );
};

export default Stats;
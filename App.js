import React, { useState, useCallback, useEffect } from 'react';
import Maze from './components/Maze';
import Controls from './components/Controls';
import Stats from './components/Stats';
import { 
  createEmptyMaze, 
  generateMazeKruskal, 
  generateMazePrim, 
  generateMazeBacktracking, 
  generateMazeEller 
} from './components/Algorithms/MazeAlgorithms';
import { findPathBFS, findPathDFS, findPathAStar } from './components/PathFindingAlgorithms';

const App = () => {
  const [rows, setRows] = useState(15);
  const [cols, setCols] = useState(20);
  const [maze, setMaze] = useState([]);
  const [path, setPath] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFindingPath, setIsFindingPath] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(50);
  const [pathAlgorithm, setPathAlgorithm] = useState('bfs');
  const [mazeAlgorithm, setMazeAlgorithm] = useState('kruskal');
  const [stats, setStats] = useState({
    generationTime: 0,
    pathfindingTime: 0,
    pathLength: 0,
    visitedCells: 0
  });

  const generateMaze = useCallback(async () => {
    setIsGenerating(true);
    setPath([]);
    setStats({ generationTime: 0, pathfindingTime: 0, pathLength: 0, visitedCells: 0 });
    
    const startTime = performance.now();
    const newMaze = createEmptyMaze(rows, cols);
    const delay = animationSpeed < 100 ? Math.max(1, 110 - animationSpeed) : 0;

    try {
      switch(mazeAlgorithm) {
        case 'kruskal':
          await generateMazeKruskal(newMaze, rows, cols, delay, setMaze);
          break;
        case 'prim':
          await generateMazePrim(newMaze, rows, cols, delay, setMaze);
          break;
        case 'backtracking':
          await generateMazeBacktracking(newMaze, rows, cols, delay, setMaze);
          break;
        case 'eller':
          await generateMazeEller(newMaze, rows, cols, delay, setMaze);
          break;
        default:
          await generateMazeKruskal(newMaze, rows, cols, delay, setMaze);
      }
    } catch (error) {
      console.error('Error generating maze:', error);
    }

    const endTime = performance.now();
    setStats(prev => ({ ...prev, generationTime: endTime - startTime }));
    setMaze(newMaze);
    setIsGenerating(false);
  }, [rows, cols, mazeAlgorithm, animationSpeed]);

  const findPath = useCallback(async () => {
    if (!maze.length) return;
    
    setIsFindingPath(true);
    setPath([]);

    const startTime = performance.now();
    let pathFinder;
    
    switch(pathAlgorithm) {
      case 'bfs':
        pathFinder = findPathBFS;
        break;
      case 'dfs':
        pathFinder = findPathDFS;
        break;
      case 'astar':
        pathFinder = findPathAStar;
        break;
      default:
        pathFinder = findPathBFS;
    }
    
    try {
      const { pathArr, visitedCount } = await pathFinder(maze, rows, cols);
      const delay = animationSpeed < 100 ? Math.max(1, 110 - animationSpeed) : 0;

      for (let i = 0; i <= pathArr.length; i++) {
        setPath(pathArr.slice(0, i));
        if (delay > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }

      const endTime = performance.now();
      setStats(prev => ({ 
        ...prev, 
        pathfindingTime: endTime - startTime,
        visitedCells: visitedCount,
        pathLength: pathArr.length 
      }));
    } catch (error) {
      console.error('Error finding path:', error);
    }
    
    setIsFindingPath(false);
  }, [maze, pathAlgorithm, animationSpeed, rows, cols]);

  useEffect(() => {
      const handleKeyPress = (e) => {
        if (e.ctrlKey || e.metaKey) {
          if (e.key === 'g') {
            e.preventDefault();
            !isGenerating && generateMaze();
          }
          if (e.key === 'f') {
            e.preventDefault();
            !isFindingPath && maze.length && findPath();
          }
        }
      };

      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }, [generateMaze, findPath, isGenerating, isFindingPath, maze.length]);}
export default App;

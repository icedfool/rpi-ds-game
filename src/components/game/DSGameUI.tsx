import React, { useState } from 'react';
import { AlertCircle, Book, Coffee, Users, Code, Brain } from 'lucide-react';

// Game state interface
interface GameState {
  name: string;
  credit_hours: number;
  stress_level: number;
  understanding: number;
  homework_completed: number;
  lab_points: number;
  current_week: number;
  risk_level: number;
  current_grade: string;
}

// API service
const API_BASE_URL = 'http://localhost:8000/api';

const gameService = {
  startGame: async (name: string, creditHours: number = 12) => {
    const response = await fetch(`${API_BASE_URL}/game/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, credit_hours: creditHours }),
    });
    return response.json();
  },

  performAction: async (playerName: string, action: string) => {
    const response = await fetch(`${API_BASE_URL}/game/${playerName}/action`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action }),
    });
    return response.json();
  },
};

const ProgressBar = ({ value, color = '#3b82f6' }: { value: number; color?: string }) => (
  <div className="w-full bg-gray-200 rounded h-2">
    <div 
      className="h-full rounded transition-all duration-300"
      style={{ width: `${value}%`, backgroundColor: color }}
    />
  </div>
);

const DSGameUI = () => {
  const [gameState, setGameState] = useState<GameState>({
    name: '',
    credit_hours: 12,
    stress_level: 0,
    understanding: 0,
    homework_completed: 0,
    lab_points: 0,
    current_week: 1,
    risk_level: 0,
    current_grade: 'N/A',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Start game
  const startGame = async () => {
    if (!gameState.name) {
      setError('Please enter your name');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newState = await gameService.startGame(gameState.name, gameState.credit_hours);
      setGameState(newState);
      setGameStarted(true);
    } catch (err) {
      setError('Failed to start game. Please try again.');
      console.error('Failed to start game:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Perform action
  const performAction = async (action: string) => {
    if (!gameState.name || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const newState = await gameService.performAction(gameState.name, action);
      setGameState(newState);
    } catch (err) {
      setError('Failed to perform action. Please try again.');
      console.error('Failed to perform action:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial interface
  if (!gameStarted) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">Welcome to RPI Data Structures Experience</h2>
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">Enter your name:</label>
            <input
              id="name"
              type="text"
              value={gameState.name}
              onChange={(e) => setGameState(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Your name"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="credits" className="block text-sm font-medium mb-1">Credit Hours:</label>
            <select
              id="credits"
              value={gameState.credit_hours}
              onChange={(e) => setGameState(prev => ({ ...prev, credit_hours: parseInt(e.target.value) }))}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[12, 13, 14, 15, 16, 17, 18].map(credits => (
                <option key={credits} value={credits}>
                  {credits} credits
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="text-red-500 text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <button 
            onClick={startGame}
            disabled={isLoading || !gameState.name}
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Starting...' : 'Start Game'}
          </button>
        </div>
      </div>
    );
  }

  // Main game interface
  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Week {gameState.current_week} - {gameState.name}'s Progress</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex justify-between">
                <span>Stress Level</span>
                <span>{gameState.stress_level}%</span>
              </div>
              <ProgressBar value={gameState.stress_level} color={gameState.stress_level >= 90 ? '#ef4444' : '#3b82f6'} />
            </div>

            <div>
              <div className="mb-2 flex justify-between">
                <span>Understanding</span>
                <span>{gameState.understanding}%</span>
              </div>
              <ProgressBar value={gameState.understanding} />
            </div>

            <div>
              <div className="mb-2 flex justify-between">
                <span>Risk Level</span>
                <span>{gameState.risk_level}%</span>
              </div>
              <ProgressBar value={gameState.risk_level} color="#f59e0b" />
            </div>
          </div>

          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between">
              <span>Current Grade:</span>
              <span className="font-medium">{gameState.current_grade}</span>
            </div>
            <div className="flex justify-between">
              <span>Homeworks Completed:</span>
              <span className="font-medium">{Math.floor(gameState.homework_completed)}/5</span>
            </div>
            <div className="flex justify-between">
              <span>Lab Points:</span>
              <span className="font-medium">{gameState.lab_points}/100</span>
            </div>
            <div className="flex justify-between">
              <span>Credit Hours:</span>
              <span className="font-medium">{gameState.credit_hours}</span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <button 
          className="flex items-center justify-center gap-2 p-3 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          onClick={() => performAction('lecture')}
          disabled={isLoading}
        >
          <Book size={20} />
          Attend Lecture
        </button>
        
        <button 
          className="flex items-center justify-center gap-2 p-3 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          onClick={() => performAction('homework')}
          disabled={isLoading}
        >
          <Code size={20} />
          Work on Homework
        </button>
        
        <button 
          className="flex items-center justify-center gap-2 p-3 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          onClick={() => performAction('officeHours')}
          disabled={isLoading}
        >
          <Users size={20} />
          Visit Office Hours
        </button>
        
        <button 
          className="flex items-center justify-center gap-2 p-3 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
          onClick={() => performAction('useAI')}
          disabled={isLoading}
        >
          <Brain size={20} />
          Use AI (Risky)
        </button>
        
        <button 
          className="flex items-center justify-center gap-2 p-3 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
          onClick={() => performAction('break')}
          disabled={isLoading}
        >
          <Coffee size={20} />
          Take a Break
        </button>
      </div>

      {gameState.stress_level >= 90 && (
        <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded flex items-center gap-2">
          <AlertCircle className="text-red-500" />
          <span className="text-red-700 font-medium">Warning: High Stress Level!</span>
        </div>
      )}
    </div>
  );
};

export default DSGameUI;
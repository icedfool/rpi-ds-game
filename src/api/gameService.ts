export const API_BASE_URL = 'http://localhost:8000/api';

export const gameService = {
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

  getStatus: async (playerName: string) => {
    const response = await fetch(`${API_BASE_URL}/game/${playerName}/status`);
    return response.json();
  },
};
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ds_game import DSGame
from typing import Dict, Optional

app = FastAPI()

# 添加 CORS 中间件来允许前端访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React 开发服务器地址
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 存储游戏实例
games: Dict[str, DSGame] = {}

# 请求模型
class PlayerData(BaseModel):
    name: str
    credit_hours: Optional[int] = 12

class GameAction(BaseModel):
    action: str

# API 端点
@app.get("/")
async def read_root():
    return {"message": "Welcome to RPI DS Game API"}

@app.post("/api/game/start")
async def start_game(player: PlayerData):
    game = DSGame()
    game.player["name"] = player.name
    game.player["credit_hours"] = player.credit_hours
    game.player["stress_level"] = game.calculate_initial_stress(player.credit_hours)
    
    games[player.name] = game
    return game.player

@app.post("/api/game/{player_name}/action")
async def perform_action(player_name: str, action: GameAction):
    if player_name not in games:
        raise HTTPException(status_code=404, detail="Game not found")
    
    game = games[player_name]
    
    action_map = {
        "lecture": game.attend_lecture,
        "homework": game.work_on_homework,
        "officeHours": game.visit_office_hours,
        "useAI": game.use_ai,
        "break": game.take_break
    }
    
    if action.action not in action_map:
        raise HTTPException(status_code=400, detail="Invalid action")
    
    # 执行动作
    action_map[action.action]()
    
    # 检查游戏状态并更新
    if game.player["stress_level"] > 100:
        game.player["stress_level"] = 100
    
    # 计算和更新成绩
    game.calculate_grade()
    
    return game.player

@app.get("/api/game/{player_name}/status")
async def get_status(player_name: str):
    if player_name not in games:
        raise HTTPException(status_code=404, detail="Game not found")
    return games[player_name].player

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
import random
from typing import Dict, Union

class DSGame:
    def __init__(self):
        self.player: Dict[str, Union[str, int, float]] = {
            'name': '',
            'credit_hours': 12,
            'stress_level': 0,
            'understanding': 0,
            'homework_completed': 0,
            'lab_points': 0,
            'current_week': 1,
            'risk_level': 0,
            'current_grade': 'N/A'
        }
        
        self.grade_boundaries = {
            'A': 93,
            'A-': 90,
            'B+': 87,
            'B': 83,
            'B-': 80,
            'C+': 77,
            'C': 73,
            'C-': 70,
            'D+': 67,
            'D': 60,
            'F': 0
        }

    def calculate_initial_stress(self, credits: int) -> int:
        base_stress = {
            12: 10,
            13: 15,
            14: 20,
            15: 25,
            16: 30,
            17: 35,
            18: 40
        }
        return base_stress.get(credits, 45)

    def calculate_grade(self) -> None:
        # 基于理解程度和作业完成情况计算成绩
        understanding_weight = 0.4
        homework_weight = 0.4
        lab_weight = 0.2
        
        score = (
            self.player['understanding'] * understanding_weight +
            (self.player['homework_completed'] / 5 * 100) * homework_weight +
            self.player['lab_points'] * lab_weight
        )
        
        # 如果风险等级过高，降低分数
        if self.player['risk_level'] > 50:
            score *= (1 - (self.player['risk_level'] - 50) / 100)
        
        # 根据分数确定等级
        for grade, min_score in self.grade_boundaries.items():
            if score >= min_score:
                self.player['current_grade'] = grade
                break

    def attend_lecture(self) -> None:
        # 参加课程
        understanding_gain = random.randint(5, 15)
        stress_increase = random.randint(0, 2)
        
        self.player['understanding'] = min(100, self.player['understanding'] + understanding_gain)
        self.player['stress_level'] = min(100, self.player['stress_level'] + stress_increase)

    def work_on_homework(self) -> None:
        # 做作业
        if self.player['homework_completed'] < 5:
            understanding_gain = random.randint(10, 20)
            stress_increase = random.randint(5, 8)
            
            self.player['understanding'] = min(100, self.player['understanding'] + understanding_gain)
            self.player['stress_level'] = min(100, self.player['stress_level'] + stress_increase)
            self.player['homework_completed'] = min(5, self.player['homework_completed'] + 0.25)

    def visit_office_hours(self) -> None:
        # 参加答疑
        understanding_gain = random.randint(10, 25)
        stress_decrease = random.randint(5, 15)
        
        self.player['understanding'] = min(100, self.player['understanding'] + understanding_gain)
        self.player['stress_level'] = max(0, self.player['stress_level'] - stress_decrease)
        # 有机会获得实验分数
        if random.random() < 0.3:  # 30% 的机会
            lab_points_gain = random.randint(5, 10)
            self.player['lab_points'] = min(100, self.player['lab_points'] + lab_points_gain)

    def use_ai(self) -> None:
        # 使用 AI 工具
        understanding_gain = random.randint(3, 8)
        stress_decrease = random.randint(10, 20)
        risk_increase = random.randint(5, 15)
        
        self.player['understanding'] = min(100, self.player['understanding'] + understanding_gain)
        self.player['stress_level'] = max(0, self.player['stress_level'] - stress_decrease)
        self.player['risk_level'] = min(100, self.player['risk_level'] + risk_increase)
        
        # 被发现的风险
        if random.random() < self.player['risk_level'] / 200:  # 风险等级越高，被发现的概率越大
            self.player['stress_level'] = min(100, self.player['stress_level'] + 30)
            self.player['risk_level'] = min(100, self.player['risk_level'] + 20)

    def take_break(self) -> None:
        # 休息
        stress_decrease = random.randint(20, 40)
        self.player['stress_level'] = max(0, self.player['stress_level'] - stress_decrease)
        
        # 休息太多可能会影响理解度
        if random.random() < 0.2:  # 20% 的机会
            understanding_decrease = random.randint(1, 5)
            self.player['understanding'] = max(0, self.player['understanding'] - understanding_decrease)
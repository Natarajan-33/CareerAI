from typing import List, Dict, Any
from pydantic import BaseModel

class DimensionAnalysis(BaseModel):
    friction: List[str]
    delight: List[str]
    recommendations: List[str]

class Delta4Analysis(BaseModel):
    technical: DimensionAnalysis
    cultural: DimensionAnalysis
    process: DimensionAnalysis
    expectation: DimensionAnalysis
    summary: str

class Delta4Request(BaseModel):
    project_description: str
    current_status: str
    challenges: str
    goals: str

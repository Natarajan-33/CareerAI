from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class CompanyBase(BaseModel):
    name: str

class CompanyCreate(CompanyBase):
    pass

class CompanyInsight(BaseModel):
    company_overview: str
    recent_developments: List[Dict[str, str]]
    job_trends: List[Dict[str, Any]]
    skill_alignment: Dict[str, List[str]]
    projects_to_showcase: List[Dict[str, str]]

class CompanyResponse(CompanyBase):
    id: str
    insights: Optional[CompanyInsight] = None

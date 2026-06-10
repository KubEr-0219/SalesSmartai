from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai
import os
import json
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Create model
model = genai.GenerativeModel("gemini-2.5-flash")

# Create FastAPI app
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Input schema
class CompanyInput(BaseModel):
    company_name: str
    industry: str
    employee_count: int
    hiring_volume: str

# Home route
@app.get("/")
def home():
    return {
        "message": "SaleSmart.ai Gemini Backend Running"
    }

# Analyze endpoint
@app.post("/analyze")
def analyze_company(data: CompanyInput):

    prompt = f"""
You are an ATS Sales Intelligence Agent.

Analyze the following company:

Company Name: {data.company_name}
Industry: {data.industry}
Employee Count: {data.employee_count}
Hiring Volume: {data.hiring_volume}

Return ONLY valid JSON.

Use this exact structure:

{{
  "prospect_score": 87,
  "ats_fit": "High",

  "company_summary": "",

  "top_pain_points": [],

  "ats_opportunity_map": [
    {
      "pain_point": "",
      "ats_feature": "",
      "business_impact": ""
    }
  ],

  "discovery_questions": [],

  "recommended_talking_points": []
}}

Rules:
1. Return ONLY valid JSON.
2. No markdown.
3. No code blocks.
4. No explanations outside JSON.
5. Generate realistic ATS sales insights.
6. prospect_score must be between 0 and 100.
7. ats_fit must be one of: Low, Medium, High.
8. Include 3-5 pain points.
9. Include 3-5 discovery questions.
10. Include 3-5 recommended talking points.
11. For each ATS opportunity, clearly connect:
    pain point -> ATS feature -> business impact.
"""
    response = model.generate_content(prompt)
    clean_text = response.text.replace("```json", "").replace("```", "").strip()

    try:
        result = json.loads(clean_text)

        return {
            "status": "success",
            "data": result
        }

    except Exception:
        return {
            "status": "error",
            "raw_response": response.text
        }
        
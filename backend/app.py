from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai
import os

# Load environment variables
load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Create model
model = genai.GenerativeModel("gemini-2.5-flash")

# Create FastAPI app
app = FastAPI()

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
    You are an ATS sales intelligence AI.

    Analyze this company:

    Company Name: {data.company_name}
    Industry: {data.industry}
    Employee Count: {data.employee_count}
    Hiring Volume: {data.hiring_volume}

    Generate:

    1. Top hiring pain points
    2. Why these problems matter
    3. ATS features that solve them
    4. Discovery questions
    5. Suggested ATS sales pitch

    Format the response clearly using headings and bullet points.
    """

    response = model.generate_content(prompt)

    return {
        "result": response.text
    }
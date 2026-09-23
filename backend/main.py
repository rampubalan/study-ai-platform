import os
from datetime import date
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai
from database import get_db_connection

load_dotenv()

app = FastAPI(title="DaRa AI Backend")

# Allow frontend to call the backend without CORS blocks
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini Client using the key from .env
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

class StudyRequest(BaseModel):
    user_id: int
    prompt: str

@app.get("/")
def root():
    return {"message": "DaRa AI API is up and running!"}

@app.post("/api/ai/study")
def study_assistant(req: StudyRequest):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM users WHERE id = %s", (req.user_id,))
            user = cursor.fetchone()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        today = date.today()
        tier = user["subscription_tier"]
        daily_count = user["daily_ai_requests"]
        last_date = user["last_request_date"]

        # Reset count if it's a new day
        if last_date != today:
            daily_count = 0
            with conn.cursor() as cursor:
                cursor.execute(
                    "UPDATE users SET daily_ai_requests = 0, last_request_date = %s WHERE id = %s",
                    (today, user["id"])
                )
                conn.commit()

        # Free Tier Quota Check (Limit to 3 questions/day)
        FREE_LIMIT = 3
        if tier == "free" and daily_count >= FREE_LIMIT:
            return {
                "status": "upgrade_required",
                "message": "You have reached your 3 free questions for today. Upgrade to Pro for unlimited access!"
            }

        # Call Gemini 2.5 Flash
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=f"You are a friendly study assistant. Explain this concept clearly to a student:\n\n{req.prompt}"
        )

        # Increment usage counter in MySQL
        with conn.cursor() as cursor:
            cursor.execute(
                "UPDATE users SET daily_ai_requests = daily_ai_requests + 1 WHERE id = %s",
                (user["id"],)
            )
            conn.commit()

        return {
            "status": "success",
            "tier": tier,
            "remaining_free": max(0, FREE_LIMIT - (daily_count + 1)) if tier == "free" else "unlimited",
            "reply": response.text
        }

    finally:
        conn.close()
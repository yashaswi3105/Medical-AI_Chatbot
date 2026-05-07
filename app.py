from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Flask app
app = Flask(__name__)

# Enable CORS
CORS(app)

# Groq client
client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

# Chat route
@app.route("/chat", methods=["POST"])
def chat():

    try:

        print("Request received")

        # Get frontend data
        data = request.get_json()

        print("Data:", data)

        # Extract user message
        user_message = data.get("message", "")

        # Send to Groq AI
        response = client.chat.completions.create(

            model="llama-3.1-8b-instant",

            messages=[

                {
                    "role": "system",

                    "content": """

                    You are a professional Medical AI Assistant.

                    STRICT RULES:

                    - Only answer medical and healthcare questions.
                    - Refuse unrelated topics politely.
                    - Never answer coding, sports, politics,
                    finance, movies, gamaing, or entertainment.
                    - Use simple language.
                    - Keep answers concise and educational.
                    - Do not provide dangerous medical advice.
                    - If the question is unrelated to medicine,
                    reply ONLY with:

                    "I only answer medical-related questions."

                    Always include:
                    "Consult a qualified doctor for professional medical advice."

                    """
                },

                {
                    "role": "user",
                    "content": user_message
                }
            ],

            max_tokens=200
        )

        # Extract AI reply
        reply = (
            response
            .choices[0]
            .message
            .content
        )

        print("Reply generated")

        # Send response back to frontend
        return jsonify({
            "reply": reply
        })
    
    except Exception as e:

        print("ERROR:", e)

        return jsonify({
            "reply": "Server error occurred."
        })
    
# Run Flask server
if __name__ == "__main__":

    app.run(debug=True)

import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // serves index.html

// Chat API
app.post("/chat", async (req, res) => {

    const userMessage = req.body.message;

    // Medical keywords
    const medicalKeywords = [
        "doctor",
        "medicines",
        "disease",
        "symptom",
        "treatment",
        "health",
        "fever",
        "infection",
        "blood",
        "pain",
        "hospital",
        "virus",
        "bacteria",
        "headache",
        "diabetes",
        "cancer",
        "heart",
        "skin",
        "allergy",
        "bones",
        "tissues",
        "human body",
        "typhoid",
        "jaundice",
        "blood vessels",
        "bacteria",
        "coronavirus",
        "dna",
        "fatty liver",
        "cholesterol",
        "surgery",
        "gynecology",
        "genes",
        "hepatitis",
        "hemoglobin",
        "hiv",
        "malaria",
        "muscle",
        "nervous system",
        "neurology",
        "radiology",
        "x-ray",
        "ultrasound",
        "thyroid",
        "tuberculosis",
        "vaccines",
        "respiratory system",
        "pregnancy",
        "mental health",
        "metabolism",
        "endoscopy",
        "platelets",
        "physiology",
        "rna",
        "doctors",
        "medication",
        "symptoms",
        "dizziness",
        "fatigue",
        "vomiting",
        "nausea",
        "arthritis",
        "stroke",
        "kidney",
        "lungs",
        "stomach",
        "anxiety",
        "depression",
        "injury",
        "fracture",
        "emergency",
        "pediatric",
        "dentist",
        "cardiologist",
        "neurologist"
    ];

    // Check if question is medical
    const isMedical = medicalKeywords.some(keyword =>
        userMessage.toLowerCase().includes(keyword)
    );

    // Reject non-medical questions
    if (!isMedical) {
        return res.json({
            reply: "I only answer medical-related questions."
        });
    }

    const detailedKeywords = [
    "explain deeply",
    "detailed explanation",
    "elaborate",
    "in detail",
    "deep explanation",
    "full explanation",
    "detailed"
    ];

    const wantsDetailed = detailedKeywords.some(keyword =>
        userMessage.toLowerCase().includes(keyword)
    );

    let systemPrompt = "";

    if (wantsDetailed) {

        systemPrompt = `

        You are a professional medical AI assistant.

        STRICT RULES:
        - Only answer medical-related questions.
        - Give detailed educational explanations.
        - Explain concepts deeply but clearly.
        - Use simple beginner-friendly language.
        - Use structured explanations.
        - Never answer unrelated topics.

        Always include:
        "Consult a qualified doctor for professional medical advice."

        `;

    } else {

        systemPrompt = `

        You are a professional medical AI assistant.

        STRICT RULES:
        - Only answer medical-related questions.
        - Give short and concise answers.
        - Keep responses under 3-4 lines.
        - Use simple language.
        - Avoid unnecessary details.
        - Be clear and direct.

        Always include:
        "Consult a qualified doctor for professional medical advice."

        `;
    }

    try {

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",

                headers: {
                    "Authorization":
                        `Bearer ${process.env.GROQ_API_KEY}`,

                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    model: "llama-3.1-8b-instant",

                    max_tokens: wantsDetailed ? 300 : 80,

                    messages: [
                        {
                            role: "system",
                            content: systemPrompt
                        },

                        {
                            role: "user",
                            content: userMessage
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        const reply = 
            data?.choices?.[0]?.message?.content ||
            "No response generated.";
        
        res.json({ reply });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Server error"
        });
    }
});

// Start server
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});

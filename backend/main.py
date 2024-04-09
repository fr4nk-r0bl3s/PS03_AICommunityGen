from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import spacy
import pdfplumber
from openai import OpenAI
from google.generativeai import GenerativeModel
import anthropic
import requests
from langdetect import detect
from pydantic import BaseModel
from typing import List, Dict
from dotenv import load_dotenv
import os

class Entity(BaseModel):
    text: str
    label_: str

class Entities(BaseModel):
    entities: List[Entity]
    communityName: str
    location: str
    targetAudience: str
    writingStyle: List[str]
    language: str
    selectedAPI: str

app = FastAPI()
nlp_en = spacy.load("en_core_web_md")
nlp_es = spacy.load("es_core_news_md")

load_dotenv() # To load env variables

# CORS Settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# spaCy - Check Language
def get_language(text):
    try:
        return detect(text)
    except Exception as e:
        print(f"Error detecting language: {str(e)}")
        return None

@app.post("/extract-info/")
async def extract_info(file: UploadFile = File(...)):
    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB in bytes

    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)

    if file_size > MAX_FILE_SIZE:
        return JSONResponse(status_code=413, content={"message": "File too large. Please upload a file less than 5MB."})
    
    try:
        text = ""
        if file.filename.endswith(".pdf"):
            with pdfplumber.open(file.file) as pdf:
                for page in pdf.pages:
                    text += page.extract_text() + " "
        else:
            content = await file.read()
            text = content.decode("utf-8")

        # Debugging
        print(f"Extracted text: {text[:100]}")  # show 1st 100 characters
    
        # Detect the language of the extracted text         
        language = get_language(text)
        print(f"Detected language: {language}")

        if language == "en":
                doc = nlp_en(text)
        elif language == "es":
                doc = nlp_es(text)
        else:
            # When language is neither English nor Spanish
            print("Language not supported.")
            raise HTTPException(status_code=400, detail="Language not supported")   

        entities = [{"text": ent.text, "label_": ent.label_} for ent in doc.ents]
        return JSONResponse(content={
            "status": "success",
            "message": "Entities extracted successfully",
            "extracted_text": text[:100],
            "detected_language": language,
            "entities": entities
        })    
    except Exception as e:
        print(f"Error during extraction: {str(e)}")
        return JSONResponse(content={
            "status": "error",
            "message": f"Error extracting information: {str(e)}"
        }, status_code=500)

# variable selector
openai_api_key = os.getenv('OPENAI_API_KEY')
anthropic_api_key = os.getenv('ANTHROPIC_API_KEY')
google_api_key = os.getenv('GOOGLE_API_KEY')

openai_client = OpenAI(api_key=openai_api_key)
anthropic_client = anthropic.Anthropic(api_key=anthropic_api_key)
# Configure Google API key & client
import google.generativeai as genai
genai.configure(api_key=google_api_key)
gemini_client = GenerativeModel()

@app.post("/generate-content/")
async def generate_content(request: Entities):
    print("Received data:", request)
    try:
        print("Processing data for message content")
        message_content = f"""
Generate compelling real estate content for {request.communityName}

Instructions:
- Focus on the {request.communityName} real estate development in {request.location}
- Target audience: {request.targetAudience}
- Writing style: {', '.join(request.writingStyle)}
- Language: {request.language}
- Use creative and original language, avoiding repetition of words and phrases throughout the text
- Employ a wide range of synonyms and related terms to enrich the text and prevent excessive repetition of keywords
- Incorporate relevant examples and captivating analogies to highlight unique features and benefits of the real estate project
- Utilize narrative techniques and evocative language to transport the reader to the heart of the community and convey the essence of the lifestyle it offers
- Create vivid and detailed descriptions that awaken the senses and generate an emotional connection with the project

Content Structure:
1. Title (H1):
   - Create an engaging and captivating title that deeply resonates with the target audience {request.targetAudience}
   - Include {request.communityName}, its unique selling points, and {request.location}
   - Emphasize standout features and encapsulate the essence of the development

2. Overview (250 words):
   - Highlight the significance and unique aspects of the development project
   - Mention location, design philosophy, unique concept, and key attractions
   - Explain what sets it apart in the real estate market, using compelling examples and comparisons

3. Lifestyle and Community (Subheading + 350 words):
   - Introduce the lifestyle and community experience offered by the project, painting a vivid picture of the daily life and ambiance
   - Emphasize convenience, comfort, security, and community-centric facilities, using descriptive language to evoke a sense of belonging
   - Use persuasive language and relatable scenarios to appeal to the target audience {request.targetAudience}

4. Architectural Design and Amenities (Subheading + 350 words):
   - Discuss the architectural design, real estate offer, and interior features, highlighting their uniqueness and craftsmanship
   - Highlight unique amenities that differentiate the project, using evocative descriptions and analogies to create a sense of luxury and exclusivity
   - Use descriptive language and sensory details to paint a vivid picture and immerse the reader in the experience

5. Financial Aspects (Subheading + 350 words):
   - Cover pricing structure, payment methods, and potential investment opportunities, using persuasive language to demonstrate value and affordability
   - Explain why it is an attractive option for the target audience {request.targetAudience}, using examples and comparisons to similar projects
   - Use persuasive language and future projections to encourage consideration and inspire confidence in the investment

6. Conclusion (300 words):
   - Summarize the key selling points and unique aspects of the development, using creative language and memorable phrases
   - Reiterate why the project stands out in the real estate market, using compelling examples and testimonials
   - Encourage the reader to explore further and consider the project, using persuasive language and a strong call-to-action
   - End with a strong and compelling statement that leaves a lasting impression and motivates the reader to take action

Additional Instructions:
- Integrate the following entities strategically throughout the content: {' '.join([f"'{entity.text}'" for entity in request.entities])}
- Use formatting such as bullet points and bold text to highlight key ideas and selling points
- Ensure a logical structure and clear narrative flow, using transitions and connective phrases to guide the reader
- Use persuasive and attractive language that resonates with the target audience {request.targetAudience}, evoking emotions and aspirations
- Provide enough information to generate interest and encourage further exploration, using hooks and open-ended questions to engage the reader
        """

        if request.selectedAPI == "openai":
            print("Sending request to OpenAI with message:", message_content)
            response = openai_client.chat.completions.create(
                model="gpt-3.5-turbo-16k",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": message_content}
                ],
                temperature=0.5
            )
            generated_text = response.choices[0].message.content if response.choices else 'No content generated.'
            return JSONResponse(content={
                "status": "success",
                "message": "Content generated successfully",
                "generated_text": generated_text
            })
        
        elif request.selectedAPI == "gemini":
            try:
                print("Sending request to Gemini with message:", message_content)
                response = gemini_client.generate_content(
                    prompt=message_content,
                    max_length=512,
                    temperature=0.5
                )
                generated_text = response.candidates[0].content.parts[0].text if response.candidates else 'No content generated.'
                return JSONResponse(content={
                "status": "success",
                "message": "Content generated successfully",
                "generated_text": generated_text
            })
            except Exception as e:
                print(f"Error with Gemini: {e}")
                raise HTTPException(status_code=500, detail=str(e))

        elif request.selectedAPI == "anthropic":
            try:
                print("Sending request to Anthropic with message:", message_content)
                url = "https://api.anthropic.com/v1/messages"
                headers = {
                    "Content-Type": "application/json",
                    "x-api-key": anthropic_api_key,
                    "anthropic-version": "2023-06-01"
                }
                payload = {
                    "model": "claude-3-sonnet-20240229",
                    "system": "You are a helpful assistant.",
                    "max_tokens": 2048,
                    "messages": [{"role": "user", "content": message_content}],
                    "temperature": 0.8
                }
                response = requests.post(url, headers=headers, json=payload)
                response.raise_for_status()
                generated_text = response.json()["content"]
                return JSONResponse(content={
                "status": "success",
                "message": "Content generated successfully",
                "generated_text": generated_text
            })
            except requests.exceptions.RequestException as e:
                error_details = str(e)
                error_response = e.response.json() if e.response else None
                print(f"Error occurred while generating content with Anthropic: {error_details}")
                print(f"Error response from Anthropic API: {error_response}")
                raise HTTPException(status_code=500, detail=f"Error generating content with Anthropic: {error_details}")

        else:
            return JSONResponse(content={
                "status": "error",
                "message": "Invalid API selection"
            }, status_code=400)

    except Exception as e:
        return JSONResponse(content={
            "status": "error",
            "message": f"Error generating content: {str(e)}"
        }, status_code=500)


@app.get("/test-openai")
async def test_openai():
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo-16k",
            messages=[
                {"role": "user", "content": "This is a test; if you got this, tell a nerd joke."},
            ],
            temperature=0.5
        )
        joke = response.choices[0].message.content if response.choices else 'No joke found.'
        return JSONResponse(content={"joke": joke})
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"version": "AICommunityGen_v0.4"}

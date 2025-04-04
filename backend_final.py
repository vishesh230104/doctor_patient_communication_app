# Backend: AI-Powered Doctor-Patient Communication Platform with Voice Support (No Rasa)

from flask import Flask, request, jsonify
import whisper  # OpenAI Whisper for speech recognition
from deep_translator import GoogleTranslator  # Alternative translation library
import openai  # OpenAI GPT for chatbot
import cv2  # OpenCV for medical visualizations
import firebase_admin  # Firebase for storage
from firebase_admin import credentials, firestore
import torch  # PyTorch for NLP models
import speech_recognition as sr  # Speech recognition for voice commands
import pyttsx3  # Text-to-speech for chatbot responses
import os

# Initialize Flask app
app = Flask(__name__)

# Initialize Firebase
cred = credentials.Certificate("firebase_credentials.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# Load Whisper model for speech recognition
model = whisper.load_model("base")

# Google Translator (Using Deep Translator)
translator = GoogleTranslator(source='auto', target='en')

# Initialize OpenAI GPT chatbot
OPENAI_API_KEY = "your_openai_api_key"  # Replace with your actual API key
openai.api_key = OPENAI_API_KEY  # Set API key globally

def get_gpt_response(message):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": message}]
    )
    return response["choices"][0]["message"]["content"]

# Initialize Text-to-Speech engine
tts_engine = pyttsx3.init()

def speak(text):
    tts_engine.say(text)
    tts_engine.runAndWait()

@app.route('/translate', methods=['POST'])
def translate_speech():
    try:
        audio = request.files['audio']
        audio_path = "temp_audio.wav"
        audio.save(audio_path)
        result = model.transcribe(audio_path)
        translated_text = translator.translate(result['text'])
        return jsonify({"text": result['text'], "translation": translated_text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/chatbot', methods=['POST'])
def chatbot():
    try:
        user_message = request.json.get('message', '')
        if not user_message:
            return jsonify({"error": "No message provided"}), 400
        
        response = get_gpt_response(user_message)
        speak(response)  # Convert chatbot response to speech
        return jsonify({"response": response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/visualize', methods=['POST'])
def generate_medical_visual():
    try:
        condition = request.json.get('condition', '')
        image_path = f"medical_images/{condition}.png"

        if not os.path.exists(image_path):
            return jsonify({"error": "Image not found"}), 404

        image = cv2.imread(image_path)
        _, img_encoded = cv2.imencode('.png', image)
        return jsonify({"image": img_encoded.tobytes().decode('latin1')})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/voice-command', methods=['POST'])
def voice_command():
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        try:
            audio = recognizer.listen(source)
            command_text = recognizer.recognize_google(audio)
            return jsonify({"command": command_text})
        except sr.UnknownValueError:
            return jsonify({"error": "Could not understand audio"}), 400
        except sr.RequestError:
            return jsonify({"error": "Speech recognition service unavailable"}), 500

if __name__ == '__main__':
    app.run(debug=True)

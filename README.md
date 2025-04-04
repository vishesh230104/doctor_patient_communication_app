# AI Doctor-Patient Chat App 🩺🤖

An intelligent, voice-enabled web application that facilitates communication between patients and a virtual doctor using GPT, speech recognition, language translation, and visual medical aids.

## 🧠 Features

- 🎙 *Speech-to-Text* via VOSK
- 🌐 *Language Translation* with Google Translate API
- 💬 *Chatbot Responses* powered by OpenAI's GPT-3.5
- 🗣 *Text-to-Speech* with pyttsx3
- 🧑‍⚕ *Medical Visualizations* based on user condition input
- 🔊 *Voice Command Recognition* via speech_recognition
- ☁ *Firebase Firestore Integration* (for future storage or analytics)
- 🌗 *Dark/Light Mode Toggle* in frontend UI


## 📁 Project Structure

## 🚀 Getting Started

### 🔧 Backend Setup:

1. *Install dependencies*:
    pip install flask vosk deep-translator openai opencv-python firebase-admin torch SpeechRecognition pyttsx3
   
3. *Setup Firebase*:
    Add firebase_credentials.json to your root directory.
    Enable Firestore in your Firebase project.

3. *Download VOSK Model*:
    Download the English model from: Vosk Models Extract and update the MODEL_DIR path in backend2 (1).py.

4. *Set OpenAI API Key*:
    Replace "your_openai_api_key" in the backend file with your actual key.

## Run Backend:
    python "backend_file_name.py"
### 🌐 Frontend Setup

1. *Install dependencies (if using a Vite or CRA React setup)*:
    npm install
    Start frontend development server:
      npm run dev
    # or
      npm start
   
⚠ Notes
Make sure your microphone is enabled for voice features.

Audio translation expects WAV files with mono PCM format.

The backend supports POST requests for:

/translate (audio file)

/chatbot (JSON { message: "" })

/visualize (JSON { condition: "" })

/voice-command (real-time mic input)

🙌 Acknowledgments
VOSK for speech recognition

Deep Translator

OpenAI GPT

Firebase

React + Tailwind + Lucide Icons

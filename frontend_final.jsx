import React, { useState, useEffect } from "react";
import { Button, Input, Card, CardContent } from "@/components/ui";
import { Mic, Send, Moon, Sun, Image } from "lucide-react";

const AiDoctorChat = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [listening, setListening] = useState(false);
  const [translatedText, setTranslatedText] = useState("");
  const [visualization, setVisualization] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.className = darkMode ? "bg-gray-900 text-white" : "bg-white text-black";
  }, [darkMode]);

  const handleSend = async () => {
    if (!message.trim()) return;
    const res = await fetch("http://127.0.0.1:5000/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    setResponse(data.response);
  };

  const handleVoiceInput = () => {
    setListening(true);
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event) => {
      setMessage(event.results[0][0].transcript);
      setListening(false);
    };

    recognition.onerror = () => setListening(false);
  };

  const handleTranslate = async () => {
    const res = await fetch("http://127.0.0.1:5000/translate", {
      method: "POST",
      body: new FormData(),
    });
    const data = await res.json();
    setTranslatedText(data.translation);
  };

  const handleVisualization = async () => {
    const res = await fetch("http://127.0.0.1:5000/visualize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ condition: message }),
    });
    const data = await res.json();
    setVisualization(`data:image/png;base64,${data.image}`);
  };

  return (
    <div className="flex flex-col items-center p-6 min-h-screen">
      <div className="flex justify-between w-full max-w-2xl">
        <h1 className="text-2xl font-bold">AI Doctor-Patient Chat</h1>
        <Button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <Sun size={20} /> : <Moon size={20} />} {darkMode ? "Light Mode" : "Dark Mode"}
        </Button>
      </div>
      <Card className="w-96 mt-4">
        <CardContent className="p-4">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask a medical question..."
            className="bg-gray-100 dark:bg-gray-700 dark:text-white"
          />
          <div className="flex gap-2 mt-2">
            <Button onClick={handleSend} disabled={!message}>
              <Send size={16} /> Send
            </Button>
            <Button onClick={handleVoiceInput} disabled={listening}>
              <Mic size={16} /> {listening ? "Listening..." : "Speak"}
            </Button>
            <Button onClick={handleTranslate}>
              🌍 Translate
            </Button>
            <Button onClick={handleVisualization}>
              <Image size={16} /> Visualize
            </Button>
          </div>
        </CardContent>
      </Card>
      {response && (
        <Card className="w-96 mt-4">
          <CardContent className="p-4 bg-gray-100 dark:bg-gray-800 dark:text-white">
            <p className="font-semibold">Response:</p>
            <p>{response}</p>
          </CardContent>
        </Card>
      )}
      {translatedText && (
        <Card className="w-96 mt-4">
          <CardContent className="p-4 bg-blue-100 dark:bg-blue-800 dark:text-white">
            <p className="font-semibold">Translated Speech:</p>
            <p>{translatedText}</p>
          </CardContent>
        </Card>
      )}
      {visualization && (
        <Card className="w-96 mt-4">
          <CardContent className="p-4 bg-green-100 dark:bg-green-800 dark:text-white flex justify-center">
            <img src={visualization} alt="Medical Visualization" className="w-full h-auto" />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AiDoctorChat;

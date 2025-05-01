"use client";
import React, { useState, useRef } from "react";
import Voice from "../assets/voice";
import { useTheme } from "./theme-provider";

// Define SpeechRecognition interface
interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
        confidence: number;
      };
    };
    item(index: number): any;
    length: number;
  };
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onstart: (event: Event) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: { error: string }) => void;
  onend: (event: Event) => void;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface SearchBarProps {
  onSearch: (city: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const { theme } = useTheme();
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const startVoiceRecognition = () => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      alert("Voice recognition is not supported in your browser");
      return;
    }

    // Initialize speech recognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();

    if (recognitionRef.current === null) return;
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onstart = () => {
      setIsListening(true);
    };

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);

      // Auto-submit after voice input
      setTimeout(() => {
        onSearch(transcript.trim());
      }, 500);
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.start();
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`flex align-center justify-center max-w-md mx-auto mb-6 rounded-full ${
        theme === "dark"
          ? "bg-black/20 text-white placeholder:text-gray-400 border border-white/10"
          : "bg-white/80 text-gray-800 placeholder:text-gray-500 border border-gray-200 shadow-md"
      }`}
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type here..."
        className={` grow-1 w-full py-4 px-4 rounded-full outline-none transition-all duration-300 text-[1rem] bg-transparent`}
      />
      <button
        type="button"
        onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
        title={isListening ? "Stop listening" : "Search with voice"}
      >
        <div
          className={`p-2 rounded-full transition-all duration-300 ${theme === "dark" ? "bg-white/10" : "bg-black/10"} ${
            isListening
              ? "bg-red-500 text-white"
              : theme === "dark"
                ? "text-white/70 hover:text-white"
                : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Voice />
        </div>
      </button>
      <button
        type="submit"
        className={`p-2 rounded-full transition-all duration-300 ${
          theme === "dark"
            ? "text-white/70 hover:text-white"
            : "text-gray-500 hover:text-gray-700"
        }`}
        title="Search"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
    </form>
  );
};

export default SearchBar;

// Add TypeScript declarations for the Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

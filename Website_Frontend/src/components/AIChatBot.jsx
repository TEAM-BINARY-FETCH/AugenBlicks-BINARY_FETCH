import React, {useState} from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Bot, Send } from "lucide-react"; // Bot & Send Icon
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const AIChatBot = ({editorContent}) => {
    const [messages, setMessages] = useState([]); // Chat messages
    const [userMessage, setUserMessage] = useState(""); // User input
    const [selectedStyle, setSelectedStyle] = useState("Concise"); // Default explanation style
    const [taskType, setTaskType] = useState("");

    const handleSendMessage = async () => {
        if (!userMessage.trim() || !taskType) return;
    
        try {
          // Access the editor's content
          console.log("Editor Content:", editorContent);
    
          // Prepare the request payload
          const requestData = {
            task_type: taskType,
            text_input: editorContent, // Include the editor's content
            style_input: selectedStyle,
            user_query: userMessage,
          };
          console.log("Request Data:", requestData);
    
          // Update UI with the user's message
          const newMessages = [...messages, { sender: "user", text: userMessage }];
          setMessages(newMessages);
          setUserMessage("");
    
          // Send request to the AI helper API
          const response = await fetch(
            `${import.meta.env.VITE_FLASK_URL}/ai-helper`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(requestData),
            }
          );
    
          const data = await response.json();
          console.log("AI Response:", data);
    
          // Append AI response to chat
          setMessages((prev) => [
            ...prev,
            {
              sender: "ai",
              text: data.suggestion || "AI did not return a response.",
            },
          ]);
        } catch (error) {
          console.error("Error sending message:", error);
          setMessages((prev) => [
            ...prev,
            { sender: "ai", text: "An error occurred. Please try again." },
          ]);
        }
      };

  return (
    <Dialog>
        <DialogTrigger asChild>
          <button className="fixed bottom-6 right-6 bg-slate-900 border-white border-2 text-white p-3 rounded-full shadow-lg hover:bg-slate-800 transition hover:text-yellow-500 hover:border-yellow-500">
            <Bot size={28} />
          </button>
        </DialogTrigger>

        {/* AI Chatbox */}
        <DialogContent className="bg-gray-900 text-white p-6 rounded-lg w-[600px]">
          <DialogTitle className="text-5xl font-bold bg-gradient-to-b from-gray-400 via-gray-200 to-gray-600 bg-clip-text text-transparent">
            AI Chat
          </DialogTitle>

          {/* Chat Messages */}
          <div className="h-64 overflow-y-auto bg-gray-800 p-3 rounded-lg mb-3 flex flex-col space-y-2">
            {messages.length === 0 ? (
              <p className="text-gray-400 text-sm text-center">
                Start a conversation with AI...
              </p>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-center ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "ai" && (
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center mr-2">
                      🤖
                    </div>
                  )}
                  <div
                    className={`p-3 max-w-[75%] rounded-lg text-sm shadow-md ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-white"
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.sender === "user" && (
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center ml-2">
                      👤
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Options for Summarization or Asking */}
          <div className="flex space-x-2 mb-3">
            <button
              className={`flex-1 bg-blue-500 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-900`}
              disabled={taskType === "Summarize"}
              onClick={() => setTaskType("Summarize")}
            >
              Summarize
            </button>
            <button
              className={`flex-1 bg-green-500 py-2 rounded-lg hover:bg-green-600 disabled:bg-green-900`}
              disabled={taskType === "Ask a Question"}
              onClick={() => setTaskType("Ask a Question")}
            >
              Ask About This Page
            </button>
          </div>

          {/* Explanation Style Selector */}
          <Select onValueChange={setSelectedStyle}>
            <SelectValue placeholder="Explanation Style" />
            <SelectTrigger className="w-full bg-gray-700 text-white p-2 rounded-lg">
              {selectedStyle}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Concise">Concise</SelectItem>
              <SelectItem value="Detailed">Detailed</SelectItem>
              <SelectItem value="Technical">Technical</SelectItem>
              <SelectItem value="Simple">Simple</SelectItem>
            </SelectContent>
          </Select>

          {/* User Input & Send Button */}
          <div className="flex mt-3">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              className="flex-1 p-2 bg-gray-800 rounded-lg text-white"
              placeholder="Type a message..."
            />
            <button
              onClick={handleSendMessage}
              className="ml-2 bg-blue-600 p-2 rounded-lg hover:bg-blue-700"
            >
              <Send size={20} />
            </button>
          </div>
        </DialogContent>
      </Dialog>
  )
}

export default AIChatBot
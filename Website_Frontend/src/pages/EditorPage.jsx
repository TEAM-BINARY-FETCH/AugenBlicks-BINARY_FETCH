import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Embed from "@editorjs/embed";
import ImageTool from "@editorjs/image";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import Delimiter from "@editorjs/delimiter";
import Table from "@editorjs/table";
import SimpleImage from "@editorjs/simple-image";
import EditorToolbar from "../components/EditorToolbar";
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

export default function EditorPage() {
  const { projectId } = useParams();
  const [editor, setEditor] = useState(null);
  const [messages, setMessages] = useState([]); // Chat messages
  const [userMessage, setUserMessage] = useState(""); // User input
  const [selectedStyle, setSelectedStyle] = useState("Concise"); // Default explanation style
  const [taskType, setTaskType] = useState("")

  useEffect(() => {
    if (!editor) {
      const savedProjects = JSON.parse(localStorage.getItem("projects")) || {};

      const savedData = savedProjects[projectId] ||  {
        "blocks": [
          {
            "type": "header",
            "data": {
              "text": "The Evolution of Artificial Intelligence",
              "level": 2
            }
          },
          {
            "type": "paragraph",
            "data": {
              "text": "Artificial Intelligence (AI) refers to the simulation of human intelligence in machines. AI systems are capable of learning, reasoning, problem-solving, and decision-making. The concept of AI dates back to ancient times when myths and folklore described mechanical beings that mimicked human actions."
            }
          },
          {
            "type": "paragraph",
            "data": {
              "text": "In the 1950s, AI research formally began with Alan Turing's pioneering work in computing and his famous 'Turing Test,' which assessed a machine's ability to exhibit intelligent behavior. John McCarthy, known as the father of AI, coined the term 'Artificial Intelligence' in 1956 at the Dartmouth Conference."
            }
          },
          {
            "type": "header",
            "data": {
              "text": "Milestones in AI Development",
              "level": 3
            }
          },
          {
            "type": "list",
            "data": {
              "style": "unordered",
              "items": [
                "<b>1956-1974:</b> Early AI programs solved algebra, played chess, and performed logical reasoning.",
                "<b>1980s:</b> The rise of expert systems, which mimicked human decision-making in specialized fields.",
                "<b>1997:</b> IBM’s Deep Blue defeated chess champion Garry Kasparov.",
                "<b>2011:</b> IBM Watson won the game show 'Jeopardy!' against human champions.",
                "<b>2016:</b> Google's AlphaGo defeated the world champion in the board game Go.",
                "<b>2020s:</b> AI-powered large language models (LLMs) like GPT and Gemini revolutionized NLP applications."
              ]
            }
          },
          {
            "type": "header",
            "data": {
              "text": "Applications of AI",
              "level": 3
            }
          },
          {
            "type": "table",
            "data": {
              "content": [
                ["Domain", "AI Use Case"],
                ["Healthcare", "Medical diagnosis, drug discovery, robotic surgeries"],
                ["Finance", "Fraud detection, stock market prediction, risk assessment"],
                ["Automotive", "Self-driving cars, smart traffic management"],
                ["Retail", "Personalized recommendations, inventory management"],
                ["Education", "AI tutors, personalized learning platforms"]
              ]
            }
          },
          {
            "type": "header",
            "data": {
              "text": "Ethical Considerations in AI",
              "level": 3
            }
          },
          {
            "type": "paragraph",
            "data": {
              "text": "Despite AI's advancements, ethical concerns remain. Bias in AI models, job displacement, and the potential for misuse in surveillance are major concerns. Governments and organizations are working on AI regulations to ensure responsible AI development."
            }
          },
          {
            "type": "paragraph",
            "data": {
              "text": "The future of AI is promising, with advancements in quantum computing, AI-generated content, and human-AI collaboration shaping the next decade of innovation."
            }
          }
        ]
      }
      
      ;

      const editorInstance = new EditorJS({
        holder: "editorjs",
        tools: {
          header: Header,
          list: List,
          embed: Embed,
          image: ImageTool,
          marker: Marker,
          inlineCode: InlineCode,
          delimiter: Delimiter,
          table: Table,
          simpleImage: SimpleImage,
        },
        data: savedData,
        async onChange() {
          try {
            const content = await editorInstance.saver.save();
            const updatedProjects =
              JSON.parse(localStorage.getItem("projects")) || {};
            updatedProjects[projectId] = content;
            localStorage.setItem("projects", JSON.stringify(updatedProjects));
          } catch (error) {
            console.error("Error saving content:", error);
          }
        },
      });

      setEditor(editorInstance);
    }

    return () => {
      if (editor) {
        editor.isReady
          .then(() => editor.destroy())
          .catch((err) => console.error("Error destroying editor:", err));
      }
    };
  }, [projectId, editor]);

  const handleSendMessage = async () => {
    if (!userMessage.trim() || !taskType) return;
  
    try {
      // Capture editor content
      const editorContent = editor ? await editor.saver.save() : { blocks: [] };
  
      // Prepare the request payload
      const requestData = {
        task_type: taskType,
        text_input: JSON.stringify(editorContent.blocks), // Convert editor content to string
        style_input: selectedStyle,
        user_query: userMessage,
      };
      console.log('requestData', requestData);
  
      // Update UI with the user's message
      const newMessages = [...messages, { sender: "user", text: userMessage }];
      setMessages(newMessages);
      setUserMessage("");
  
      // Send request to the AI helper API
      const response = await fetch(`${import.meta.env.VITE_FLASK_URL}/ai-helper`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
  
      const data = await response.json();
      console.log('Data', data);
  
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
    <div className="h-auto min-h-screen p-6 bg-gray-900 text-white relative">
      <h2 className="text-2xl font-bold mb-4">{projectId}</h2>
      <EditorToolbar />
      <div
        id="editorjs"
        className="p-4 rounded-lg w-full bg-gray-800 text-white min-h-screen"
      ></div>

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
                  {/* AI Avatar */}
                  {msg.sender === "ai" && (
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center mr-2">
                      🤖
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`p-3 max-w-[75%] rounded-lg text-sm shadow-md ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-white"
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* User Avatar */}
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
            <button className={`flex-1 bg-blue-500 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-900`}  
            disabled={ taskType==="Summarize" }
            onClick={()=>setTaskType("Summarize")}>
              Summarize
            </button>
            <button className={`flex-1 bg-green-500 py-2 rounded-lg hover:bg-green-600 disabled:bg-green-900`}
              disabled={ taskType==="Ask a Question" }
              onClick={()=>setTaskType("Ask a Question")}
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
    </div>
  );
}

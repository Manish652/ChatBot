import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, Sparkles, MessageSquare, Settings, Image, FileText, Mic, Info, Download, Trash } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Hello! I'm your AI assistant powered by Google's Gemini AI. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef(null);
  const modelRef = useRef(null);

  useEffect(() => {
    const genAI = new GoogleGenerativeAI("AIzaSyD9t4Sz5zopR_PUUvoXzNVpvet1PjhMHDA");
    modelRef.current = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !modelRef.current) return;

    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chat = modelRef.current.startChat({
        generationConfig: {
          maxOutputTokens: 1000,
        },
      });

      for (const msg of messages) {
        if (msg.sender === 'user') {
          await chat.sendMessage(msg.text);
        }
      }

      const result = await chat.sendMessage(input);
      const response = result.response;
      const text = response.text();

      const botMessage = {
        id: messages.length + 2,
        text: text || "Sorry, I couldn't generate a response.",
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: `Error: ${error.message || "There was an error processing your request."}`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const userMessage = {
          id: messages.length + 1,
          text: file.name,
          sender: 'user',
          timestamp: new Date(),
          type: 'image',
          file: e.target.result
        };
        setMessages(prev => [...prev, userMessage]);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearChat = () => {
    setMessages([{
      id: 1,
      text: "👋 Hello! I'm your AI assistant powered by Google's Gemini AI. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
      <div className="pt-16">
        <div className="max-w-[1200px] mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm bg-base-100/30 border border-base-300"
          >
            <div className="flex h-[85vh]">
              {/* Sidebar */}
              <AnimatePresence mode="wait">
                {showSidebar && (
                  <motion.div
                    initial={{ x: -300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="w-80 border-r border-base-300 bg-base-200/50 backdrop-blur-md hidden lg:block"
                  >
                    <div className="p-4 space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-xl">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                          <Bot className="text-primary-content" size={24} />
                        </div>
                        <div>
                          <h2 className="font-bold text-lg">Gemini AI</h2>
                          <p className="text-xs opacity-70">Powered by Google</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <button className="btn btn-ghost justify-start w-full gap-3 normal-case">
                          <MessageSquare size={18} />
                          New Chat
                        </button>
                        <button onClick={clearChat} className="btn btn-ghost justify-start w-full gap-3 normal-case">
                          <Trash size={18} />
                          Clear Chat
                        </button>
                        <button className="btn btn-ghost justify-start w-full gap-3 normal-case">
                          <Download size={18} />
                          Save Chat
                        </button>
                      </div>

                      <div className="divider">Quick Actions</div>

                      <div className="grid grid-cols-2 gap-2">
                        <button className="btn btn-sm btn-ghost normal-case">
                          Ask Question
                        </button>
                        <button className="btn btn-sm btn-ghost normal-case">
                          Generate Code
                        </button>
                        <button className="btn btn-sm btn-ghost normal-case">
                          Write Content
                        </button>
                        <button className="btn btn-sm btn-ghost normal-case">
                          Analyze Data
                        </button>
                      </div>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-base-300/50 rounded-xl p-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Info size={14} className="text-primary" />
                          <span>Using Gemini 1.5 Pro</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main Chat Area */}
              <div className="flex-1 flex flex-col">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="max-w-2xl mx-auto text-center space-y-6 py-12"
                    >
                      <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-secondary p-5">
                        <Bot className="w-full h-full text-primary-content" />
                      </div>
                      <h1 className="text-3xl font-bold">Welcome to Gemini AI</h1>
                      <p className="text-base-content/70">
                        Ask me anything - from coding help to creative writing, data analysis to general knowledge.
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-xl mx-auto">
                        <button className="btn btn-ghost btn-sm normal-case">Write a story</button>
                        <button className="btn btn-ghost btn-sm normal-case">Explain quantum physics</button>
                        <button className="btn btn-ghost btn-sm normal-case">Debug my code</button>
                        <button className="btn btn-ghost btn-sm normal-case">Analyze data</button>
                        <button className="btn btn-ghost btn-sm normal-case">Generate ideas</button>
                        <button className="btn btn-ghost btn-sm normal-case">Help with math</button>
                      </div>
                    </motion.div>
                  )}

                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-start max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            message.sender === 'bot' 
                              ? 'bg-gradient-to-br from-primary to-secondary' 
                              : 'bg-gradient-to-br from-secondary to-accent'
                          }`}>
                            {message.sender === 'bot' ? (
                              <Bot size={16} className="text-primary-content" />
                            ) : (
                              <User size={16} className="text-secondary-content" />
                            )}
                          </div>
                          
                          <div className={`rounded-2xl px-4 py-3 ${
                            message.sender === 'user'
                              ? 'bg-secondary text-secondary-content'
                              : 'bg-base-200'
                          }`}>
                            {message.type === 'image' ? (
                              <img src={message.file} alt={message.text} className="rounded-lg max-w-sm" />
                            ) : (
                              <div className="prose prose-sm max-w-none">
                                {message.text}
                              </div>
                            )}
                            <div className="text-xs opacity-70 mt-2">
                              {message.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                          <Bot size={16} className="text-primary-content" />
                        </div>
                        <div className="bg-base-200 rounded-2xl px-4 py-3">
                          <div className="flex gap-2">
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ repeat: Infinity, duration: 1 }}
                              className="w-2 h-2 rounded-full bg-primary"
                            />
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                              className="w-2 h-2 rounded-full bg-primary"
                            />
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                              className="w-2 h-2 rounded-full bg-primary"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t border-base-300 p-4 bg-base-200/50 backdrop-blur-sm">
                  <div className="max-w-4xl mx-auto relative">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      rows={1}
                      className="textarea textarea-bordered w-full pr-24 resize-none min-h-[3rem] bg-base-100/50"
                    />
                    
                    <div className="absolute right-2 bottom-2 flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowAttachments(!showAttachments)}
                        className="btn btn-circle btn-ghost btn-sm"
                      >
                        <Image size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="btn btn-circle btn-primary btn-sm"
                      >
                        <Send size={18} />
                      </motion.button>
                    </div>

                    <AnimatePresence>
                      {showAttachments && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute bottom-full right-0 mb-2 w-48 rounded-xl shadow-lg bg-base-200 border border-base-300"
                        >
                          <div className="p-2 space-y-1">
                            <label className="btn btn-ghost btn-sm justify-start w-full gap-2 normal-case">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                              />
                              <Image size={16} />
                              Upload Image
                            </label>
                            <button className="btn btn-ghost btn-sm justify-start w-full gap-2 normal-case">
                              <FileText size={16} />
                              Upload File
                            </button>
                            <button className="btn btn-ghost btn-sm justify-start w-full gap-2 normal-case">
                              <Mic size={16} />
                              Voice Message
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <div className="text-xs text-center mt-2 text-base-content/50">
                    Gemini may display inaccurate info, including about people, places, or facts
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
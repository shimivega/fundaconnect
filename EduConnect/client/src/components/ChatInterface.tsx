import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Paperclip, Smile, Mic, Video, Phone, Pin } from "lucide-react";

export function ChatInterface() {
  const { user } = useAuth();
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: studyGroups = [] } = useQuery({
    queryKey: ["/api/study-groups"],
  });

  const { data: messages = [] } = useQuery({
    queryKey: ["/api/study-groups", selectedGroup, "messages"],
    enabled: !!selectedGroup,
  });

  const { connected, sendMessage } = useWebSocket((user as any)?.id ?? "");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedGroup) return;

    sendMessage({
      type: "chat_message",
      groupId: selectedGroup,
      message: newMessage,
      messageType: "text",
    });

    setNewMessage("");
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  return (
    <section id="study-groups" className="py-20 themed-bg-secondary">
      <div className="max-w-7xl mx-auto px-4" data-testid="chat-interface-section">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold themed-text mb-4">Study Groups & Collaboration</h2>
          <p className="text-xl themed-text-secondary max-w-3xl mx-auto">
            Join study groups, collaborate with peers, and engage in real-time discussions with our WhatsApp-style chat interface.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Study Groups List */}
          <div className="lg:col-span-1">
            <Card className="themed-bg shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary to-secondary p-6">
                <h3 className="text-xl font-bold text-white mb-2">Study Groups</h3>
                <p className="text-blue-100">{Array.isArray(studyGroups) ? studyGroups.length : 0} available groups</p>
              </CardHeader>
              <CardContent className="p-4 space-y-2 max-h-96 overflow-y-auto" data-testid="study-groups-list">
                {Array.isArray(studyGroups) && studyGroups.map((group: any) => (
                  <motion.div
                    key={group.id}
                    whileHover={{ scale: 1.02 }}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedGroup === group.id 
                        ? "themed-bg-accent" 
                        : "hover:themed-bg-secondary"
                    }`}
                    onClick={() => setSelectedGroup(group.id)}
                    data-testid={`study-group-${group.id}`}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-sm">
                        {group.subject?.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold themed-text">{group.name}</h4>
                      <p className="text-sm themed-text-secondary">
                        {group.subject} • {group.gradeLevel}
                      </p>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      {Math.floor(Math.random() * 20) + 5}
                    </Badge>
                  </motion.div>
                ))}
                
                {(!Array.isArray(studyGroups) || studyGroups.length === 0) && (
                  <div className="text-center py-8">
                    <p className="themed-text-secondary">No study groups available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="themed-bg shadow-lg overflow-hidden h-96 flex flex-col">
              {selectedGroup ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 bg-gradient-to-r from-primary to-secondary text-white">
                    <div className="flex items-center justify-between" data-testid="chat-header">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                          <span className="font-bold text-sm">
                            {Array.isArray(studyGroups) ? studyGroups.find((g: any) => g.id === selectedGroup)?.subject?.substring(0, 2) : ""}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {Array.isArray(studyGroups) ? studyGroups.find((g: any) => g.id === selectedGroup)?.name : ""}
                          </h3>
                          <p className="text-blue-100 text-sm flex items-center">
                            <span className={`w-2 h-2 rounded-full mr-1 ${connected ? 'bg-green-400' : 'bg-red-400'}`}></span>
                            {connected ? 'Connected' : 'Connecting...'}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white hover:bg-opacity-20" data-testid="video-call-button">
                          <Video className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white hover:bg-opacity-20" data-testid="voice-call-button">
                          <Phone className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Pinned Messages */}
                  <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 dark:bg-yellow-900/20">
                    <div className="flex items-center" data-testid="pinned-message">
                      <Pin className="w-4 h-4 text-yellow-600 mr-2" />
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">📚 Group guidelines: Be respectful and help each other learn</p>
                    </div>
                  </div>
                  
                  {/* Chat Messages */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-4" data-testid="chat-messages">
                    {Array.isArray(messages) && messages.map((message: any) => {
                      const isOwn = message?.userId === user?.id;
                      
                      return (
                        <motion.div
                          key={message?.id || Math.random()}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${isOwn ? 'justify-end' : 'items-start'}`}
                        >
                          {!isOwn && (
                            <Avatar className="w-8 h-8 mr-2">
                              <AvatarFallback className="text-xs">
                                {getInitials(message.user?.firstName, message.user?.lastName)}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          
                          <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-1' : ''}`}>
                            <div className={`
                              rounded-2xl p-3 
                              ${isOwn 
                                ? 'bg-primary text-white rounded-tr-md' 
                                : 'themed-bg-secondary rounded-tl-md'
                              }
                            `}>
                              <p className="themed-text">{message.message}</p>
                              
                              {message.fileUrl && (
                                <div className="mt-2 p-2 bg-white bg-opacity-20 rounded-lg">
                                  <div className="flex items-center">
                                    <Paperclip className="w-4 h-4 mr-2" />
                                    <span className="text-sm">{message.fileName}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            <div className={`flex items-center mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                              <p className="text-xs themed-text-secondary">
                                {formatTime(message.createdAt)}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                    
                    {Array.isArray(messages) && messages.length === 0 && (
                      <div className="text-center py-8">
                        <p className="themed-text-secondary">No messages yet. Start the conversation!</p>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                  
                  {/* Chat Input */}
                  <div className="p-4 border-t themed-bg-secondary">
                    <div className="flex items-center space-x-2" data-testid="chat-input">
                      <Button variant="ghost" size="icon" className="themed-text-secondary hover:themed-text">
                        <Paperclip className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="themed-text-secondary hover:themed-text">
                        <Smile className="w-5 h-5" />
                      </Button>
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 themed-bg"
                        data-testid="message-input"
                      />
                      <Button 
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || !connected}
                        className="bg-primary hover:bg-primary/90 text-white"
                        data-testid="send-message-button"
                      >
                        <Send className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="themed-text-secondary hover:themed-text">
                        <Mic className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <img 
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300" 
                      alt="Study groups collaboration" 
                      className="w-48 h-36 object-cover rounded-lg mx-auto mb-4 opacity-60"
                    />
                    <h3 className="text-lg font-semibold themed-text mb-2">Select a Study Group</h3>
                    <p className="themed-text-secondary">Choose a study group from the list to start chatting</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

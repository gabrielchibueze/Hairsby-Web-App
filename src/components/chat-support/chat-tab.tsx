"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/lib/contexts/auth.context";
import {
  getAllChats,
  getChatMessages,
  sendMessage,
  markMessagesAsRead,
  subscribeToNewMessages,
  subscribeToDeletedMessages,
  ChatConversation,
  ChatMessage,
} from "@/lib/api/accounts/chat";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, formatDistanceToNow } from "date-fns";
import { ArrowLeft, Paperclip, SendHorizonal, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatTabProps {
  onClose: () => void;
}

export function ChatTab({ onClose }: ChatTabProps) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState({
    conversations: true,
    messages: true,
  });
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [view, setView] = useState<"list" | "chat">("list");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Improved scrollToBottom with requestAnimationFrame
  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior });
    });
  }, []);

  // Handle initial scroll when messages load
  const handleScrollAreaLoad = useCallback(() => {
    scrollToBottom("auto");
  }, [scrollToBottom]);

  // Force scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom("auto");
    }
  }, [messages, scrollToBottom]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await getAllChats();
        setConversations(data);
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      } finally {
        setLoading((prev) => ({ ...prev, conversations: false }));
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    if (!selectedConversation) return;

    let unsubscribeNewMessages: () => void;
    let unsubscribeDeletedMessages: () => void;

    const fetchMessages = async () => {
      try {
        setLoading((prev) => ({ ...prev, messages: true }));
        const { messages: fetchedMessages, hasMore } =
          await getChatMessages(selectedConversation);
        setMessages(fetchedMessages.reverse());
        setHasMoreMessages(hasMore);
        await markMessagesAsRead(selectedConversation, user?.id || "");
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setLoading((prev) => ({ ...prev, messages: false }));
      }
    };

    fetchMessages().then(() => {
      unsubscribeNewMessages = subscribeToNewMessages((message) => {
        if (
          (message.senderId === selectedConversation &&
            message.receiverId === user?.id) ||
          (message.receiverId === selectedConversation &&
            message.senderId === user?.id)
        ) {
          setMessages((prev) => [...prev, message]);
          if (message.senderId === selectedConversation) {
            markMessagesAsRead(selectedConversation, user?.id || "");
          }
        }
      });

      unsubscribeDeletedMessages = subscribeToDeletedMessages((messageId) => {
        setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
      });
    });

    return () => {
      unsubscribeNewMessages?.();
      unsubscribeDeletedMessages?.();
    };
  }, [selectedConversation, user?.id]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    try {
      const messageToSend = newMessage;
      setNewMessage("");
      const sentMessage = await sendMessage(
        selectedConversation,
        messageToSend,
        "text"
      );
      setMessages((prev) => [...prev, sentMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const getCurrentConversation = () => {
    return conversations.find(
      (c) =>
        (c.senderId === user?.id ? c.receiverId : c.senderId) ===
        selectedConversation
    );
  };

  const getConversationName = (conversation: ChatConversation) => {
    if (conversation.senderId === user?.id) {
      return `${conversation.receiver.firstName} ${conversation.receiver.lastName}`;
    }
    return `${conversation.sender.firstName} ${conversation.sender.lastName}`;
  };

  const getConversationAvatar = (conversation: ChatConversation) => {
    if (conversation.senderId === user?.id) {
      return conversation.receiver.photo;
    }
    return conversation.sender.photo;
  };

  const currentConversation = getCurrentConversation();

  return (
    <div className="flex flex-col h-full bg-background">
      {view === "chat" && selectedConversation ? (
        <>
          <div className="p-4 border-b border-border flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 text-foreground hover:bg-accent/10"
              onClick={() => setView("list")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Avatar
              className="mr-3"
              src={
                currentConversation
                  ? getConversationAvatar(currentConversation)
                  : undefined
              }
              alt={
                currentConversation
                  ? getConversationName(currentConversation)
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                  : "??"
              }
              fallback={
                currentConversation
                  ? getConversationName(currentConversation)
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                  : "??"
              }
            />
            <div>
              <h3 className="font-medium text-foreground">
                {currentConversation
                  ? getConversationName(currentConversation)
                  : "Loading..."}
              </h3>
            </div>
          </div>

          {loading.messages ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="space-y-4">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[300px]" />
              </div>
            </div>
          ) : (
            <ScrollArea
              ref={scrollAreaRef}
              className="flex-1 p-4 h-[60vh]"
              onLoadAutoScroll={handleScrollAreaLoad}
            >
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderId === user?.id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-3 py-2 ${
                        message.senderId === user?.id
                          ? "bg-hairsby-orange text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <p>{message.message}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.senderId === user?.id
                            ? "text-white/80"
                            : "text-muted-foreground"
                        }`}
                      >
                        {formatDistanceToNow(new Date(message.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          )}

          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Paperclip className="h-5 w-5 text-hairsby-orange/90" />
              </Button>
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-card text-foreground border-border"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
              />
              <Button
                onClick={handleSendMessage}
                className="bg-hairsby-orange hover:bg-hairsby-orange/80 text-foreground"
              >
                <SendHorizonal className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="h-full">
          <div className="p-4 border-b border-border flex justify-between items-center">
            <h2 className="text-lg font-semibold text-foreground">Messages</h2>
            <X
              onClick={onClose}
              className="text-sm cursor-pointer text-foreground hover:text-accent"
            />
          </div>

          {loading.conversations ? (
            <div className="space-y-4 p-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-16 w-full rounded-lg bg-secondary"
                />
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-20">
              <h2 className="text-foreground">No Chat messages</h2>
              <p className="text-sm text-muted-foreground">
                {user?.role === "customer"
                  ? "Discover new service providers"
                  : "Connect with clients"}{" "}
                to get started
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100%-60px)]">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="flex items-center p-4 border-b border-border cursor-pointer hover:bg-accent/10"
                  onClick={() => {
                    setSelectedConversation(
                      conversation.senderId === user?.id
                        ? conversation.receiverId
                        : conversation.senderId
                    );
                    setView("chat");
                  }}
                >
                  <Avatar
                    className="mr-3"
                    src={getConversationAvatar(conversation)}
                    alt={getConversationName(conversation)
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                    fallback={getConversationName(conversation)
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-foreground">
                        {getConversationName(conversation)}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(
                          new Date(conversation.lastMessage.createdAt),
                          { addSuffix: true }
                        )}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage.message}
                    </p>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <span className="ml-2 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              ))}
            </ScrollArea>
          )}
        </div>
      )}
    </div>
  );
}

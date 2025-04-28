// components/chat-support/chat-tab.tsx
"use client";

import { useState, useEffect } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
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
  }, [user]);

  useEffect(() => {
    if (!selectedConversation) return;

    const fetchMessages = async () => {
      try {
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

    fetchMessages();

    const unsubscribeNewMessages = subscribeToNewMessages((message) => {
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

    const unsubscribeDeletedMessages = subscribeToDeletedMessages(
      (messageId) => {
        setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
      }
    );

    return () => {
      unsubscribeNewMessages();
      unsubscribeDeletedMessages();
    };
  }, [selectedConversation, user]);

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
    <div className="flex flex-col h-full bg-hairsby-dark">
      {view === "chat" && selectedConversation ? (
        <>
          <div className="p-4 border-b border-[#1e293b] flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 text-white hover:bg-hairsby-orange/40"
              onClick={() => setView("list")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Avatar className="mr-3">
              <AvatarImage
                src={
                  currentConversation
                    ? getConversationAvatar(currentConversation)
                    : undefined
                }
              />
              <AvatarFallback>
                {currentConversation
                  ? getConversationName(currentConversation)
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                  : "??"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-white">
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
            <ScrollArea className="flex-1 p-4">
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
                      className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 ${
                        message.senderId === user?.id
                          ? "bg-hairsby-orange text-white"
                          : "bg-gray-700 text-gray-200"
                      }`}
                    >
                      <p>{message.message}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.senderId === user?.id
                            ? "text-white/70"
                            : "text-gray-400"
                        }`}
                      >
                        {format(new Date(message.createdAt), "p")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          <div className="p-4 border-t border-[#1e293b]">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Paperclip className="h-5 w-5 text-hairsby-orange" />
              </Button>
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-[#0a0e17] border-[#1e293b] text-white"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
              />
              <Button
                onClick={handleSendMessage}
                className="bg-hairsby-orange hover:bg-hairsby-orange/80"
              >
                <SendHorizonal className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="h-full">
          <div className="p-4 border-b border-[#1e293b] flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">Messages</h2>
            <X onClick={onClose} />
          </div>

          {loading.conversations ? (
            <div className="space-y-4 p-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-16 w-full rounded-lg bg-[#1e293b]"
                />
              ))}
            </div>
          ) : (
            <ScrollArea className="h-[calc(100%-60px)]">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="flex items-center p-4 border-b border-[#1e293b] cursor-pointer hover:bg-hairsby-orange/10"
                  onClick={() => {
                    setSelectedConversation(
                      conversation.senderId === user?.id
                        ? conversation.receiverId
                        : conversation.senderId
                    );
                    setView("chat");
                  }}
                >
                  <Avatar className="mr-3">
                    <AvatarImage src={getConversationAvatar(conversation)} />
                    <AvatarFallback>
                      {getConversationName(conversation)
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-white">
                        {getConversationName(conversation)}
                      </h3>
                      <span className="text-xs text-gray-400">
                        {format(
                          new Date(conversation.lastMessage.createdAt),
                          "p"
                        )}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 truncate">
                      {conversation.lastMessage.message}
                    </p>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <span className="ml-2 bg-hairsby-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
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

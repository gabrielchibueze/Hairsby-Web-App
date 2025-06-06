"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Paperclip, SendHorizonal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatTabProps {
  onClose: any;
  id?: string;
}

const MessageBubble = ({
  message,
  isCurrentUser,
}: {
  message: ChatMessage;
  isCurrentUser: boolean;
}) => (
  <div
    className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-3 py-2 ${
      isCurrentUser
        ? "bg-hairsby-orange text-white"
        : "bg-muted text-muted-foreground"
    }`}
  >
    <p>{message.message}</p>
    <p
      className={`text-xs mt-1 ${
        isCurrentUser ? "text-white/80" : "text-muted-foreground"
      }`}
    >
      {formatDistanceToNow(new Date(message.createdAt), {
        addSuffix: true,
      })}
    </p>
  </div>
);

const ConversationHeader = ({
  currentConversation,
  getConversationName,
  getConversationAvatar,
  onBack,
}: {
  currentConversation: ChatConversation | undefined;
  getConversationName: (conversation: ChatConversation) => string;
  getConversationAvatar: (conversation: ChatConversation) => string;
  onBack: () => void;
}) => (
  <div className="p-4 border-b border-border flex items-center gap-3">
    <Button
      variant="ghost"
      size="icon"
      className="text-foreground hover:bg-accent/10"
      onClick={onBack}
    >
      <ArrowLeft className="h-5 w-5" />
    </Button>
    <Avatar
      size="sm"
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
    <h3 className="font-medium text-foreground -ml-1">
      {currentConversation
        ? getConversationName(currentConversation)
        : "Loading..."}
    </h3>
  </div>
);

const MessageInput = React.memo(
  ({
    newMessage,
    setNewMessage,
    handleSendMessage,
  }: {
    newMessage: string;
    setNewMessage: (value: string) => void;
    handleSendMessage: () => void;
  }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    // Maintain focus after state updates
    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, [newMessage]);

    return (
      <div className="p-3 border-t border-border bg-background">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" type="button">
            <Paperclip className="h-5 w-5 text-hairsby-orange/90" />
          </Button>
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-card text-foreground border-border p-1 pl-4"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
          <Button onClick={handleSendMessage} variant="brand" type="button">
            <SendHorizonal className="h-5 w-5" />
          </Button>
        </div>
      </div>
    );
  }
);
const LoadingMessages = () => (
  <div className="flex-1 flex items-center justify-center h-[70vh]">
    <div className="space-y-4">
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[300px]" />
    </div>
  </div>
);

const MessagesList = ({
  messages,
  user,
  scrollAreaRef,
  handleScrollAreaLoad,
  messagesEndRef,
}: {
  messages: ChatMessage[];
  user: any;
  scrollAreaRef: React.RefObject<HTMLDivElement>;
  handleScrollAreaLoad: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}) => (
  <ScrollArea
    ref={scrollAreaRef}
    className="flex-1"
    onLoadAutoScroll={handleScrollAreaLoad}
  >
    <div className="p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.senderId === user?.id ? "justify-end" : "justify-start"
          }`}
        >
          <MessageBubble
            message={message}
            isCurrentUser={message.senderId === user?.id}
          />
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  </ScrollArea>
);

export function ChatTab({ onClose, id }: ChatTabProps) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const [loading, setLoading] = useState({
    conversations: false,
    messages: false,
  });
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [view, setView] = useState<"list" | "chat">("list");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior });
    });
  }, []);

  const handleScrollAreaLoad = useCallback(() => {
    scrollToBottom("auto");
  }, [scrollToBottom]);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom("auto");
    }
  }, [messages, scrollToBottom]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading((prev) => ({ ...prev, conversations: true }));
        const data = await getAllChats();
        setConversations(data);
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      } finally {
        setLoading((prev) => ({ ...prev, conversations: false }));
      }
    };

    fetchConversations();
  }, [user?.id]);

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

  const handleSendMessage = useCallback(async () => {
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
  }, [newMessage, selectedConversation, user]);

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

  const ChatView = () => (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0 flex flex-col">
        <ConversationHeader
          currentConversation={currentConversation}
          getConversationName={getConversationName}
          getConversationAvatar={getConversationAvatar}
          onBack={() => setView("list")}
        />

        {loading.messages ? (
          <LoadingMessages />
        ) : (
          <MessagesList
            messages={messages}
            user={user}
            scrollAreaRef={scrollAreaRef}
            handleScrollAreaLoad={handleScrollAreaLoad}
            messagesEndRef={messagesEndRef}
          />
        )}
      </div>

      <MessageInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
      />
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {view === "chat" && selectedConversation ? (
        <ChatView />
      ) : (
        <div className="flex-1 min-h-0">
          <div className="p-4 border-b border-border flex justify-between items-center">
            <h2 className="text-lg font-semibold text-foreground">Messages</h2>
          </div>

          {loading.conversations ? (
            <div className="space-y-4 p-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton
                  key={i + 1}
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
              {conversations.map((conversation, index) => (
                <div
                  key={`${conversation?.id}-${index + 1}`}
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
                  <div className="flex-1 ml-3">
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

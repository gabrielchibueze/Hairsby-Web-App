"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/lib/contexts/auth.context";
import {
  getUserSupportTickets,
  getSupportTicketChatHistory,
  sendSupportTicketChatMessage,
  subscribeToSupportMessages,
  subscribeToTicketUpdates,
  SupportTicket,
  SupportTicketMessage,
  createSupportTicket,
} from "@/lib/api/accounts/support";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, formatDistanceToNow } from "date-fns";
import { ArrowLeft, Plus, SendHorizonal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Spinner from "../general/spinner";

interface SupportTabProps {
  id?: string;
  onClose: any;
}

const supportCategories = [
  { value: "account", name: "Account" },
  { value: "subscription", name: "Subscription" },
  { value: "payment", name: "Payment" },
  { value: "appointment", name: "Appointment" },
  { value: "booking", name: "Booking" },
  { value: "service", name: "Service" },
  { value: "order", name: "Order" },
  { value: "product", name: "Product" },
  { value: "shipping", name: "Shipping" },
  { value: "technical", name: "Technical" },
  { value: "other", name: "Others" },
];

const MemoizedInput = React.memo(
  ({
    value,
    onChange,
    placeholder,
    className,
  }: {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    className?: string;
  }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, []);

    return (
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={className}
      />
    );
  }
);

const MemoizedTextarea = React.memo(
  ({
    value,
    onChange,
    placeholder,
    className,
  }: {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    className?: string;
  }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, []);

    return (
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={className}
      />
    );
  }
);

const MemoizedSelect = React.memo(
  ({
    value,
    onChange,
    options,
    className,
  }: {
    value: string;
    onChange: (value: string) => void;
    options: Array<{ value: string; name: string }>;
    className?: string;
  }) => {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={className}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
    );
  }
);

const MessageBubble = ({
  message,
  isCurrentUser,
}: {
  message: SupportTicketMessage;
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
      {formatDistanceToNow(new Date(message.timestamp), {
        addSuffix: true,
      })}
    </p>
  </div>
);

const TicketHeader = ({
  ticket,
  onBack,
}: {
  ticket: SupportTicket;
  onBack: () => void;
}) => (
  <div className="p-4 border-b border-border">
    <div className="flex items-center">
      <Button
        variant="ghost"
        size="icon"
        className="mr-2 text-foreground hover:bg-accent/10"
        onClick={onBack}
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <div>
        <h3 className="font-medium text-foreground">{ticket.subject}</h3>
        <div className="flex gap-2 mt-1">
          <span
            className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
              ticket.status
            )}`}
          >
            {ticket.status}
          </span>
          <span
            className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(
              ticket.priority
            )}`}
          >
            {ticket.priority}
          </span>
        </div>
      </div>
    </div>
  </div>
);

const MessageInput = React.memo(
  ({
    value,
    onChange,
    onSend,
  }: {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
  }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, []);

    return (
      <div className="p-4 border-t border-border bg-background">
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-card text-foreground border-border"
            onKeyDown={(e) => {
              if (e.key === "Enter") onSend();
            }}
          />
          <Button
            onClick={onSend}
            className="bg-hairsby-orange hover:bg-hairsby-orange/90 text-white"
          >
            <SendHorizonal className="h-5 w-5" />
          </Button>
        </div>
      </div>
    );
  }
);

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "low":
      return "bg-green-500/20 text-green-400";
    case "medium":
      return "bg-yellow-500/20 text-yellow-400";
    case "high":
      return "bg-orange-500/20 text-orange-400";
    case "urgent":
      return "bg-red-500/20 text-red-400";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "open":
      return "bg-blue-500/20 text-blue-400";
    case "in-progress":
      return "bg-purple-500/20 text-purple-400";
    case "resolved":
      return "bg-green-500/20 text-green-400";
    case "closed":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export function SupportTab({ onClose, id }: SupportTabProps) {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null
  );
  const [messages, setMessages] = useState<SupportTicketMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState({
    tickets: true,
    messages: true,
  });
  const [view, setView] = useState<"list" | "ticket" | "new-ticket">("list");
  const [newTicketData, setNewTicketData] = useState({
    subject: "",
    description: "",
    priority: "medium",
    category: "account",
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior });
    }, 100);
  }, []);

  const handleSubjectChange = useCallback((value: string) => {
    setNewTicketData((prev) => ({ ...prev, subject: value }));
  }, []);

  const handleDescriptionChange = useCallback((value: string) => {
    setNewTicketData((prev) => ({ ...prev, description: value }));
  }, []);

  const handlePriorityChange = useCallback((value: string) => {
    setNewTicketData((prev) => ({ ...prev, priority: value }));
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setNewTicketData((prev) => ({ ...prev, category: value }));
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || !selectedTicket) return;

    try {
      const messageToSend = newMessage;
      setNewMessage("");
      const sentMessage = await sendSupportTicketChatMessage(
        selectedTicket.id,
        {
          message: messageToSend,
          type: "text",
        }
      );
      setMessages((prev) => [...prev, sentMessage]);
      scrollToBottom();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }, [newMessage, selectedTicket, scrollToBottom]);

  const setNewMessageCallback = useCallback((value: string) => {
    setNewMessage(value);
  }, []);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { tickets: fetchedTickets } = await getUserSupportTickets();
        setTickets(fetchedTickets);
      } catch (error) {
        console.error("Failed to fetch tickets:", error);
      } finally {
        setLoading((prev) => ({ ...prev, tickets: false }));
      }
    };

    fetchTickets();
  }, [user]);

  useEffect(() => {
    if (!selectedTicket) return;

    let unsubscribeMessages: () => void;
    let unsubscribeTicketUpdates: () => void;

    const fetchMessages = async () => {
      try {
        setLoading((prev) => ({ ...prev, messages: true }));
        const fetchedMessages = await getSupportTicketChatHistory(
          selectedTicket.id
        );
        setMessages(fetchedMessages);
        scrollToBottom("auto");
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setLoading((prev) => ({ ...prev, messages: false }));
      }
    };

    fetchMessages().then(() => {
      unsubscribeMessages = subscribeToSupportMessages(
        selectedTicket.id,
        (message) => {
          setMessages((prev) => [...prev, message]);
          scrollToBottom();
        }
      );

      unsubscribeTicketUpdates = subscribeToTicketUpdates(
        selectedTicket.id,
        (updatedTicket) => {
          setSelectedTicket(updatedTicket);
          setTickets((prev) =>
            prev.map((t) => (t.id === updatedTicket.id ? updatedTicket : t))
          );
        }
      );
    });

    return () => {
      unsubscribeMessages?.();
      unsubscribeTicketUpdates?.();
    };
  }, [selectedTicket, scrollToBottom]);

  const handleCreateTicket = async () => {
    try {
      setLoading((prev) => ({ ...prev, tickets: true }));
      const ticket = await createSupportTicket(newTicketData);
      setTickets((prev) => [ticket, ...prev]);
      setSelectedTicket(ticket);
      setNewTicketData({
        subject: "",
        description: "",
        priority: "medium",
        category: "account",
      });
      setView("ticket");
    } catch (error) {
      console.error("Failed to create ticket:", error);
    } finally {
      setLoading((prev) => ({ ...prev, tickets: false }));
    }
  };

  const TicketView = () => (
    <div className="flex flex-col h-[70vh]">
      <div className="flex-1 min-h-0 flex flex-col">
        <TicketHeader ticket={selectedTicket!} onBack={() => setView("list")} />

        {loading.messages ? (
          <div className="flex-1 flex items-center justify-center h-[70vh]">
            <div className="space-y-4">
              <Skeleton className="h-4 w-[200px] bg-secondary" />
              <Skeleton className="h-4 w-[250px] bg-secondary" />
              <Skeleton className="h-4 w-[300px] bg-secondary" />
            </div>
          </div>
        ) : (
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 h-[70vh]">
            <div className="mt-3">
              <h4 className="font-medium text-foreground">Description</h4>
              <p className="text-muted-foreground mt-1">
                {selectedTicket?.description}
              </p>
            </div>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.userId === user?.id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <MessageBubble
                    message={message}
                    isCurrentUser={message.userId === user?.id}
                  />
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        )}
      </div>

      <MessageInput
        value={newMessage}
        onChange={setNewMessageCallback}
        onSend={handleSendMessage}
      />
    </div>
  );

  const NewTicketView = () => (
    <div className="flex flex-col h-[80vh]">
      <div className="p-4 border-b border-border flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 text-foreground hover:bg-accent/10"
          onClick={() => setView("list")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h3 className="font-medium text-foreground">Create New Ticket</h3>
      </div>

      <ScrollArea className="flex-1 min-h-[60vh] p-4">
        <div className="space-y-4 p-1">
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">
              Subject
            </label>
            <MemoizedInput
              value={newTicketData.subject}
              onChange={handleSubjectChange}
              placeholder="Brief subject of your issue"
              className="w-full bg-card text-foreground border-border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">
              Description
            </label>
            <MemoizedTextarea
              value={newTicketData.description}
              onChange={handleDescriptionChange}
              placeholder="Provide detailed information about your issue"
              className="w-full p-2 border rounded-md bg-card text-foreground border-border min-h-[100px]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">
              Priority
            </label>
            <MemoizedSelect
              value={newTicketData.priority}
              onChange={handlePriorityChange}
              options={[
                { value: "low", name: "Low" },
                { value: "medium", name: "Medium" },
                { value: "high", name: "High" },
                { value: "urgent", name: "Urgent" },
              ]}
              className="w-full p-2 border rounded-md bg-card text-foreground border-border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">
              Category
            </label>
            <MemoizedSelect
              value={newTicketData.category}
              onChange={handleCategoryChange}
              options={supportCategories}
              className="w-full p-2 border rounded-md bg-card text-foreground border-border"
            />
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <Button
          onClick={handleCreateTicket}
          className="w-full"
          variant="brand"
          disabled={loading.tickets}
        >
          {loading.tickets && <Spinner className="mr-2" />}
          Create Ticket
        </Button>
      </div>
    </div>
  );

  const ListView = () => (
    <div className="flex flex-col h-[70vh]">
      <div className="p-4 border-b border-border">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-foreground">
            Support Tickets
          </h2>
          <Button
            size="sm"
            variant="brand"
            onClick={() => setView("new-ticket")}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Ticket
          </Button>
        </div>
      </div>

      {loading.tickets ? (
        <div className="space-y-4 p-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg bg-secondary" />
          ))}
        </div>
      ) : tickets.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">
            You have no support tickets yet
          </p>
        </div>
      ) : (
        <ScrollArea className="flex-1 min-h-0">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="flex flex-col p-4 border-b border-border cursor-pointer hover:bg-accent/10"
              onClick={() => {
                setSelectedTicket(ticket);
                setView("ticket");
              }}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-foreground">
                  {ticket.subject}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(ticket.createdAt), "MMM d")}
                </span>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {ticket.description.substring(0, 50)}
                {ticket.description.length > 50 ? "..." : ""}
              </p>
              <div className="flex gap-2 mt-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(
                    ticket.priority
                  )}`}
                >
                  {ticket.priority}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                    ticket.status
                  )}`}
                >
                  {ticket.status}
                </span>
              </div>
            </div>
          ))}
        </ScrollArea>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {view === "ticket" && selectedTicket ? (
        <TicketView />
      ) : view === "new-ticket" ? (
        <NewTicketView />
      ) : (
        <ListView />
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
import { ArrowLeft, Plus, SendHorizonal, X } from "lucide-react";
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

  const handleSendMessage = async () => {
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
  };

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

  return (
    <div className="flex flex-col h-full bg-background">
      {view === "ticket" && selectedTicket ? (
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
            <div>
              <h3 className="font-medium text-foreground">
                {selectedTicket.subject}
              </h3>
              <div className="flex gap-2 mt-1">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getStatusColor(selectedTicket.status)}`}
                >
                  {selectedTicket.status}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(selectedTicket.priority)}`}
                >
                  {selectedTicket.priority}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 border-b border-border">
            <h4 className="font-medium text-foreground">Description</h4>
            <p className="text-muted-foreground mt-1">
              {selectedTicket.description}
            </p>
          </div>

          {loading.messages ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="space-y-4">
                <Skeleton className="h-4 w-[200px] bg-secondary" />
                <Skeleton className="h-4 w-[250px] bg-secondary" />
                <Skeleton className="h-4 w-[300px] bg-secondary" />
              </div>
            </div>
          ) : (
            <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.userId === user?.id ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-3 py-2 ${
                        message.userId === user?.id
                          ? "bg-hairsby-orange text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <p>{message.message}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.userId === user?.id
                            ? "text-white/80"
                            : "text-muted-foreground"
                        }`}
                      >
                        {formatDistanceToNow(new Date(message.timestamp), {
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
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-card text-foreground border-border"
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
              />
              <Button
                onClick={handleSendMessage}
                className="bg-hairsby-orange hover:bg-hairsby-orange/90 text-white"
              >
                <SendHorizonal className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </>
      ) : view === "new-ticket" ? (
        <div className="flex flex-col h-full">
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

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4 p-1">
              <div>
                <label className="block text-sm font-medium mb-1 text-foreground">
                  Subject
                </label>
                <Input
                  value={newTicketData.subject}
                  onChange={(e) =>
                    setNewTicketData((prev) => ({
                      ...prev,
                      subject: e.target.value,
                    }))
                  }
                  placeholder="Brief subject of your issue"
                  className="w-full bg-card text-foreground border-border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-foreground">
                  Description
                </label>
                <textarea
                  value={newTicketData.description}
                  onChange={(e) =>
                    setNewTicketData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Provide detailed information about your issue"
                  className="w-full p-2 border rounded-md bg-card text-foreground border-border min-h-[100px]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-foreground">
                  Priority
                </label>
                <select
                  value={newTicketData.priority}
                  onChange={(e) =>
                    setNewTicketData((prev) => ({
                      ...prev,
                      priority: e.target.value,
                    }))
                  }
                  className="w-full p-2 border rounded-md bg-card text-foreground border-border"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-foreground">
                  Category
                </label>
                <select
                  value={newTicketData.category}
                  onChange={(e) =>
                    setNewTicketData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full p-2 border rounded-md bg-card text-foreground border-border"
                >
                  {supportCategories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border">
            <Button
              onClick={handleCreateTicket}
              className="w-full bg-hairsby-orange hover:bg-hairsby-orange/90 text-white"
            >
              {loading.tickets && (
                <span className="mr-4">
                  <Spinner plain={true} />
                </span>
              )}
              Create Ticket
            </Button>
          </div>
        </div>
      ) : (
        <div className="h-full">
          <div className="p-4 border-b border-border flex justify-between items-start">
            <div className="flex flex-col items-start gap-2">
              <h2 className="text-lg font-semibold text-foreground">
                Support Tickets
              </h2>
              <Button
                size="sm"
                className="bg-hairsby-orange hover:bg-hairsby-orange/90 text-white"
                onClick={() => setView("new-ticket")}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Ticket
              </Button>
            </div>
            <X
              onClick={() => onClose(false)}
              className="text-sm cursor-pointer text-foreground hover:text-accent/70"
            />
          </div>

          {loading.tickets ? (
            <div className="space-y-4 p-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-16 w-full rounded-lg bg-secondary"
                />
              ))}
            </div>
          ) : tickets.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-muted-foreground mt-20">
                You have no support tickets yet
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100%-60px)]">
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
                      className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(ticket.priority)}`}
                    >
                      {ticket.priority}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getStatusColor(ticket.status)}`}
                    >
                      {ticket.status}
                    </span>
                  </div>
                </div>
              ))}
            </ScrollArea>
          )}
        </div>
      )}
    </div>
  );
}

// app/provider/chat-support/components/support-tab.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/contexts/auth.context";
import {
  createSupportTicket,
  getUserSupportTickets,
  getUserSupportTicketById,
  sendSupportTicketChatMessage,
  getSupportTicketChatHistory,
  subscribeToSupportMessages,
  subscribeToTicketUpdates,
  SupportTicket,
  SupportTicketMessage,
} from "@/lib/api/accounts/support";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Plus, SendHorizonal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

export function SupportTab() {
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
  const [isNewTicketDialogOpen, setIsNewTicketDialogOpen] = useState(false);
  const [newTicketData, setNewTicketData] = useState({
    subject: "",
    description: "",
    priority: "medium",
    category: "general",
  });
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
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { tickets: fetchedTickets } = await getUserSupportTickets();
        setTickets(fetchedTickets);
        if (fetchedTickets.length > 0 && !selectedTicket) {
          setSelectedTicket(fetchedTickets[0]);
        }
      } catch (error) {
        console.error("Failed to fetch tickets:", error);
      } finally {
        setLoading((prev) => ({ ...prev, tickets: false }));
      }
    };

    fetchTickets();
  }, [selectedTicket]);

  useEffect(() => {
    if (!selectedTicket) return;

    const fetchMessages = async () => {
      try {
        const fetchedMessages = await getSupportTicketChatHistory(
          selectedTicket.id
        );
        setMessages(fetchedMessages);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setLoading((prev) => ({ ...prev, messages: false }));
      }
    };

    fetchMessages();

    // Subscribe to new messages for this ticket
    const unsubscribeMessages = subscribeToSupportMessages(
      selectedTicket.id,
      (message) => {
        setMessages((prev) => [...prev, message]);
      }
    );

    // Subscribe to ticket updates
    const unsubscribeTicketUpdates = subscribeToTicketUpdates(
      selectedTicket.id,
      (updatedTicket) => {
        setSelectedTicket(updatedTicket);
        setTickets((prev) =>
          prev.map((t) => (t.id === updatedTicket.id ? updatedTicket : t))
        );
      }
    );

    return () => {
      unsubscribeMessages();
      unsubscribeTicketUpdates();
    };
  }, [selectedTicket]);

  const handleCreateTicket = async () => {
    try {
      const ticket = await createSupportTicket(newTicketData);
      setTickets((prev) => [ticket, ...prev]);
      setSelectedTicket(ticket);
      setIsNewTicketDialogOpen(false);
      setNewTicketData({
        subject: "",
        description: "",
        priority: "medium",
        category: "general",
      });
    } catch (error) {
      console.error("Failed to create ticket:", error);
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
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "urgent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-purple-100 text-purple-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex h-[calc(100vh-200px)] border rounded-lg overflow-hidden bg-white">
      {/* Tickets sidebar */}
      <div className="w-1/3 border-r">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-hairsby-dark">
            Support Tickets
          </h2>
          <Dialog
            open={isNewTicketDialogOpen}
            onOpenChange={setIsNewTicketDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="bg-hairsby-orange hover:bg-hairsby-orange/80"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Ticket
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Support Ticket</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <Input
                    value={newTicketData.subject}
                    onChange={(e) =>
                      setNewTicketData({
                        ...newTicketData,
                        subject: e.target.value,
                      })
                    }
                    placeholder="Briefly describe your issue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <Input
                    value={newTicketData.description}
                    onChange={(e) =>
                      setNewTicketData({
                        ...newTicketData,
                        description: e.target.value,
                      })
                    }
                    placeholder="Provide detailed information about your issue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={newTicketData.priority}
                    onChange={(e) =>
                      setNewTicketData({
                        ...newTicketData,
                        priority: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newTicketData.category}
                    onChange={(e) =>
                      setNewTicketData({
                        ...newTicketData,
                        category: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded-md"
                  >
                    {supportCategories.map((category) => {
                      return (
                        <option value={category.value}>{category.name}</option>
                      );
                    })}
                    {/* <option value="general">General</option>
                    <option value="technical">Technical</option>
                    <option value="billing">Billing</option>
                    <option value="account">Account</option> */}
                  </select>
                </div>
                <Button
                  onClick={handleCreateTicket}
                  className="w-full bg-hairsby-orange hover:bg-hairsby-orange/80"
                >
                  Create Ticket
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading.tickets ? (
          <div className="space-y-4 p-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-250px)]">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className={`flex flex-col p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedTicket?.id === ticket.id ? "bg-hairsby-orange/10" : ""
                }`}
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-hairsby-dark">
                    {ticket.subject}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {format(new Date(ticket.createdAt), "MMM d")}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">
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

      {/* Ticket details and chat */}
      <div className="flex-1 flex flex-col">
        {selectedTicket ? (
          <>
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold text-hairsby-dark">
                {selectedTicket.subject}
              </h3>
              <div className="flex gap-4 mt-2">
                <div>
                  <span className="text-sm text-gray-500">Category:</span>
                  <span className={`ml-2 text-sm px-2 py-1 rounded-full`}>
                    {selectedTicket?.category[0].toUpperCase() +
                      selectedTicket.category.slice(1)}
                  </span>
                </div>{" "}
                <div>
                  <span className="text-sm text-gray-500">Status:</span>
                  <span
                    className={`ml-2 text-sm px-2 py-1 rounded-full ${getStatusColor(
                      selectedTicket.status
                    )}`}
                  >
                    {selectedTicket.status}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Priority:</span>
                  <span
                    className={`ml-2 text-sm px-2 py-1 rounded-full ${getPriorityColor(
                      selectedTicket.priority
                    )}`}
                  >
                    {selectedTicket.priority}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Created:</span>
                  <span className="ml-2 text-sm">
                    {format(new Date(selectedTicket.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 border-b">
              <h4 className="font-medium text-hairsby-dark">Description</h4>
              <p className="text-gray-700 mt-1">{selectedTicket.description}</p>
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
                        message.userId === user?.id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 ${
                          message.userId === user?.id
                            ? "bg-hairsby-orange text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <p>{message.message}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.userId === user?.id
                              ? "text-white/70"
                              : "text-gray-500"
                          }`}
                        >
                          {format(new Date(message.timestamp), "p")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}

            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
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
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">
              {tickets.length === 0
                ? "You have no support tickets yet"
                : "Select a ticket to view details"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

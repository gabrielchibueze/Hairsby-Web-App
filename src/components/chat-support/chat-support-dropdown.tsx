"use client";

import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatTab } from "./chat-tab";
import { SupportTab } from "./support-tab";
import { useLocalStorageListener } from "@/hooks/use-local-storage-listener";

export function ChatSupportDropdown({ plain }: { plain?: boolean }) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("chat");

  // Watch for changes to these localStorage keys
  const cs = useLocalStorageListener("cs");
  const cid = useLocalStorageListener("cid");
  const sid = useLocalStorageListener("sid");

  useEffect(() => {
    if (cs === "chat" || cs === "support") {
      setActiveTab(cs);
      setOpen(true);
    }
  }, [cs]);

  const handleOpenChange = (newOpen: boolean) => {
    console.log("Open state changing to:", newOpen);
    setOpen(newOpen);

    if (!newOpen) {
      console.log("Clearing localStorage items");
      localStorage.removeItem("cs");
      localStorage.removeItem("cid");
      localStorage.removeItem("sid");
      console.log("After clearing:", {
        cs: localStorage.getItem("cs"),
        cid: localStorage.getItem("cid"),
        sid: localStorage.getItem("sid"),
      });
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`${plain ? "text-background hover:text-background" : "text-foreground hover:text-foreground"} hover:bg-hairsby-orange/40 relative`}
          title="Chat & Support"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-hairsby-orange"></span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-screen h-[calc(100vh-100px)] sm:w-[450px] sm:h-[85vh] border border-border bg-background text-foreground p-0"
        align="end"
        forceMount
      >
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="h-full flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-2 bg-background border-b border-border rounded-none">
            <TabsTrigger
              value="chat"
              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
            >
              Chat
            </TabsTrigger>
            <TabsTrigger
              value="support"
              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
            >
              Support
            </TabsTrigger>
          </TabsList>
          <div className="flex-1 overflow-hidden">
            <TabsContent value="chat" className="h-full m-0">
              <ChatTab onClose={handleOpenChange} />
            </TabsContent>
            <TabsContent value="support" className="h-full m-0">
              <SupportTab onClose={handleOpenChange} id={sid || undefined} />
            </TabsContent>
          </div>
        </Tabs>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

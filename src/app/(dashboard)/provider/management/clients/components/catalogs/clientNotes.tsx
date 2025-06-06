"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { updateClientNotes } from "@/lib/api/accounts/clients";
import { useAuth } from "@/lib/contexts/auth.context";
import { Client } from "@/lib/api/accounts/clients";
import { Skeleton } from "@/components/ui/skeleton";

interface ClientNotesProps {
  client: Client;
  isLoading: boolean;
}

export function ClientNotes({ client, isLoading }: ClientNotesProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (client?.metadata?.notes?.[user?.id || ""]) {
      setNotes(client.metadata.notes[user?.id as string].content);
    }
  }, [client, user]);

  const handleSaveNotes = async () => {
    try {
      setIsSaving(true);
      await updateClientNotes(client.id, notes);
      toast({
        title: "Success",
        description: "Notes saved successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save notes",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="font-medium text-lg">Client Notes</h3>
        <p className="text-sm text-muted-foreground">
          Add private notes about this client that only you can see
        </p>
      </div>
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add notes about this client..."
        className="min-h-[200px]"
      />
      <div className="flex justify-end">
        <Button onClick={handleSaveNotes} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Notes"}
        </Button>
      </div>
    </div>
  );
}

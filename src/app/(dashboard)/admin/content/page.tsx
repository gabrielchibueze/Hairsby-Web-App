"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import {  as Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BlogPostList } from "@/components/admin/blog-post-list"
import { AnnouncementList } from "@/components/admin/announcement-list"
import { EmailTemplateList } from "@/components/admin/email-template-list"
import { NotificationList } from "@/components/admin/notification-list"

export default function AdminContentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Management</h1>
          <p className="text-muted-foreground">
            Manage blog posts, announcements, and notifications
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create New
        </Button>
      </div>

      <Tabs defaultValue="blog">
        <TabsList>
          <TabsTrigger value="blog">Blog Posts</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="email">Email Templates</TabsTrigger>
          <TabsTrigger value="notifications">Push Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="blog">
          <BlogPostList />
        </TabsContent>
        <TabsContent value="announcements">
          <AnnouncementList />
        </TabsContent>
        <TabsContent value="email">
          <EmailTemplateList />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationList />
        </TabsContent>
      </Tabs>
    </div>
  )
}
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Mail, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { createEnquiry, EnquiryData } from "@/lib/api/contents/enquiry";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ErrorToastResponse } from "@/lib/utils/errorToast";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  type: z.enum([
    "general",
    "support",
    "business",
    "partnership",
    "media",
    "technical",
    "other",
  ]),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

const subjectOptions = [
  {
    value: "general",
    label: "General Inquiry",
    presetSubject: "General question about your services",
  },
  {
    value: "support",
    label: "I need help with my booking, order or account",
    presetSubject: "I need help with my booking or account",
  },
  {
    value: "technical",
    label: "Issue encountered on the website or app",
    presetSubject: "Issue encountered on the website or app",
  },
  {
    value: "business",
    label: "Business collaboration opportunity",
    presetSubject: "Business collaboration opportunity",
  },
  {
    value: "business",
    label: "Partnership proposal discussion",
    presetSubject: "Partnership proposal discussion",
  },
  {
    value: "support",
    label: "Feedback/Suggestion for Hairsby",
    presetSubject: "Feedback/Suggestion for Hairsby",
  },
  {
    value: "media",
    label: "Media request or press inquiry",
    presetSubject: "Media request or press inquiry",
  },
  {
    value: "other",
    label: "Other (please specify)",
    presetSubject: "",
  },
];

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "info@hairsby.com",
    link: "mailto:info@hairsby.com",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+44 77 8977 9444",
    link: "tel:+447789779444",
  },
];

export default function ContactComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [showCustomSubject, setShowCustomSubject] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      type: "general",
      message: "",
    },
  });

  const handleSubjectChange = (selectedLabel: string) => {
    const selectedOption = subjectOptions.find(
      (opt) => opt.label === selectedLabel
    );
    if (!selectedOption) return;

    // Set both type and subject fields
    form.setValue("type", selectedOption.value as any);

    if (selectedOption.value === "other") {
      setShowCustomSubject(true);
      form.setValue("subject", ""); // Clear subject for custom input
    } else {
      setShowCustomSubject(false);
      form.setValue("subject", selectedOption.presetSubject);
      form.trigger("subject"); // Manually trigger validation
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const enquiryData: EnquiryData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        subject: values.subject,
        type: values.type,
        message: values.message,
        status: "new",
      };

      await createEnquiry(enquiryData);

      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });
      form.reset();
      setShowCustomSubject(false);
    } catch (error: any) {
      const message = await ErrorToastResponse(error.response);
      toast({
        variant: "destructive",
        title: "Error",
        description: message || "Failed to send message. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-hairsby-dark text-white py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Get in Touch
            </h1>
            <p className="mt-4 text-lg text-gray-300">
              Have questions or feedback? We'd love to hear from you. Our team
              is ready to help.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 bg-white">
        <div className="container grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-bold text-gray-900">
              Contact Information
            </h2>
            <p className="text-gray-600">
              Reach out through any of these channels and we'll respond
              promptly.
            </p>

            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <motion.a
                  key={item.title}
                  href={item.link}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4 group"
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-hairsby-orange/10 text-hairsby-orange">
                      <item.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    <p className="text-gray-600 group-hover:text-hairsby-orange transition-colors">
                      {item.value}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gray-50 p-8 rounded-xl"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Send Us a Message
            </h2>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+44 123 456 7890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Hidden type field */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="hidden">
                      <FormControl>
                        <Input type="hidden" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <Select
                        onValueChange={handleSubjectChange}
                        defaultValue=""
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subjectOptions.map((option) => (
                            <SelectItem key={option.value} value={option.label}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {showCustomSubject && (
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>How can we help</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Please specify your subject"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Your message here..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-hairsby-orange hover:bg-hairsby-orange/80"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

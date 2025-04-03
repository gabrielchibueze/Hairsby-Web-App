"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AuthLayout } from "@/components/layout/auth-layout";
import { useAuth } from "@/lib/contexts/auth.context";
import { useToast } from "@/components/ui/use-toast";
import * as Icons from "@/components/icons";
import { PasswordInput } from "@/components/password-input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { countryCodes } from "@/lib/country-codes";

// Base schema with common fields
const baseSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters",
  }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  phone: z.object({
    countryCode: z.string().min(1, {
      message: "Country code is required",
    }),
    number: z.string().min(8, {
      message: "Phone number must be at least 8 characters",
    }),
  }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters",
    })
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, {
      message:
        "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character",
    }),
  dob: z.date({
    required_error: "Date of birth is required",
  }),
  referralCode: z.string().optional(),
  country: z.string().min(2, {
    message: "Country is required",
  }),
  city: z.string().min(2, {
    message: "City is required",
  }),
  postcode: z.string().min(3, {
    message: "Postcode is required",
  }),
});

// Customer schema extends base
const customerSchema = baseSchema.extend({
  role: z.literal("customer"),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters",
  }),
});

// Specialist schema extends base
const specialistSchema = baseSchema.extend({
  role: z.literal("specialist"),
  typeOfService: z.array(z.string()).min(1, {
    message: "Please select at least one service type",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters",
  }),
});

// Business schema extends base
const businessSchema = baseSchema.extend({
  role: z.literal("business"),
  businessName: z.string().min(2, {
    message: "Business name must be at least 2 characters",
  }),
  businessAddress: z.string().min(5, {
    message: "Business address must be at least 5 characters",
  }),
  typeOfService: z.array(z.string()).min(1, {
    message: "Please select at least one service type",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters",
  }),
});

// Combined schema using discriminated union
const formSchema = z.discriminatedUnion("role", [
  customerSchema,
  specialistSchema,
  businessSchema,
]);

const serviceTypes = [
  { id: "hair", label: "Hair Services" },
  { id: "nails", label: "Nail Services" },
  { id: "spa", label: "Spa Services" },
  { id: "makeup", label: "Makeup Services" },
  { id: "barber", label: "Barber Services" },
  { id: "massage", label: "Massage Services" },
  { id: "esthetics", label: "Esthetics Services" },
];

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [userCountry, setUserCountry] = useState("");
  const { signup } = useAuth();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get referral code from URL if exists
  const referralCodeFromUrl = searchParams.get("ref") || "";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "customer",
      firstName: "",
      lastName: "",
      email: "",
      phone: {
        countryCode: "",
        number: "",
      },
      password: "",
      dob: undefined,
      referralCode: referralCodeFromUrl,
      country: "",
      city: "",
      postcode: "",
    },
  });

  // Detect user's country on initial load
  useEffect(() => {
    const detectCountry = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        if (data.country) {
          setUserCountry(data.country_name);
          form.setValue("country", data.country_name);
          console.log(data);
          // Set default country code based on detected country
          const defaultCountryCode = countryCodes.find(
            (code) => code.iso === data.country
          )?.code;
          if (defaultCountryCode) {
            form.setValue("phone.countryCode", defaultCountryCode);
          }
        }
      } catch (error) {
        console.error("Could not detect country:", error);
      }
    };

    detectCountry();
  }, [form]);

  const selectedRole = form.watch("role");

  // Update referral code if it changes in the URL
  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      form.setValue("referralCode", ref);
    }
  }, [searchParams, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const formattedValues = {
        ...values,
        phone: `${values.phone.countryCode}${values.phone.number}`,
        dob: values.dob.toISOString(),
      };
      await signup(formattedValues);
      toast({
        title: "Account created",
        description: "Your account has been created successfully.",
      });
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error?.message || "Failed to create account. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Join our community of professionals and clients"
      // className="w-2/3"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Role Selection at the Top */}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>I want to</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="customer">Book Services</SelectItem>
                    <SelectItem value="specialist">Offer Services</SelectItem>
                    <SelectItem value="business">List My Business</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Common Fields for All Roles */}
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-6">
            <FormField
              control={form.control}
              name="phone.countryCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country code" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[300px] overflow-y-auto">
                      {countryCodes.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {`(${country.code})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone.number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="123456789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* 
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of Birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      captionLayout="dropdown-buttons"
                      fromYear={1900}
                      toYear={new Date().getFullYear()}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of Birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      classNames={{
                        caption_dropdowns: "flex gap-2 px-2 pb-2",
                        dropdown: "bg-background",
                        day_selected:
                          "bg-hairsby-orange text-white hover:bg-hairsby-orange hover:text-white focus:bg-hairsby-orange focus:text-white",
                        day_today:
                          "bg-accent text-accent-foreground border border-hairsby-orange",
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Location Fields */}
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="Country" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="City" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postcode</FormLabel>
                  <FormControl>
                    <Input placeholder="Postcode" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Role-Specific Fields */}
          {selectedRole === "customer" && (
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {(selectedRole === "specialist" || selectedRole === "business") && (
            <>
              <FormField
                control={form.control}
                name="typeOfService"
                render={() => (
                  <FormItem>
                    <FormLabel>
                      Type of Service (Select all that apply)
                    </FormLabel>
                    <div className="grid grid-cols-2 gap-4">
                      {serviceTypes.map((service) => (
                        <FormField
                          key={service.id}
                          control={form.control}
                          name="typeOfService"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={service.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(service.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...(field.value || []),
                                            service.id,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== service.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {service.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about your services..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedRole === "specialist" && (
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </>
          )}

          {selectedRole === "business" && (
            <>
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Business Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Business Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {/* Referral Code (Optional for all roles) */}
          <FormField
            control={form.control}
            name="referralCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Referral Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter referral code if any"
                    {...field}
                    value={field.value || ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-hairsby-orange hover:bg-hairsby-orange/90"
            disabled={isLoading}
          >
            {isLoading && (
              <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create account
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-hairsby-orange hover:text-hairsby-orange/80"
        >
          Sign in
        </Link>
      </div>
    </AuthLayout>
  );
}

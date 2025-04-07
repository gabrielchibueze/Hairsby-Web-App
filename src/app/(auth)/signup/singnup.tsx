"use client";

import { useState, useEffect, useRef } from "react";
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

// Base schema with common fields - updated with gender and coordinates
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
  gender: z.string().min(1, {
    message: "Gender is required",
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
  coordinates: z
    .object({
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    })
    .optional(),
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

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
];

export default function SignupComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [userCountry, setUserCountry] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const addressInputRef = useRef<HTMLInputElement>(null);
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
      gender: "",
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
      coordinates: {
        latitude: undefined,
        longitude: undefined,
      },
    },
  });

  // Detect user's country and coordinates on initial load
  useEffect(() => {
    const detectLocation = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        if (data.country) {
          setUserCountry(data.country_name);
          form.setValue("country", data.country_name);

          // Set default country code based on detected country
          const defaultCountryCode = countryCodes.find(
            (code) => code.iso === data.country
          )?.code;
          if (defaultCountryCode) {
            form.setValue("phone.countryCode", defaultCountryCode);
          }

          // Set coordinates if available
          if (data.latitude && data.longitude) {
            form.setValue("coordinates", {
              latitude: data.latitude,
              longitude: data.longitude,
            });
          }
        }
      } catch (error) {
        console.error("Could not detect location:", error);
      }
    };

    detectLocation();
  }, [form]);

  const selectedRole = form.watch("role");

  // Update referral code if it changes in the URL
  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      form.setValue("referralCode", ref);
    }
  }, [searchParams, form]);

  // Address autocomplete logic
  useEffect(() => {
    const addressField = form.watch(
      selectedRole === "business" ? "businessAddress" : "address"
    );
    const timer = setTimeout(async () => {
      if (addressField && addressField.length > 3) {
        try {
          setIsFetchingAddress(true);
          const response = await fetch(
            `https://api.mapbox.com/search/searchbox/v1/suggest?q=${addressField}&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}&session_token=${Math.random().toString(36).substring(2)}&country=${form.getValues("country")}`
          );
          const data = await response.json();
          setAddressSuggestions(data.suggestions || []);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Failed to fetch address suggestions:", error);
        } finally {
          setIsFetchingAddress(false);
        }
      }
    }, 1000); // 1 second delay after typing stops

    return () => clearTimeout(timer);
  }, [
    form.watch(selectedRole === "business" ? "businessAddress" : "address"),
    form,
    selectedRole,
  ]);

  const handleAddressSelect = async (suggestion: any) => {
    try {
      setIsFetchingAddress(true);
      const response = await fetch(
        `https://api.mapbox.com/search/searchbox/v1/retrieve/${suggestion.mapbox_id}?session_token=${Math.random().toString(36).substring(2)}&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
      );
      const data = await response.json();

      // Update form fields based on the selected address
      const address = data.features[0];
      const context = address.properties.context;

      if (selectedRole === "business") {
        form.setValue("businessAddress", address.properties.full_address);
      } else {
        form.setValue("address", address.properties.full_address);
      }

      // Extract city, postcode, and country from the address
      form.setValue("city", address.properties.locality || "");
      form.setValue("postcode", address.properties.postcode || "");
      form.setValue("country", address.properties.country || "");

      // Set coordinates if available
      if (address.geometry?.coordinates) {
        form.setValue("coordinates", {
          latitude: address.geometry.coordinates[1],
          longitude: address.geometry.coordinates[0],
        });
      }

      setShowSuggestions(false);
    } catch (error) {
      console.error("Failed to fetch address details:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch address details. Please try again.",
      });
    } finally {
      setIsFetchingAddress(false);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const formattedValues = {
        ...values,
        phone: `${values.phone.countryCode}${values.phone.number}`,
        dob: values.dob.toISOString(),
        coordinates: values.coordinates || undefined,
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

  // Render address input field based on role
  const renderAddressField = () => {
    const fieldName =
      selectedRole === "business" ? "businessAddress" : "address";
    const label = selectedRole === "business" ? "Business Address" : "Address";

    return (
      <FormField
        control={form.control}
        name={fieldName}
        render={({ field }) => (
          <FormItem className="relative">
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  placeholder="123 Main St"
                  {...field}
                  ref={addressInputRef}
                  onChange={(e) => {
                    field.onChange(e);
                    setShowSuggestions(e.target.value.length > 3);
                  }}
                />
                {isFetchingAddress && (
                  <Icons.Spinner className="absolute right-3 top-3 h-4 w-4 animate-spin" />
                )}
              </div>
            </FormControl>
            {showSuggestions && addressSuggestions.length > 0 && (
              <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-lg">
                {addressSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.mapbox_id}
                    className="cursor-pointer px-4 py-2 hover:bg-accent"
                    onClick={() => handleAddressSelect(suggestion)}
                  >
                    {suggestion.name} {suggestion.description}
                  </div>
                ))}
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Join our community of professionals and clients"
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

          {/* Gender Field */}
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {genderOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
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
                        caption_dropdowns: "flex gap-2 px-2 pb-2 mb-4",
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
          {selectedRole === "customer" && renderAddressField()}

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

              {selectedRole === "specialist" && renderAddressField()}
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

              {renderAddressField()}
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

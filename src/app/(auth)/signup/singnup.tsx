"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
import * as Icons from "@/components/general/icons";
import { PasswordInput } from "@/components/general/password-input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { countryCodes } from "@/lib/country-codes";
import { HAIRSBY_SERVICE_TYPES } from "@/lib/utils/hairsby-service-types";
import { ErrorToastResponse } from "@/lib/utils/errorToast";
import Spinner from "@/components/general/spinner";

// Add Google Maps types
/// <reference types="@types/google.maps" />

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

const serviceTypes = HAIRSBY_SERVICE_TYPES;

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
];

export default function SignupComponent() {
  return (
    <Suspense fallback={<Spinner plain={false} size="lg" />}>
      <Signup />
    </Suspense>
  );
}

function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  const [userCountry, setUserCountry] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const [autocompleteService, setAutocompleteService] =
    useState<google.maps.places.AutocompleteService | null>(null);
  const [placesService, setPlacesService] =
    useState<google.maps.places.PlacesService | null>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const { signup } = useAuth();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const targetRole = searchParams.get("t") as
    | "business"
    | "specialist"
    | "customer";
  // Get referral code from URL if exists
  const referralCodeFromUrl = searchParams.get("ref") || "";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: targetRole || "customer",
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

  // Initialize Google Maps services
  useEffect(() => {
    const initGoogleMaps = () => {
      if (typeof window !== "undefined" && window.google) {
        console.log("Google Maps API is loaded");
        const autocomplete = new google.maps.places.AutocompleteService();
        const places = new google.maps.places.PlacesService(
          document.createElement("div")
        );
        setAutocompleteService(autocomplete);
        setPlacesService(places);
        return true;
      }
      return false;
    };

    if (!initGoogleMaps()) {
      console.log("Loading Google Maps API script");
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log("Google Maps API script loaded");
        initGoogleMaps();
      };
      script.onerror = (error) => {
        console.error("Google Maps API script failed to load:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description:
            "Failed to load Google Maps services. Please refresh the page.",
        });
      };
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup if needed
    };
  }, [toast]);

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
      } catch (error) {}
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

  const handleAddressSelect = async (placeId: string) => {
    try {
      setIsFetchingAddress(true);
      if (!placesService) {
        throw new Error("Places service not initialized");
      }

      await new Promise<void>((resolve, reject) => {
        placesService.getDetails(
          {
            placeId,
            fields: ["address_components", "geometry", "formatted_address"],
          },
          (
            place: google.maps.places.PlaceResult | null,
            status: google.maps.places.PlacesServiceStatus
          ) => {
            if (status === "OK" && place) {
              // Update form fields based on the selected address
              const fieldName =
                selectedRole === "business" ? "businessAddress" : "address";
              form.setValue(fieldName, place.formatted_address || "");

              // Extract address components
              const components = place.address_components || [];
              const getComponent = (type: string) =>
                components.find((c) => c.types.includes(type))?.long_name || "";

              form.setValue("city", getComponent("locality"));
              form.setValue("postcode", getComponent("postal_code"));
              form.setValue("country", getComponent("country"));

              // Set coordinates if available
              if (place.geometry?.location) {
                form.setValue("coordinates", {
                  latitude: place.geometry.location.lat(),
                  longitude: place.geometry.location.lng(),
                });
              }

              resolve();
            } else {
              reject(new Error(`Places service status: ${status}`));
            }
          }
        );
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch address details. Please try again.",
      });
    } finally {
      setIsFetchingAddress(false);
      setShowSuggestions(false);
    }
  };

  const renderAddressField = () => {
    const fieldName =
      selectedRole === "business" ? "businessAddress" : "address";
    const label = selectedRole === "business" ? "Business Address" : "Address";

    const handleInputChange = async (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const value = e.target.value;
      form.setValue(fieldName, value);

      if (value.length > 2 && autocompleteService) {
        setShowSuggestions(true);
        setIsFetchingAddress(true);

        try {
          // Get the country ISO code from the country name
          const countryName = form.getValues("country");
          const countryData = countryCodes.find((c) => c.name === countryName);
          const countryCode = countryData?.iso;

          autocompleteService.getPlacePredictions(
            {
              input: value,
              componentRestrictions: countryCode
                ? { country: countryCode }
                : undefined,
            },
            (predictions, status) => {
              setIsFetchingAddress(false);
              if (status === "OK" && predictions) {
                setAddressSuggestions(predictions);
              } else {
                setAddressSuggestions([]);
                if (status !== "ZERO_RESULTS") {
                  console.warn("Autocomplete error:", status);
                }
              }
            }
          );
        } catch (error) {
          setIsFetchingAddress(false);
          setAddressSuggestions([]);
        }
      } else {
        setShowSuggestions(false);
        setAddressSuggestions([]);
      }
    };

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
                  onChange={handleInputChange}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 200)
                  }
                />
                {isFetchingAddress && (
                  <Icons.Spinner className="absolute right-3 top-3 h-4 w-4 animate-spin" />
                )}
              </div>
            </FormControl>
            {showSuggestions && addressSuggestions.length > 0 && (
              <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-lg max-h-60 overflow-auto">
                {addressSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.place_id}
                    className="cursor-pointer px-4 py-2 hover:bg-accent"
                    onClick={() => handleAddressSelect(suggestion.place_id)}
                  >
                    {suggestion.description}
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const formattedValues = {
        ...values,
        phone: `${values.phone.countryCode}${values.phone.number}`,
        dob: values.dob.toISOString(),
        longitude: values.coordinates?.longitude || undefined,
        latitude: values.coordinates?.latitude || undefined,
      };
      await signup(formattedValues);
      toast({
        title: "Account created",
        description: "Your account has been created successfully.",
      });
    } catch (error: any) {
      const message = await ErrorToastResponse(error.response);

      toast({
        variant: "destructive",
        title: "Error",
        description: message || "Failed to create account. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Join our community of professionals and clients"
      className="w-full lg:max-w-[600px]"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Role Selection */}
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

          {/* Common Fields */}
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

          {/* Email */}
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

          {/* Phone Number */}
          <div className="flex gap-6">
            <FormField
              control={form.control}
              name="phone.countryCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="-pl-6">
                        <SelectValue placeholder="Select country code" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[300px] overflow-y-auto">
                      {countryCodes.map((country, index) => (
                        <SelectItem
                          key={`${country.iso}-${country.code}`}
                          value={country.code}
                        >
                          {`${country.name} (${country.code})`}
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

          {/* Password */}
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

          {/* Date of Birth */}
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of Birth</FormLabel>
                <div className="grid grid-cols-3 gap-2">
                  {/* Day */}
                  <Select
                    onValueChange={(value) => {
                      const date = field.value || new Date();
                      date.setDate(parseInt(value));
                      field.onChange(date);
                    }}
                    value={field.value?.getDate().toString() || ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Day" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(
                        (day) => (
                          <SelectItem key={day} value={day.toString()}>
                            {day}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>

                  {/* Month */}
                  <Select
                    onValueChange={(value) => {
                      const date = field.value || new Date();
                      date.setMonth(parseInt(value));
                      field.onChange(date);
                    }}
                    value={field.value?.getMonth().toString() || ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December",
                      ].map((month, index) => (
                        <SelectItem key={month} value={index.toString()}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Year */}
                  <Select
                    onValueChange={(value) => {
                      const date = field.value || new Date();
                      date.setFullYear(parseInt(value));
                      field.onChange(date);
                    }}
                    value={field.value?.getFullYear().toString() || ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from(
                        { length: 100 },
                        (_, i) => new Date().getFullYear() - i
                      ).map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Address Fields */}
          {selectedRole === "customer" && renderAddressField()}
          {selectedRole === "specialist" && renderAddressField()}
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
            </>
          )}

          {/* Referral Code */}
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
          href={`/login${redirect ? `?redirect=${redirect}` : ""}`}
          className="font-medium text-hairsby-orange hover:text-hairsby-orange/80"
        >
          Sign in
        </Link>
      </div>
    </AuthLayout>
  );
}

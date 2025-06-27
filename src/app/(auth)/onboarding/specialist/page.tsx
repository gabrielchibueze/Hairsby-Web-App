// @/app/(auth)/onboarding/specialist/pageXOffset.tsx
"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
import { PasswordInput } from "@/components/general/password-input";
import { AuthLayout } from "@/components/layout/auth-layout";
import { useToast } from "@/components/ui/use-toast";
import * as Icons from "@/components/general/icons";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { HAIRSBY_SERVICE_TYPES } from "@/lib/utils/hairsby-service-types";
import { countryCodes } from "@/lib/country-codes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import Spinner from "@/components/general/spinner";
import {
  completeSpecialistOnboarding,
  onboardingPayload,
  validateSpecialistOnboardingToken,
} from "@/lib/api/accounts/business";
import { ErrorToastResponse } from "@/lib/utils/errorToast";
import SuspenseSpinner from "@/components/general/suspenseSpinner";

// Add Google Maps types
/// <reference types="@types/google.maps" />

const serviceTypes = HAIRSBY_SERVICE_TYPES;

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
];

const formSchema = z
  .object({
    firstName: z.string().min(2, {
      message: "First name must be at least 2 characters",
    }),
    lastName: z.string().min(2, {
      message: "Last name must be at least 2 characters",
    }),
    gender: z.string().min(1, {
      message: "Gender is required",
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
    confirmPassword: z.string().min(8, {
      message: "Please confirm your password",
    }),
    dob: z.date({
      required_error: "Date of birth is required",
    }),
    typeOfService: z.array(z.string()).min(1, {
      message: "Please select at least one service type",
    }),
    description: z.string().min(20, {
      message: "Description must be at least 20 characters",
    }),
    address: z.string().min(5, {
      message: "Address must be at least 5 characters",
    }),
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
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function SpecialistOnboardingPage() {
  return (
    <Suspense fallback={<SuspenseSpinner />}>
      <SpecialistOnboarding />
    </Suspense>
  );
}

function SpecialistOnboarding() {
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    businessName: string;
  } | null>(null);
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
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const token = searchParams.get("token");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "",
      phone: {
        countryCode: "",
        number: "",
      },
      password: "",
      confirmPassword: "",
      dob: undefined,
      typeOfService: [],
      description: "",
      address: "",
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
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => initGoogleMaps();
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

  // Validate token on load and set initial data
  useEffect(() => {
    if (!token) {
      router.push("/onboarding/invalid-token");
      return;
    }

    const validateToken = async () => {
      try {
        const data = await validateSpecialistOnboardingToken(token);

        if (data.success) {
          setOnboardingData(data.data);
          form.setValue("firstName", data.data.firstName);
          form.setValue("lastName", data.data.lastName);

          // Detect user's country for default values
          const countryResponse = await fetch("https://ipapi.co/json/");
          const countryData = await countryResponse.json();
          if (countryData.country) {
            setUserCountry(countryData.country_name);
            form.setValue("country", countryData.country_name);
            const defaultCountryCode = countryCodes.find(
              (code) => code.iso === countryData.country
            )?.code;
            if (defaultCountryCode) {
              form.setValue("phone.countryCode", defaultCountryCode);
            }

            // Set coordinates if available
            if (countryData.latitude && countryData.longitude) {
              form.setValue("coordinates", {
                latitude: countryData.latitude,
                longitude: countryData.longitude,
              });
            }
          }
        } else {
          router.push("/onboarding/invalid-token");
        }
      } catch (error) {
        router.push("/onboarding/invalid-token");
      }
    };

    validateToken();
  }, [token, router, form]);

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
              form.setValue("address", place.formatted_address || "");

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

  const handleAddressInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    form.setValue("address", value);

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!token) return;

    try {
      setIsLoading(true);

      // Construct payload with all required fields
      const payload: onboardingPayload = {
        firstName: values.firstName,
        lastName: values.lastName,
        gender: values.gender,
        phone: `${values.phone.countryCode}${values.phone.number}`,
        password: values.password,
        confirmPassword: values.confirmPassword,
        dob: values.dob.toISOString(),
        typeOfService: values.typeOfService,
        description: values.description,
        address: values.address,
        country: values.country,
        city: values.city,
        postcode: values.postcode,
      };

      // Add coordinates if available
      if (values.coordinates?.latitude && values.coordinates?.longitude) {
        payload.latitude = values.coordinates.latitude;
        payload.longitude = values.coordinates.longitude;
      }

      await completeSpecialistOnboarding(token, payload);

      toast({
        title: "Onboarding Complete",
        description: "Your account has been successfully set up.",
      });
      router.push("/login");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to complete onboarding",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (!onboardingData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <AuthLayout
      title="Complete Your Specialist Profile"
      subtitle={`Welcome to ${onboardingData.businessName} on Hairsby`}
      className="w-full lg:max-w-[600px]"
    >
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Name:</span> {onboardingData.firstName}{" "}
          {onboardingData.lastName}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          <span className="font-medium">Email:</span> {onboardingData.email}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          <span className="font-medium">Invite from Business:</span>{" "}
          {onboardingData.businessName}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} disabled />
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
                    <Input placeholder="Doe" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
                      {countryCodes.map((country) => (
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
                      fromYear={1900}
                      toYear={new Date().getFullYear()}
                      captionLayout="dropdown-buttons"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4">
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
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="123 Main St"
                      {...field}
                      ref={addressInputRef}
                      onChange={handleAddressInputChange}
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

          <FormField
            control={form.control}
            name="typeOfService"
            render={() => (
              <FormItem>
                <FormLabel>Type of Service (Select all that apply)</FormLabel>
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
                <FormLabel>Professional Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about your skills and experience..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            variant="brand"
            disabled={isLoading}
          >
            {isLoading && (
              <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Complete Onboarding
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
}

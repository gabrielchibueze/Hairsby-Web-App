// @/app/(auth)/onboarding/business-branch/page.tsx
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
import Spinner from "@/components/general/spinner";
import {
  completeBranchSetup,
  validateBranchToken,
} from "@/lib/api/accounts/company";
import { ErrorToastResponse } from "@/lib/utils/errorToast";
import SuspenseSpinner from "@/components/general/suspenseSpinner";

const serviceTypes = HAIRSBY_SERVICE_TYPES;

const formSchema = z
  .object({
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
    businessDetails: z.object({
      phone: z.string().min(8, {
        message: "Phone number must be at least 8 characters",
      }),
      address: z.string().min(5, {
        message: "Address must be at least 5 characters",
      }),
      city: z.string().min(2, {
        message: "City is required",
      }),
      country: z.string().min(2, {
        message: "Country is required",
      }),
      postcode: z.string().min(3, {
        message: "Postcode is required",
      }),
      description: z.string().optional(),
      typeOfService: z.array(z.string()).optional(),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function BranchOnboardingPage() {
  return (
    <Suspense fallback={<SuspenseSpinner />}>
      <BranchOnboarding />
    </Suspense>
  );
}

function BranchOnboarding() {
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState<{
    branchName: string;
    businessName: string;
    email: string;
    businessDetails: {
      phone?: string;
      address?: string;
      city?: string;
      country?: string;
      postcode?: string;
      description?: string | null;
      typeOfService?: string[] | null;
    };
  } | null>(null);
  const [userCountry, setUserCountry] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const token = searchParams.get("token");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      businessDetails: {
        phone: "",
        address: "",
        city: "",
        country: "",
        postcode: "",
        description: "",
        typeOfService: [],
      },
    },
  });

  // Validate token on load and set initial data
  useEffect(() => {
    if (!token) {
      router.push("/onboarding/invalid-token");
      return;
    }

    const validateToken = async () => {
      try {
        const data = await validateBranchToken(token);

        if (data.success) {
          setOnboardingData(data.data);

          // Reset form with the fetched data
          form.reset({
            password: "",
            confirmPassword: "",
            businessDetails: {
              phone: data.data.businessDetails?.phone || "",
              address: data.data.businessDetails?.address || "",
              city: data.data.businessDetails?.city || "",
              country: data.data.businessDetails?.country || "",
              postcode: data.data.businessDetails?.postcode || "",
              description: data.data.businessDetails?.description || "",
              typeOfService: Array.isArray(
                data.data.businessDetails?.typeOfService
              )
                ? data.data.businessDetails.typeOfService
                : [],
            },
          });
        } else {
          router.push("/onboarding/invalid-token");
        }
      } catch (error) {
        router.push("/onboarding/invalid-token");
      }
    };

    validateToken();
  }, [token, router, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!token) return;

    try {
      setIsLoading(true);

      const payload = {
        password: values.password,
        businessDetails: {
          phone: values.businessDetails.phone,
          address: values.businessDetails.address,
          city: values.businessDetails.city,
          country: values.businessDetails.country,
          postcode: values.businessDetails.postcode,
          description: values.businessDetails.description,
          typeOfService: values.businessDetails.typeOfService,
        },
      };

      await completeBranchSetup(token, payload);

      toast({
        title: "Branch Setup Complete",
        description: "Your branch has been successfully set up.",
      });
      router.push("/login");
    } catch (error: any) {
      const errorMessage = await ErrorToastResponse(error?.response);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage || "Failed to complete branch setup",
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
      title="Complete Your Branch Setup"
      subtitle={`Welcome to ${onboardingData.businessName} on Hairsby`}
      className="w-full lg:max-w-[600px]"
    >
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Branch Name:</span>{" "}
          {onboardingData.branchName}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          <span className="font-medium">Email:</span> {onboardingData.email}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          <span className="font-medium">Parent Business:</span>{" "}
          {onboardingData.businessName}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

          <div className="space-y-4">
            <h3 className="font-medium">Branch Details</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="businessDetails.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+44 1234 567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessDetails.address"
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

              <div className="grid gap-4 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="businessDetails.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="London" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="businessDetails.country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="United Kingdom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="businessDetails.postcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postcode</FormLabel>
                      <FormControl>
                        <Input placeholder="SW1A 1AA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="businessDetails.description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about your branch..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessDetails.typeOfService"
                render={() => (
                  <FormItem>
                    <FormLabel>Services Offered (Optional)</FormLabel>
                    <div className="grid grid-cols-2 gap-4">
                      {serviceTypes.map((service) => (
                        <FormField
                          key={service.id}
                          control={form.control}
                          name="businessDetails.typeOfService"
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
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            variant="brand"
            disabled={isLoading}
          >
            {isLoading && (
              <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Complete Setup
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
}

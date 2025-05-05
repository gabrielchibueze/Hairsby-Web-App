// // app/login/page.tsx
// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { useSearchParams } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { AuthLayout } from "@/components/layout/auth-layout";
// import { useAuth } from "@/lib/contexts/auth.context";
// import { useToast } from "@/components/ui/use-toast";
// import * as Icons from "@/components/icons";
// import { PasswordInput } from "@/components/password-input";

// const formSchema = z.object({
//   email: z.string().email({
//     message: "Please enter a valid email address",
//   }),
//   password: z.string().min(1, {
//     message: "Password is required",
//   }),
// });

// export default function LoginComponent() {
//   const [isLoading, setIsLoading] = useState(false);
//   const { login } = useAuth();
//   const { toast } = useToast();
//   const searchParams = useSearchParams();
//   const redirect = searchParams.get("redirect");

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   async function onSubmit(values: z.infer<typeof formSchema>) {
//     try {
//       setIsLoading(true);
//       await login(values.email, values.password);
//       toast({
//         title: "Success",
//         description: "You have successfully logged in.",
//       });
//     } catch (error: any) {
//       toast({
//         variant: "destructive",
//         title: "Invalid Credentials",
//         description: "Invalid email or password. Please try again.",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   return (
//     <AuthLayout
//       title="Welcome back"
//       subtitle="Sign in to your Hairsby account"
//       className="w-full max-w-md"
//     >
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//           <FormField
//             control={form.control}
//             name="email"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Email</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="email"
//                     placeholder="john@example.com"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="password"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Password</FormLabel>
//                 <FormControl>
//                   <PasswordInput placeholder="********" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <div className="flex items-center justify-end">
//             <Link
//               href="/forgot-password"
//               className="text-sm font-medium text-hairsby-orange hover:text-hairsby-orange/80"
//             >
//               Forgot password?
//             </Link>
//           </div>

//           <Button
//             type="submit"
//             className="w-full bg-hairsby-orange hover:bg-hairsby-orange/90"
//             disabled={isLoading}
//           >
//             {isLoading && (
//               <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
//             )}
//             Sign in
//           </Button>
//         </form>
//       </Form>

//       <div className="mt-6 text-center text-sm text-gray-600">
//         Don't have an account?{" "}
//         <Link
//           href="/signup"
//           className="font-medium text-hairsby-orange hover:text-hairsby-orange/80"
//         >
//           Sign up
//         </Link>
//       </div>
//     </AuthLayout>
//   );
// }

"use client";

import { useState, Suspense, useEffect } from "react";
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
import { AuthLayout } from "@/components/layout/auth-layout";
import { useAuth } from "@/lib/contexts/auth.context";
import { toast, useToast } from "@/components/ui/use-toast";
import * as Icons from "@/components/icons";
import { PasswordInput } from "@/components/password-input";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-8">Loading login form...</div>
      }
    >
      <LoginComponent />
    </Suspense>
  );
}

function LoginComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  useEffect(() => {
    if (user) {
      toast({
        title: "Already Authenticated",
        description: "Redirecting...",
      });
      router.back();
    }
  }, [user]);
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      await login(values.email, values.password);
      toast({
        title: "Success",
        description: "You have successfully logged in.",
      });
      router.push(redirect);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Invalid Credentials",
        description: "Invalid email or password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      {user ? (
        <div className="w-full flex flex-col items-center py-16">
          <h2>Already Authenticated</h2>
          <p>Redirecting...</p>
        </div>
      ) : (
        <AuthLayout
          title="Welcome back"
          subtitle="Sign in to your Hairsby account"
          className="w-full max-w-md"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

              <div className="flex items-center justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-hairsby-orange hover:text-hairsby-orange/80"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-hairsby-orange hover:bg-hairsby-orange/90"
                disabled={isLoading}
              >
                {isLoading && (
                  <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Sign in
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-hairsby-orange hover:text-hairsby-orange/80"
            >
              Sign up
            </Link>
          </div>
        </AuthLayout>
      )}
    </div>
  );
}

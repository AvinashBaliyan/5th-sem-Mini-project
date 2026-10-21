
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "@/lib/firebase";

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
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  athleteId: z.string().min(2, {
    message: "Athlete ID must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});

export function SignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      athleteId: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
        const auth = getAuth(app);
        await createUserWithEmailAndPassword(auth, values.email, values.password);
        toast({
            title: "Account Created",
            description: "You have been successfully signed up.",
        });
        router.push("/dashboard");
    } catch(error: any) {
        console.error("Sign-up Error:", error);
        toast({
            variant: "destructive",
            title: "Sign-up Failed",
            description: error.message || "An unexpected error occurred. Please try again.",
        });
    } finally {
        setIsLoading(false);
    }
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
            control={form.control}
            name="athleteId"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Athlete ID</FormLabel>
                <FormControl>
                <Input placeholder="Your Athlete ID" {...field} />
                </FormControl>
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
                <Input placeholder="name@example.com" {...field} />
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
                <Input type="password" placeholder="••••••••" {...field} />
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
                <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Creating account..." : "Sign Up"}
        </Button>
      </form>
    </Form>
  );
}

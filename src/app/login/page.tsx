
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { authService } from '@/lib/firebase/auth';
import { Github, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ConfirmationResult, RecaptchaVerifier } from 'firebase/auth';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

const phoneLoginSchema = z.object({
  phone: z.string().min(10, 'Please enter a valid 10-digit phone number.').refine(val => /^\+?[1-9]\d{1,14}$/.test(val), {
    message: "Phone number must be in E.164 format (e.g., +919876543210)",
  })
});

const otpSchema = z.object({
    otp: z.string().length(6, 'OTP must be 6 digits.'),
});

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [recaptcha, setRecaptcha] = useState<RecaptchaVerifier | null>(null);

  const router = useRouter();
  const { toast } = useToast();

  const emailForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const phoneForm = useForm<z.infer<typeof phoneLoginSchema>>({
    resolver: zodResolver(phoneLoginSchema),
    defaultValues: {
        phone: '+91'
    }
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
      resolver: zodResolver(otpSchema),
      defaultValues: {
          otp: ''
      }
  });

  useEffect(() => {
    const appVerifier = authService.setupRecaptcha('recaptcha-container');
    if (appVerifier) {
      setRecaptcha(appVerifier);
    }
  }, []);

  async function onEmailSubmit(values: z.infer<typeof loginSchema>) {
    setLoading(true);
    try {
      await authService.signInWithEmail(values.email, values.password);
      toast({
        title: 'Login Successful',
        description: "Welcome back!",
      });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  async function onPhoneSubmit(values: z.infer<typeof phoneLoginSchema>) {
    setPhoneLoading(true);
    if (recaptcha) {
        try {
            const result = await authService.signInWithPhone(values.phone, recaptcha);
            setConfirmationResult(result);
            toast({ title: 'OTP Sent', description: 'Please check your phone for the verification code.'});
        } catch(error: any) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } finally {
            setPhoneLoading(false);
        }
    }
  }

  async function onOtpSubmit(values: z.infer<typeof otpSchema>) {
      setOtpLoading(true);
      if (confirmationResult) {
        try {
            await confirmationResult.confirm(values.otp);
            toast({ title: 'Login Successful', description: 'Welcome!' });
            router.push('/dashboard');
        } catch(error: any) {
            toast({ variant: 'destructive', title: 'OTP Verification Failed', description: error.message });
        } finally {
            setOtpLoading(false);
        }
      }
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    try {
      await authService.signInWithGoogle();
      toast({
        title: 'Login Successful',
        description: "Welcome!",
      });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Google Sign-In Failed',
        description: error.message,
      });
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div id="recaptcha-container"></div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Sign in to access your digital business card.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="phone">Phone</TabsTrigger>
            </TabsList>
            <TabsContent value="email">
                 <Form {...emailForm}>
                    <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4 pt-4">
                    <FormField
                        control={emailForm.control}
                        name="email"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                            <Input type="email" placeholder="you@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={emailForm.control}
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
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Sign In with Email
                    </Button>
                    </form>
                </Form>
            </TabsContent>
            <TabsContent value="phone">
                {!confirmationResult ? (
                    <Form {...phoneForm}>
                        <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4 pt-4">
                             <FormField
                                control={phoneForm.control}
                                name="phone"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                    <Input type="tel" placeholder="+919876543210" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={phoneLoading}>
                                {phoneLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Send OTP
                            </Button>
                        </form>
                    </Form>
                ) : (
                    <Form {...otpForm}>
                        <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4 pt-4">
                            <FormField
                                control={otpForm.control}
                                name="otp"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Enter OTP</FormLabel>
                                    <FormControl>
                                        <Input placeholder="123456" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={otpLoading}>
                                {otpLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Verify OTP
                            </Button>
                        </form>
                    </Form>
                )}
            </TabsContent>
          </Tabs>

          <div className="my-4 flex items-center">
            <Separator className="flex-1" />
            <span className="mx-4 text-xs text-muted-foreground">OR CONTINUE WITH</span>
            <Separator className="flex-1" />
          </div>
          
          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={googleLoading}>
            {googleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Github className="mr-2 h-4 w-4" />}
            Google
          </Button>

          <div className="mt-4 text-center text-sm">
            Don't have an account?{' '}
            <Link href="/signup" className="font-semibold text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

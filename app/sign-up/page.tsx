"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { signUp } from '@/lib/auth/auth-client';
import { useRouter } from "next/navigation";


type SignUpState = { error: string | null; success: boolean };

const initialSignUpState: SignUpState = { error: null, success: false };

async function singUpAction(prevState: SignUpState, formData: FormData): Promise<SignUpState> {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await signUp.email({ name, email, password });

    if (error) {
        return { error: error.message ?? "Sign up failed", success: false };
    }

    return { error: null, success: true };
}

export default function SignUp() {
    const [showPassword, setShowPassword] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();

    const [state, formAction, pending] = useActionState(singUpAction, initialSignUpState);

    useEffect(() => {
        if (state.success) {
            router.push("/dashboard");
        }
    }, [state.success, router]);

    return (
        <div className="flex items-center justify-center from-primary/5 via-white to-white p-4 pt-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold text-black">Create your account</h1>
                    <p className="text-sm text-muted-foreground">
                        Start tracking your job applications in minutes
                    </p>
                </div>
                <Card className="border-none shadow-lg shadow-black/5 ring-1 ring-black/5">
                    <CardHeader className="sr-only">
                        <CardTitle>Sign Up</CardTitle>
                        <CardDescription>
                            Create an account to start tracking your job applications
                        </CardDescription>
                    </CardHeader>
                    <form action={formAction}>
                        <CardContent className="flex flex-col gap-4 pt-6">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text" placeholder="Your name"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email" type="email"
                                    name="email"
                                    placeholder="name@gmail.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pr-9"
                                    />
                                    <button
                                        type="submit"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute inset-y-0 right-0 flex items-center px-2.5 text-muted-foreground hover:text-foreground"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                            {state.error && <p className="text-sm text-destructive">{state.error}</p>}
                        </CardContent>
                        <CardFooter className="flex flex-col items-stretch gap-4 border-t-0 bg-transparent pt-2">
                            <Button type="submit" disabled={pending} className="w-full" size="lg">
                                {pending ? "Signing up...": "Sing Up"}
                            </Button>
                            <p className="text-center text-sm text-muted-foreground">
                                Already have an account?{" "}
                                <Link href="/sign-in" className="font-medium text-primary underline-offset-4 hover:underline">
                                    Sign In
                                </Link>
                            </p>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    )
}
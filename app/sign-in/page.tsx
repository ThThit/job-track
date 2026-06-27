"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { signIn } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";


type SignInState = { error: string | null; success: boolean; };

const initialSignInState: SignInState = { error: null, success: false };

async function SingnInAction(prevState: SignInState, formData: FormData): Promise<SignInState> {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await signIn.email({ email, password });

    if (error) {
        return { error: error.message ?? "Sign in failed", success: false };
    }

    return { error: null, success: true };
}

export default function SignIn() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();

    const [state, formAction, pending] = useActionState(SingnInAction, initialSignInState);

    useEffect(() => {
        if (state.success) {
            router.push("/dashboard");
        }
    }, [state.success, router]);

    return (
        <div className="flex items-center justify-center from-primary/5 via-white to-white p-4 pt-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold text-black">Welcome back</h1>
                    <p className="text-sm text-muted-foreground">
                        Sign in to continue tracking your job applications
                    </p>
                </div>
                <Card className="border-none shadow-lg shadow-black/5 ring-1 ring-black/5">
                    <CardHeader className="sr-only">
                        <CardTitle>Sign In</CardTitle>
                        <CardDescription>
                            Sign in to your account to continue tracking your job applications
                        </CardDescription>
                    </CardHeader>
                    <form action={formAction}>
                        <CardContent className="flex flex-col gap-4 pt-6">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email" type="email" placeholder="name@gmail.com"
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
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="pr-9"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute inset-y-0 right-0 flex items-center px-2.5 text-muted-foreground hover:text-foreground"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col items-stretch gap-4 border-t-0 bg-transparent pt-2">
                            <Button type="submit" disabled={pending} className="w-full" size="lg">
                                {pending ? "Signing in..." : "Sign In" }
                            </Button>
                            <p className="text-center text-sm text-muted-foreground">
                                Don&apos;t have an account?{" "}
                                <Link href="/sign-up" className="font-medium text-primary underline-offset-4 hover:underline">
                                    Sign Up
                                </Link>
                            </p>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    )
}
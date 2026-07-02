"use client";

import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/lib/auth/auth-client";
import SignOutButton from "./singout-btn";

export default function NavBar() {
    const { data: session } = useSession();

    return (
        <nav className="border-b border-gray-200 bg-white">
            <div className="container mx-auto flex gap-5 h-16 items-center px-4 justify-between">
                <Link href="/" className="flex items-center gap-2 text-2xl font-semibold text-primary">
                    <Briefcase />
                    Job Tracker
                </Link>

                {session?.user ? (
                    <>
                        {/* show when login */}
                        <SignOutButton/>
                    </>
                ) : (
                    <>
                        {/* show when not login */}
                        <div className="flex gap-2 items-center">
                            <Button variant="ghost" className="text-gray-700 hover:text-black">
                                <Link href="/sign-in" >Log In</Link>
                            </Button>
                            <Button className="hover:bg-primary/90">
                                <Link href="/sign-up">Start for free</Link>
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
}
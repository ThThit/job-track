"use client";

import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/lib/auth/auth-client";
import SignOutButton from "./singout-btn";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./avatar";

export default function NavBar() {
    const { data: session } = useSession();

    return (
        <nav className="border-b border-gray-200 bg-white">
            <div className="container mx-auto flex gap-5 h-16 items-center px-4 justify-between">
                <Link href="/" className="flex items-center gap-2 text-2xl font-semibold text-primary">
                    <Briefcase />
                    Job Tracker
                </Link>

                <div className="flex items-center gap-4">
                    {session?.user ? (
                        <>
                            {/* show when login */}

                            <Link href="/dashboard">
                                <Button variant="ghost" className="hover:text-gray-700">Dashboard</Button>
                            </Link>

                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                    <Avatar className="cursor-pointer me-3">
                                        <AvatarFallback className="bg-primary text-white">
                                            {session?.user?.name?.split(" ").map(n => n[0]).join("").toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                    
                                <DropdownMenuContent className="w-6" align="end">
                                    <DropdownMenuLabel className="font-normal border-b-2 mb-1 pb-2">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {session?.user?.name}
                                            </p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {session?.user?.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <SignOutButton />
                                </DropdownMenuContent>
                            </DropdownMenu>

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
            </div>
        </nav>
    );
}
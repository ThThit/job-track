"use client";

import { signOut } from "@/lib/auth/auth-client";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
    const router = useRouter();

    return (
        <DropdownMenuItem
            className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
            onClick={async () => {
                const result = await signOut();
                if (result.data) {
                    router.push("/sign-in");
                } else {
                    alert("Error signing out");
                }
            }}
        >
            <LogOut className="h-4 w-4" />
            Sign out
        </DropdownMenuItem>
    );
}
"use client";

import { signOut } from "@/lib/auth/auth-client";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
    const router = useRouter();

    return (
        <Button
            variant="ghost"
            className="text-gray-700 hover:text-white hover:bg-red-600"
            onClick={async () => {
                const result = await signOut();
                if (result.data) {
                    router.push("/sign-in");
                } else {
                    alert("Error signing out");
                }
            }}
        >
            Log Out
        </Button>
    );
}
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center flex-1 gap-4 text-center px-4">
            <div className="flex items-center justify-center w-24 h-24 rounded-full bg-primary/10">
                <Briefcase className="h-12 w-12 text-primary" />
            </div>
            <div className="space-y-2">
                <h1 className="text-7xl font-bold text-primary">404</h1>
                <h2 className="text-2xl font-semibold text-gray-900">Page not found</h2>
                <p className="text-gray-500 max-w-sm">
                    Looks like this page doesn't exist. It may have been moved or deleted.
                </p>
            </div>
            <Button asChild className="mt-2">
                <Link href="/">Back to home</Link>
            </Button>
        </div>
    );
}

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/auth/auth";

export default async function middleware(request: NextRequest) {
    const session = await getSession({ headers: request.headers });

    const isSignInPage = request.nextUrl.pathname.startsWith("/sign-in");
    const isSignUpPage = request.nextUrl.pathname.startsWith("/sign-up");
    const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");

    // redirect logged-in users away from auth pages
    if ((isSignUpPage || isSignInPage) && session?.user) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // redirect unauthenticated users away from protected pages
    if (isDashboard && !session?.user) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/sign-in", "/sign-up"],
};

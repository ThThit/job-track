"use client"; // client side for use state

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
Button

export default function ImageTabs() {
    const [activeTab, setActiveTab] = useState("organize");
    return (
        // image section
        <section className = "border bg-white py-16" >
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-6xl">
                    {/* Tabs */}
                    <div className="flex flex-wrap gap-2 justify-center mb-8 relative z-10">
                        <Button
                            onClick={() => setActiveTab("organize")} className={`rounded-lg px-3 md:px-6 py-3 text-xs md:text-sm font-medium transition-colors ${activeTab == "organize" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>Organized Applications</Button>
                        <Button
                            onClick={() => setActiveTab("hired")} className={`rounded-lg px-3 md:px-6 py-3 text-xs md:text-sm font-medium transition-colors ${activeTab == "hired" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>Get Hired</Button>
                        <Button
                            onClick={() => setActiveTab("boards")} className={`rounded-lg px-3 md:px-6 py-3 text-xs md:text-sm font-medium transition-colors ${activeTab == "boards" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>Manage Boards</Button>
                    </div>
                    <div className="relative mx-auto max-w-5xl overflow-hidden rounded-lg border border-gray-200 shadow-xl">
                        {activeTab == "organize" &&
                            (<Image
                            src="/hero-img/hero1.png" alt="Organize Applications" width={1200} height={800}></Image>)}
                        {activeTab == "hired" &&
                            (<Image
                            src="/hero-img/hero2.png" alt="hired" width={1200} height={800}></Image>)}
                        {activeTab == "boards" &&
                            (<Image
                            src="/hero-img/hero3.png" alt="boards" width={1200} height={800}></Image>)}
                    </div>
                </div>
            </div>
        </section >
    )
}
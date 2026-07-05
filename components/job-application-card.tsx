"use client";

import { Column, JobApplication } from "@/lib/models/models.types";
import { useState } from "react";
import { Card, CardContent } from "./ui/card";

interface JobApplicationCardProps {
    job: JobApplication;
    columns: Column[];
    dragHandleProps?: React.HtmlHTMLAttributes<HTMLElement>;
}

export default function JobApplicationCard({
    job, 
    columns,
    dragHandleProps,
}: JobApplicationCardProps) {
    const [isEditing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        company: job.company,
        position: job.position,
        location: job.location || "",
        notes: job.notes || "",
        salary: job.salary || "",
        jobUrl: job.jobUrl || "",
        columnId: job.columnId || "",
        tags: job.tags?.join(", ") || "",
        descriptioin: job.description || "",
    });

    return (
        <>
            <Card>
                <CardContent>
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}
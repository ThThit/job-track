"use client";

import { Column, JobApplication } from "@/lib/models/models.types";
import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, ExternalLink, MoreVertical, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { deleteJobApplication } from "@/app/actions/job-applications";

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

    // job card delete handle
    async function handleDelete() {
        try {
            const result = await deleteJobApplication(job._id);

            if (result.error) {
                console.error("Failed to delete job application", result.error);
            }
        } catch (err) {
            console.error("Failed to move job application: ", err);
        }
    }

    return (
        <>
            <Card className="cursor-pointer transition-shadow hover:shadow-lg bg-white group shadow-sm">
                <CardContent>
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm mb-1">{job.position}</h3>
                            <p className="text-xs text-muted-foreground mb-2">{job.company}</p>
                            {job.description && (
                                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                    {job.description}
                                </p>
                            )}
                            {job.tags && job.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {job.tags.map((tag, index) => (
                                        <span key={index} className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                            {job.jobUrl && (
                                <a href={job.jobUrl} >
                                    <ExternalLink className="h-3 w-3"/>
                                </a>
                            )}
                        </div>
                        {/* drop down option */}
                        <div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-6 w-6" size="icon">
                                        <MoreVertical className="h-4 w-4"/>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                        <Edit2 className="mr-2 h-4 w-4"/>Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive" onClick={() => handleDelete()}>
                                        <Trash2 className="mr-2 h-4 w-4"/>Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}
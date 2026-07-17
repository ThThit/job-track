"use client";

import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useTransition, useState } from "react";
import { createJobAction } from "@/app/actions/job-applications";
import { JobApplication } from "@/lib/models/models.types";
import { CreateJobState } from "@/app/actions/job-applications";

interface CreateJobApplicationDialogProps {
    columnId: string;
    boardId: string;
    job?: JobApplication;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export default function CreateJobApplicationDialog({
    columnId,
    boardId,
    job, 
    open,
    onOpenChange,
}: CreateJobApplicationDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const isOpen = open ?? internalOpen;
    const setIsOpen = onOpenChange ?? setInternalOpen;
    const [state, setState] = useState<CreateJobState>({ success: false });
    const [isPending, startTransition] = useTransition();

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(async () => {
            const result = await createJobAction({ success: false }, formData);
            setState(result);
            if (result.success) setIsOpen(false);
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {!job && (
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full mb-4 justify-start text-muted-foreground border-dashed border-2 hover:border-solid hover:bg-muted/50"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Job
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Add Job Application</DialogTitle>
                    <DialogDescription>Track a new job application</DialogDescription>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input type="hidden" name="columnId" value={columnId} />
                    <input type="hidden" name="boardId" value={boardId} />
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="company">Company *</Label>
                                <Input id="company" name="company" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="position">Position *</Label>
                                <Input id="position" name="position" required />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input id="location" name="location" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="salary">Salary</Label>
                                <Input id="salary" name="salary" placeholder="e.g., $100k - $150k" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="jobUrl">Job URL</Label>
                            <Input id="jobUrl" name="jobUrl" type="url" placeholder="https://..." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tags">Tags (comma-separated)</Label>
                            <Input id="tags" name="tags" placeholder="React, Tailwind, High Pay" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" name="description" rows={3} placeholder="Brief description of the role..." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea id="notes" name="notes" rows={4} />
                        </div>
                    </div>

                    {state.error && <p className="text-sm text-destructive">{state.error}</p>}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Adding..." : "Add Application"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

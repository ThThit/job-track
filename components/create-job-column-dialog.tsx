"use client";

import { CreateJobColumnState, createJobColumn } from "@/app/actions/job-applications";
import { useState, useActionState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const COLOR_OPTIONS = [
    { label: "Cyan", value: "bg-cyan-500" },
    { label: "Purple", value: "bg-purple-500" },
    { label: "Green", value: "bg-green-500" },
    { label: "Yellow", value: "bg-yellow-500" },
    { label: "Red", value: "bg-red-500" },
];

interface CreateJobColumnDialogProps {
    boardId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CreateJobColumnDialog({
    boardId,
    open,
    onOpenChange,
}: CreateJobColumnDialogProps) {
    const [state, formAction, isPending] = useActionState(createJobColumn, { success: false });
    const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0].value);

    useEffect(() => {
        if (state.success) onOpenChange(false);
    }, [state.success]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm p-5">
                <DialogHeader>
                    <DialogTitle>Create Column</DialogTitle>
                    <DialogDescription>Add a new column to your board.</DialogDescription>
                </DialogHeader>
                <form className="space-y-4" action={formAction}>
                    <input type="hidden" name="boardId" value={boardId} />
                    <input type="hidden" name="columnColor" value={selectedColor} />
                    <div className="space-y-2">
                        <Label htmlFor="columnName">Column Name *</Label>
                        <Input id="columnName" name="columnName" required placeholder="e.g. Final Round" />
                    </div>
                    <div className="space-y-2">
                        <Label>Header Color</Label>
                        <div className="flex gap-5 mt-4">
                            {COLOR_OPTIONS.map((color) => (
                                <button
                                    key={color.value}
                                    type="button"
                                    onClick={() => setSelectedColor(color.value)}
                                    className={`h-8 w-8 rounded-full ${color.value} transition-all ${selectedColor === color.value ? "ring-2 ring-offset-2 ring-gray-800 scale-110" : ""}`}
                                    title={color.label}
                                />
                            ))}
                        </div>
                    </div>
                    {state.error && <p className="text-sm text-destructive">{state.error}</p>}
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Creating..." : "Create Column"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

"use server";

import { getSession } from "@/lib/auth/auth";
import connectDB from "@/lib/db";
import { Board, Column, JobApplication } from "@/lib/models";
import jobApplications from "@/lib/models/job-applications";
import { revalidatePath } from "next/cache";

function extractJobFields(formData: FormData) {
    return {
        company: formData.get("company") as string,
        position: formData.get("position") as string,
        location: formData.get("location") as string,
        salary: formData.get("salary") as string,
        jobUrl: formData.get("jobUrl") as string,
        tagsRaw: formData.get("tags") as string,
        description: formData.get("description") as string,
        notes: formData.get("notes") as string,
    }
}


export type CreateJobState = {
    success: boolean;
    error?: string;
};

export type CreateJobColumnState = {
    success: boolean;
    error?: string;
}

export async function createJobAction(prevState: CreateJobState, formData: FormData): Promise<CreateJobState> {
    const session = await getSession();
    console.log("session:", session?.user?.id);
    if (!session?.user) return {
        success: false, error: "Unathorized"
    };

    const fields = extractJobFields(formData);

    const columnId = formData.get("columnId") as string;
    const boardId = formData.get("boardId") as string;

    if (!fields.company || !fields.position) return { success: false, error: "Company and Position are required" };

    try {
        await connectDB();

        const column = await Column.findById(columnId);
        if (!column) return { success: false, error: "Column not found" };

        const job = await JobApplication.create({
            company: fields.company,
            position: fields.position,
            location: fields.location,
            salary: fields.salary,
            jobUrl: fields.jobUrl,
            tags: fields.tagsRaw ? fields.tagsRaw.split(",").map((t: string) => t.trim()).filter((t) => t.length > 0) : [],
            description: fields.description,
            notes: fields.notes,
            columnId,
            boardId,
            userId: session.user.id,
            order: column.jobApplications.length,
            status: "applied",
        });

        column.jobApplications.push(job._id);
        await column.save();

        revalidatePath("/dashboard");
        return { success: true };
    } catch (e) {
        console.error("createJobAction error:", e);
        return { success: false, error: (e as Error).message };
    }
}

export async function deleteJobApplication(id: string) {
    const session = await getSession();
    if (!session?.user) return { error: "Unauthorized" };

    try {
        await connectDB();

        const job = await JobApplication.findById(id);
        if (!job) return { error: "Job application not found" };
        if (job.userId !== session.user.id) return { error: "Unauthorized" };

        await Column.findByIdAndUpdate(job.columnId, {
            $pull: { jobApplications: job._id },
        });

        await JobApplication.deleteOne({ _id: id });
        revalidatePath("/dashboard");

        return { success: true };
    } catch (e) {
        return { error: (e as Error).message };
    }
}

export async function updateJobApplication(prevState: CreateJobState, formData: FormData): Promise<CreateJobState> {
    const fields = extractJobFields(formData);
    const jobId = formData.get("jobId") as string;
    const { tagsRaw, ...rest } = fields;

    const session = await getSession();
    if (!session?.user) return { success: false, error: "Unauthorized" };

    try {
        await connectDB();
        
        await JobApplication.findByIdAndUpdate(jobId, {
            ...rest,
            tags: tagsRaw ? tagsRaw.split(",").map(t => t.trim()).filter(t => t.length > 0) : [],
        });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (err) {
        return { success: false, error: (err as Error).message };
    }
}

export async function deleteJobColumn(id: string) {
    const session = await getSession();
    if (!session?.user) return { error: "Unathorized" };

    try {
        await connectDB();

        const jobColumn = await Column.findById(id);
        if (!jobColumn) return { error: "Column not found" };

        await JobApplication.deleteMany({ columnId: id });

        await Board.findByIdAndUpdate(jobColumn.boardId, {
            $pull: { columns: jobColumn._id },
        });

        await Column.deleteOne({ _id: id });

        console.log("deleteJobColumn success:", id);
        revalidatePath("/dashboard");
        return { success: true };
    } catch (e) {
        return { error: (e as Error).message };
    }
}

export async function createJobColumn(prevState: CreateJobColumnState, formData: FormData): Promise<CreateJobColumnState> {
    const session = await getSession();
    console.log("session:", session?.user?.id);
    if (!session?.user) return {
        success: false, error: "Unathorized"
    };

    const columnName = formData.get("columnName") as string;
    const columnColor = formData.get("columnColor") as string;
    const boardId = formData.get("boardId") as string;

    if (!columnName) return { success: false, error: "Need a column name" };

    try {
        await connectDB();
        const board = await Board.findById(boardId);
        if (!board) return { success: false, error: "Board not found" };

        const newColumns = await Column.create({
            name: columnName,
            color: columnColor,
            boardId,
            order: board.column.length,
            jobApplications: [],
        });

        await Board.findByIdAndUpdate(boardId, {
            $push: { columns: newColumns._id }
        });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (err) {
        return { success: false, error: (err as Error).message };
    }
}
"use server";

import { getSession } from "@/lib/auth/auth";
import connectDB from "@/lib/db";
import { Column, JobApplication } from "@/lib/models";
import { revalidatePath } from "next/cache";


export type CreateJobState = {
    success: boolean;
    error?: string;
};

export async function createJobAction(prevState: CreateJobState, formData: FormData): Promise<CreateJobState> {
    const session = await getSession();
    console.log("session:", session?.user?.id);
    if (!session?.user) return {
        success: false, error: "Unathorized"
    };

    const company = formData.get("company") as string;
    const position = formData.get("position") as string;
    const columnId = formData.get("columnId") as string;
    const boardId = formData.get("boardId") as string;
    console.log("formData:", { company, position, columnId, boardId });
    const location = formData.get("location") as string;
    const salary = formData.get("salary") as string;
    const jobUrl = formData.get("jobUrl") as string;
    const tagsRaw = formData.get("tags") as string;
    const description = formData.get("description") as string;
    const notes = formData.get("notes") as string;

    if (!company || !position) return { success: false, error: "Company and Position are required" };

    try {
        await connectDB();

        const column = await Column.findById(columnId);
        if (!column) return { success: false, error: "Column not found" };

        const job = await JobApplication.create({
            company,
            position,
            location,
            salary,
            jobUrl,
            tags: tagsRaw ? tagsRaw.split(",").map((t: string) => t.trim()).filter((t) => t.length > 0) : [],
            description,
            notes,
            columnId: columnId,
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

    if (!session?.user) {
        return { error: "Unauthorized" };
    }

    const jobApplication = await JobApplication.findById(id);

    if (!jobApplication) {
        return { error: "Job Application not found" };
    }

    if (jobApplication.userId !== session.user.id) {
        return { error: "Unauthorized" };
    }

    await JobApplication.deleteOne({ _id: id });
    revalidatePath("/dashboard");

    return { success: true };
}
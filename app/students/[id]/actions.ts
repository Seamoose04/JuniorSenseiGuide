"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import pb from "@/lib/pocketbase";

export async function createTransaction(
    studentId: string,
    amount: number,
    reason: string
) {
    const cookieStore = await cookies();
    const token = cookieStore.get("pb_auth")?.value;

    if (token) {
        pb.authStore.save(token, { verified: true });
    }

    await pb.collection("point_transactions").create({
        student: studentId,
        amount,
        reason,
    });

    revalidatePath(`/students/${studentId}`);
}

"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import pb from "@/lib/pocketbase";

export async function createStudent(formData: FormData): Promise<string | null> {
	const cookieStore = await cookies();
	const token = cookieStore.get("pb_auth")?.value;

	if (!token) return "Not authenticated";

	pb.authStore.save(token, { verified: true });

	try {
		await pb.collection("students").create({
			first_name: formData.get("first_name") as string,
			last_name: formData.get("last_name") as string,
			nickname: formData.get("nickname") as string || "",
			cohort: formData.get("cohort") as string || "",
			contact: formData.get("contact") as string || "",
			enrollment_date: formData.get("enrollment_date") as string || "",
		});
		revalidatePath("/students");
		return null;
	} catch (err: unknown) {
		return err instanceof Error ? err.message : "Failed to create student";
	}
}

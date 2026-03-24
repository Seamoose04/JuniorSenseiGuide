"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import pb from "@/lib/pocketbase";

async function getAuthedPb() {
	const cookieStore = await cookies();
	const token = cookieStore.get("pb_auth")?.value;
	if (token) {
		pb.authStore.save(token, { verified: true } as any);
	}
	return pb;
}

export async function setScratchStars(
	studentId: string,
	projectNum: number,
	stars: number
) {
	const client = await getAuthedPb();

	const existing = await client.collection("scratch_progress").getFullList({
		filter: `student.id = "${studentId}" && project = ${projectNum}`,
		requestKey: null,
	});

	if (existing.length > 0) {
		await client.collection("scratch_progress").update(existing[0].id, { stars });
	} else {
		await client.collection("scratch_progress").create({
			student: studentId,
			project: projectNum,
			stars,
		});
	}

	revalidatePath(`/students/${studentId}`);
}

export async function toggleCircuitsProgress(
	studentId: string,
	projectId: string,
	progressRecordId: string | null
): Promise<string | null> {
	const client = await getAuthedPb();

	if (progressRecordId) {
		await client.collection("circuits_progress").delete(progressRecordId);
		revalidatePath(`/students/${studentId}`);
		return null;
	} else {
		const record = await client.collection("circuits_progress").create({
			student: studentId,
			project: projectId,
		});
		revalidatePath(`/students/${studentId}`);
		return record.id;
	}
}

export async function toggleRoboticsProgress(
	studentId: string,
	projectId: string,
	progressRecordId: string | null
): Promise<string | null> {
	const client = await getAuthedPb();

	if (progressRecordId) {
		await client.collection("robotics_progress").delete(progressRecordId);
		revalidatePath(`/students/${studentId}`);
		return null;
	} else {
		const record = await client.collection("robotics_progress").create({
			student: studentId,
			project: projectId,
		});
		revalidatePath(`/students/${studentId}`);
		return record.id;
	}
}

export async function toggleCodesparkProgress(
	studentId: string,
	projectId: string,
	progressRecordId: string | null
): Promise<string | null> {
	const client = await getAuthedPb();

	if (progressRecordId) {
		await client.collection("codespark_progress").delete(progressRecordId);
		revalidatePath(`/students/${studentId}`);
		return null;
	} else {
		const record = await client.collection("codespark_progress").create({
			student: studentId,
			project: projectId,
		});
		revalidatePath(`/students/${studentId}`);
		return record.id;
	}
}

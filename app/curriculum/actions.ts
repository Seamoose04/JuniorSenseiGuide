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

// Sections
export async function createSection(data: { name: string }) {
	const client = await getAuthedPb();
	await client.collection("codespark_sections").create(data);
	revalidatePath("/curriculum");
}

export async function updateSection(id: string, data: { name: string }) {
	const client = await getAuthedPb();
	await client.collection("codespark_sections").update(id, data);
	revalidatePath("/curriculum");
}

export async function deleteSection(id: string) {
	const client = await getAuthedPb();
	await client.collection("codespark_sections").delete(id);
	revalidatePath("/curriculum");
}

// Projects
export async function createProject(data: {
	name: string;
	section: string;
	order: number;
}) {
	const client = await getAuthedPb();
	await client.collection("codespark_projects").create(data);
	revalidatePath("/curriculum");
}

export async function updateProject(
	id: string,
	data: { name: string; order: number }
) {
	const client = await getAuthedPb();
	await client.collection("codespark_projects").update(id, data);
	revalidatePath("/curriculum");
}

export async function deleteProject(id: string) {
	const client = await getAuthedPb();
	await client.collection("codespark_projects").delete(id);
	revalidatePath("/curriculum");
}

// Circuits
export async function createCircuitsProject(data: { name: string; order: number }) {
	const client = await getAuthedPb();
	await client.collection("circuits_projects").create(data);
	revalidatePath("/curriculum");
}

export async function updateCircuitsProject(id: string, data: { name: string; order: number }) {
	const client = await getAuthedPb();
	await client.collection("circuits_projects").update(id, data);
	revalidatePath("/curriculum");
}

export async function deleteCircuitsProject(id: string) {
	const client = await getAuthedPb();
	await client.collection("circuits_projects").delete(id);
	revalidatePath("/curriculum");
}

// Robotics
export async function createRoboticsProject(data: { name: string; order: number }) {
	const client = await getAuthedPb();
	await client.collection("robotics_projects").create(data);
	revalidatePath("/curriculum");
}

export async function updateRoboticsProject(id: string, data: { name: string; order: number }) {
	const client = await getAuthedPb();
	await client.collection("robotics_projects").update(id, data);
	revalidatePath("/curriculum");
}

export async function deleteRoboticsProject(id: string) {
	const client = await getAuthedPb();
	await client.collection("robotics_projects").delete(id);
	revalidatePath("/curriculum");
}

"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import pb from "@/lib/pocketbase";

async function getAuthedPb() {
	const cookieStore = await cookies();
	const token = cookieStore.get("pb_auth")?.value;
	if (token) {
		pb.authStore.save(token, { verified: true });
	}
	return pb;
}

export async function createShopItem(data: {
	name: string;
	cost: number;
	description: string;
}) {
	const pb = await getAuthedPb();
	await pb.collection("shop_items").create(data);
	revalidatePath("/shop");
}

export async function updateShopItem(
	id: string,
	data: { name: string; cost: number; description: string }
) {
	const pb = await getAuthedPb();
	await pb.collection("shop_items").update(id, data);
	revalidatePath("/shop");
}

export async function deleteShopItem(id: string) {
	const pb = await getAuthedPb();
	await pb.collection("shop_items").delete(id);
	revalidatePath("/shop");
}

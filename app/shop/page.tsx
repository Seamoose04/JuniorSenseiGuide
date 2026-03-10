import { cookies } from "next/headers";
import pb from "@/lib/pocketbase";
import { ShopClient } from "./ShopClient";

export default async function ShopPage() {
	const cookieStore = await cookies();
	const token = cookieStore.get("pb_auth")?.value;

	if (token) {
		pb.authStore.save(token, { verified: true });
	}

	const shopItems = await pb.collection("shop_items").getFullList({
		sort: "cost",
		requestKey: "shop_items_list",
	});

	return <ShopClient shopItems={shopItems as any[]} />;
}

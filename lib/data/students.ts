import { cookies } from "next/headers";
import pb from "@/lib/pocketbase";

export async function getStudentsWithBalances() {
	const cookieStore = await cookies();
	const token = cookieStore.get("pb_auth")?.value;

	if (token) {
		pb.authStore.save(token, { verified: true });
	}

	const students = await pb.collection("students").getFullList({
		sort: "first_name",
		requestKey: "students-list",
	});

	const transactions = await pb.collection("point_transactions").getFullList({
		requestKey: "transactions-list",
	});

	const balanceMap: Record<string, number> = {};
	for (const tx of transactions) {
		if (!balanceMap[tx.student]) balanceMap[tx.student] = 0;
		balanceMap[tx.student] += tx.amount;
	}

	return students.map((s) => ({
		id: s.id,
		first_name: s.nickname || s.first_name,
		last_name: s.last_name,
		balance: balanceMap[s.id] ?? 0,
	}));
}

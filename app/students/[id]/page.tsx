import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import pb from "@/lib/pocketbase";
import { StudentDetailClient } from "./StudentDetailClient";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function StudentDetailPage({ params }: PageProps) {
	const {id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("pb_auth")?.value;

    if (token) {
        pb.authStore.save(token, { verified: true });
    }

    const [student, transactions, shopItems] = await Promise.all([
        pb.collection("students").getOne(id, {
            requestKey: id + "_student",
        }),
        pb.collection("point_transactions").getFullList({
            filter: `student = "${id}"`,
            sort: "-created",
            requestKey: id + "_transactions",
        }),
        pb.collection("shop_items").getFullList({
            sort: "cost",
            requestKey: id + "_shop_items",
        }),
    ]).catch(() => notFound());

    const totalPoints = (transactions as any[]).reduce(
        (sum: number, t: any) => sum + t.amount,
        0
    );

    return (
        <StudentDetailClient
            student={student as any}
            transactions={transactions as any[]}
            shopItems={shopItems as any[]}
            totalPoints={totalPoints}
        />
    );
}

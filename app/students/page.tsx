import { getStudentsWithBalances } from "@/lib/data/students";
import StudentsPageClient from "./StudentsPageClient";

export default async function StudentsPage() {
	const students = await getStudentsWithBalances();
	return <StudentsPageClient studentBalances={students} />;
}

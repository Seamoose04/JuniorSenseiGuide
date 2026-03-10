import { getStudentsWithBalances } from "@/lib/data/students";
import StudentsPageClient from "@/components/StudentsPageClient";

export default async function StudentsPage() {
	const students = await getStudentsWithBalances();
	return <StudentsPageClient students={students} />;
}

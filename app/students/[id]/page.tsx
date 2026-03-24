import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import pb from "@/lib/pocketbase";
import { getStudentScratchProgress, getStudentData, getStudentCodesparkProgress, getStudentCircuitsProgress, getStudentRoboticsProgress } from "@/lib/data/students";
import ScratchProgressCard from "@/components/students/ScratchProgressCard";
import CodesparkProgressCard from "@/components/students/CodesparkProgressCard";
import CircuitsProgressCard from "@/components/students/CircuitsProgressCard";
import RoboticsProgressCard from "@/components/students/RoboticsProgressCard";

interface Props {
	params: Promise<{ id: string }>;
}

export default async function StudentDetailPage({ params }: Props) {
	const { id } = await params;
	const student = await getStudentData(id);
	const [scratchProgress, codesparkProjects, circuitsProjects, roboticsProjects] = await Promise.all([
		getStudentScratchProgress(id),
		getStudentCodesparkProgress(id),
		getStudentCircuitsProgress(id),
		getStudentRoboticsProgress(id),
	]);
	return (
		<main className="p-6">
			<h1 className="text-2xl font-semibold">
				{student.first_name} {student.last_name}
			</h1>
			<div className="mt-6 flex gap-4">
				<ScratchProgressCard studentId={id} progress={scratchProgress} />
				<CodesparkProgressCard studentId={id} sections={codesparkProjects} />
				<CircuitsProgressCard studentId={id} projects={circuitsProjects} />
				<RoboticsProgressCard studentId={id} projects={roboticsProjects} />
			</div>
		</main>
	);
}

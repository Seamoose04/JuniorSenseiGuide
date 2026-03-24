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

export async function getStudentData(id: string) {
	const cookieStore = await cookies();
	const token = cookieStore.get("pb_auth")?.value;

	if (token) {
		pb.authStore.save(token, { verified: true });
	}

	const student = await pb.collection("students").getOne(id);
	return student;
}

export async function getStudentCodesparkProgress(id: string) {
	const cookieStore = await cookies();
	const token = cookieStore.get("pb_auth")?.value;

	if (token) {
		pb.authStore.save(token, { verified: true });
	}

	const [sections, projects, completedRecords] = await Promise.all([
		pb.collection("codespark_sections").getFullList({
			sort: "name",
			requestKey: `codespark_sections-list`,
		}),
		pb.collection("codespark_projects").getFullList({
			sort: "order",
			requestKey: `codespark_projects-list`,
		}),
		pb.collection("codespark_progress").getFullList({
			filter: `student.id = "${id}"`,
			requestKey: `codespark_progress${id}-list`,
		}),
	]);

	const progressByProject = new Map(completedRecords.map((r) => [r.project, r.id]));

	return sections.map((s) => ({
		id: s.id,
		name: s.name,
		projects: projects
			.filter((p) => p.section === s.id)
			.map((p) => ({
				id: p.id,
				name: p.name,
				order: p.order,
				completed: progressByProject.has(p.id),
				progressId: progressByProject.get(p.id) ?? null,
			})),
	}));
}

export async function getStudentCircuitsProgress(id: string) {
	const cookieStore = await cookies();
	const token = cookieStore.get("pb_auth")?.value;

	if (token) {
		pb.authStore.save(token, { verified: true });
	}

	const [projects, completedRecords] = await Promise.all([
		pb.collection("circuits_projects").getFullList({
			sort: "order",
			requestKey: `circuits_projects-list`,
		}),
		pb.collection("circuits_progress").getFullList({
			filter: `student.id = "${id}"`,
			requestKey: `circuits_progress${id}-list`,
		}),
	]);

	const progressByProject = new Map(completedRecords.map((r) => [r.project, r.id]));

	return projects.map((p) => ({
		id: p.id,
		name: p.name,
		order: p.order,
		completed: progressByProject.has(p.id),
		progressId: progressByProject.get(p.id) ?? null,
	}));
}

export async function getStudentRoboticsProgress(id: string) {
	const cookieStore = await cookies();
	const token = cookieStore.get("pb_auth")?.value;

	if (token) {
		pb.authStore.save(token, { verified: true });
	}

	const [projects, completedRecords] = await Promise.all([
		pb.collection("robotics_projects").getFullList({
			sort: "order",
			requestKey: `robotics_projects-list`,
		}),
		pb.collection("robotics_progress").getFullList({
			filter: `student.id = "${id}"`,
			requestKey: `robotics_progress${id}-list`,
		}),
	]);

	const progressByProject = new Map(completedRecords.map((r) => [r.project, r.id]));

	return projects.map((p) => ({
		id: p.id,
		name: p.name,
		order: p.order,
		completed: progressByProject.has(p.id),
		progressId: progressByProject.get(p.id) ?? null,
	}));
}

export async function getStudentScratchProgress(id: string) {
	const cookieStore = await cookies();
	const token = cookieStore.get("pb_auth")?.value;

	if (token) {
		pb.authStore.save(token, { verified: true });
	}

	const progress = await pb.collection("scratch_progress").getFullList({
		filter: `student.id = "${id}"`,
		requestKey: `student_progress${id}-list`,
	});

	return progress;
}

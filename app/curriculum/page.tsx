import { cookies } from "next/headers";
import pb from "@/lib/pocketbase";
import { CurriculumClient } from "./CurriculumClient";

export default async function CurriculumPage() {
	const cookieStore = await cookies();
	const token = cookieStore.get("pb_auth")?.value;
	if (token) {
		pb.authStore.save(token, { verified: true } as any);
	}

	const [sections, projects, circuitsProjects, roboticsProjects] = await Promise.all([
		pb.collection("codespark_sections").getFullList({
			sort: "name",
			requestKey: "codespark_sections_list",
		}),
		pb.collection("codespark_projects").getFullList({
			sort: "section,order,name",
			requestKey: "codespark_projects_list",
		}),
		pb.collection("circuits_projects").getFullList({
			sort: "order,name",
			requestKey: "circuits_projects_list",
		}),
		pb.collection("robotics_projects").getFullList({
			sort: "order,name",
			requestKey: "robotics_projects_list",
		}),
	]);

	return (
		<CurriculumClient
			sections={sections as any[]}
			projects={projects as any[]}
			circuitsProjects={circuitsProjects as any[]}
			roboticsProjects={roboticsProjects as any[]}
		/>
	);
}

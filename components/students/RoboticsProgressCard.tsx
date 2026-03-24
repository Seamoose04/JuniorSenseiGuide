"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toggleRoboticsProgress } from "@/app/students/[id]/actions";

interface RoboticsProject {
	id: string;
	name: string;
	order: number;
	completed: boolean;
	progressId: string | null;
}

interface Props {
	studentId: string;
	projects: RoboticsProject[];
}

export default function RoboticsProgressCard({ studentId, projects }: Props) {
	const [isPending, startTransition] = useTransition();

	const [optimistic, setOptimistic] = useState<Map<string, { completed: boolean; progressId: string | null }>>(
		() => new Map(
			projects.map((p) => [p.id, { completed: p.completed, progressId: p.progressId }])
		)
	);

	function handleToggle(projectId: string) {
		const current = optimistic.get(projectId) ?? { completed: false, progressId: null };
		setOptimistic((prev) =>
			new Map(prev).set(projectId, { completed: !current.completed, progressId: current.progressId })
		);
		startTransition(async () => {
			const newProgressId = await toggleRoboticsProgress(studentId, projectId, current.progressId);
			setOptimistic((prev) =>
				new Map(prev).set(projectId, { completed: !current.completed, progressId: newProgressId })
			);
		});
	}

	return (
		<Card className="w-56">
			<CardHeader className="pb-2">
				<CardTitle className="text-base">Robotics</CardTitle>
			</CardHeader>
			<CardContent className="p-0">
				<table className="w-full">
					<tbody>
						{projects
							.slice()
							.sort((a, b) => a.order - b.order)
							.map((project) => {
								const state = optimistic.get(project.id) ?? { completed: false };
								return (
									<tr key={project.id} className="border-t border-border">
										<td className="px-3 py-2">
											<button
												disabled={isPending}
												onClick={() => handleToggle(project.id)}
												className="disabled:opacity-50 hover:scale-110 transition-transform"
											>
												{state.completed ? (
													<CheckCircle2 className="w-4 h-4 text-green-500 fill-green-100" />
												) : (
													<Circle className="w-4 h-4 text-muted-foreground" />
												)}
											</button>
										</td>
										<td className="px-3 py-2 text-sm">{project.name}</td>
									</tr>
								);
							})}
					</tbody>
				</table>
			</CardContent>
		</Card>
	);
}

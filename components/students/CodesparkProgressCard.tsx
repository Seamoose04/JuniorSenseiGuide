"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toggleCodesparkProgress } from "@/app/students/[id]/actions";

interface CodesparkProject {
	id: string;
	name: string;
	order: number;
	completed: boolean;
	progressId: string | null;
}

interface CodesparkSection {
	id: string;
	name: string;
	projects: CodesparkProject[];
}

interface Props {
	studentId: string;
	sections: CodesparkSection[];
}

export default function CodesparkProgressCard({ studentId, sections }: Props) {
	const [isPending, startTransition] = useTransition();

	// Map of projectId → { completed, progressId }
	const [optimistic, setOptimistic] = useState<Map<string, { completed: boolean; progressId: string | null }>>(
		() => new Map(
			sections.flatMap((s) =>
				s.projects.map((p) => [p.id, { completed: p.completed, progressId: p.progressId }])
			)
		)
	);

	function handleToggle(projectId: string) {
		const current = optimistic.get(projectId) ?? { completed: false, progressId: null };
		setOptimistic((prev) =>
			new Map(prev).set(projectId, { completed: !current.completed, progressId: current.progressId })
		);
		startTransition(async () => {
			const newProgressId = await toggleCodesparkProgress(studentId, projectId, current.progressId);
			setOptimistic((prev) =>
				new Map(prev).set(projectId, { completed: !current.completed, progressId: newProgressId })
			);
		});
	}

	return (
		<Card className="w-56">
			<CardHeader className="pb-2">
				<CardTitle className="text-base">CodeSpark</CardTitle>
			</CardHeader>
			<CardContent className="p-0">
				<table className="w-full">
					<tbody>
						{sections.map((section) => (
							<>
								<tr key={section.id} className="border-t border-border bg-muted/40">
									<td colSpan={2} className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
										{section.name}
									</td>
								</tr>
								{section.projects.map((project) => {
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
							</>
						))}
					</tbody>
				</table>
			</CardContent>
		</Card>
	);
}

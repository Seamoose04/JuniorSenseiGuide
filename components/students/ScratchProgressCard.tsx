"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { setScratchStars } from "@/app/students/[id]/actions";
import { ScratchProgressRecord } from "@/lib/pocketbase-types";

interface Props {
	studentId: string;
	progress: ScratchProgressRecord[];
}

const TOTAL_PROJECTS = 8;

function StarRow({
	projectNum,
	stars,
	onSet,
	disabled,
}: {
	projectNum: number;
	stars: number;
	onSet: (projectNum: number, stars: number) => void;
	disabled: boolean;
}) {
	return (
		<div className="flex gap-1">
			{Array.from({ length: 3 }).map((_, i) => {
				const starValue = i + 1;
				const filled = i < stars;
				return (
					<button
						key={i}
						disabled={disabled}
						onClick={() => onSet(projectNum, stars === starValue ? starValue - 1 : starValue)}
						className="disabled:opacity-50 hover:scale-110 transition-transform"
					>
						<Star
							className={`w-5 h-5 ${
								filled ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
							}`}
						/>
					</button>
				);
			})}
		</div>
	);
}

export default function ScratchProgressCard({ studentId, progress }: Props) {
	const [isPending, startTransition] = useTransition();
	const [optimistic, setOptimistic] = useState<Map<number, number>>(
		() => new Map(progress.map((r) => [r.project, r.stars ?? 0]))
	);

	function handleSet(projectNum: number, stars: number) {
		setOptimistic((prev) => new Map(prev).set(projectNum, stars));
		startTransition(() => setScratchStars(studentId, projectNum, stars));
	}

	return (
		<Card className="w-48">
			<CardHeader className="pb-2">
				<CardTitle className="text-base">Scratch</CardTitle>
			</CardHeader>
			<CardContent className="p-0">
				<table className="w-full">
					<tbody>
						{Array.from({ length: TOTAL_PROJECTS }).map((_, i) => {
							const num = i + 1;
							const stars = optimistic.get(num) ?? 0;
							return (
								<tr key={num} className="border-t border-border">
									<td className="px-3 py-2 text-sm text-muted-foreground w-6">
										{num}
									</td>
									<td className="px-3 py-2">
										<StarRow
											projectNum={num}
											stars={stars}
											onSet={handleSet}
											disabled={isPending}
										/>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</CardContent>
		</Card>
	);
}

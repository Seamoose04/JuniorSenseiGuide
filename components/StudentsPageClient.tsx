"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import NewStudentDialog from "@/components/NewStudentDialog";

interface Student {
	id: string;
	first_name: string;
	last_name: string;
	balance: number;
}

interface Props {
	students: Student[];
}

export default function StudentsPageClient({ students }: Props) {
	const [dialogOpen, setDialogOpen] = useState(false);

	return (
		<div>
		<div className="flex items-center justify-between mb-6">
		<h1 className="text-2xl font-bold text-dark-primary">Students</h1>
		<Button onClick={() => setDialogOpen(true)}>+ Add Student</Button>
		</div>

		{students.length === 0 ? (
			<p className="text-dark-foreground-muted">No students yet. Add one to get started.</p>
		) : (
		<div className="rounded-lg border border-dark-border overflow-hidden">
		<Table>
		<TableHeader>
		<TableRow>
		<TableHead>Name</TableHead>
		<TableHead>Balance</TableHead>
		<TableHead />
		</TableRow>
		</TableHeader>
		<TableBody>
		{students.map((student) => (
			<TableRow key={student.id}>
			<TableCell className="font-medium">
			{student.first_name} {student.last_name}
			</TableCell>
			<TableCell>
			<Badge variant="outline" className="text-dark-success border-dark-success">
			{student.balance} pts
			</Badge>
			</TableCell>
			<TableCell className="text-right">
			<Button variant="ghost" size="sm" asChild>
			<Link href={`/students/${student.id}`}>View →</Link>
			</Button>
			</TableCell>
			</TableRow>
		))}
		</TableBody>
		</Table>
		</div>
		)}

		<NewStudentDialog open={dialogOpen} onOpenChange={setDialogOpen} />
		</div>
	);
}

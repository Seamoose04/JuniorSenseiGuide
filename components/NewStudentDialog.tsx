"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { createStudent } from "@/app/actions/students";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export default function NewStudentDialog({ open, onOpenChange }: Props) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);
		const formData = new FormData(e.currentTarget);
		startTransition(async () => {
			const err = await createStudent(formData);
			if (err) {
				setError(err);
			} else {
				onOpenChange(false);
				router.refresh();
			}
		});
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
		<DialogContent className="sm:max-w-md">
		<DialogHeader>
		<DialogTitle>New Student</DialogTitle>
		</DialogHeader>

		<form onSubmit={handleSubmit} className="space-y-4 mt-2">
		<div className="grid grid-cols-2 gap-3">
		<div className="space-y-1.5">
		<Label htmlFor="first_name">First Name</Label>
		<Input id="first_name" name="first_name" required />
		</div>
		<div className="space-y-1.5">
		<Label htmlFor="nickname">Nickname</Label>
		<Input id="nickname" name="nickname" placeholder="Optional" />
		</div>
		<div className="space-y-1.5">
		<Label htmlFor="last_name">Last Name</Label>
		<Input id="last_name" name="last_name" required />
		</div>
		</div>

		<div className="space-y-1.5">
		<Label htmlFor="cohort">Cohort</Label>
		<Input id="cohort" name="cohort" placeholder="e.g. Spring 2025" />
		</div>

		<div className="space-y-1.5">
		<Label htmlFor="contact">Contact</Label>
		<Input id="contact" name="contact" placeholder="Email or phone" />
		</div>

		<div className="space-y-1.5">
		<Label htmlFor="enrollment_date">Enrollment Date</Label>
		<Input id="enrollment_date" name="enrollment_date" type="date" />
		</div>

		{error && (
			<p className="text-sm text-destructive">{error}</p>
		)}

		<div className="flex gap-3 pt-1">
		<Button type="submit" disabled={isPending}>
		{isPending ? "Saving…" : "Create Student"}
		</Button>
		<Button
		type="button"
		variant="outline"
		onClick={() => onOpenChange(false)}
		disabled={isPending}
		>
		Cancel
		</Button>
		</div>
		</form>
		</DialogContent>
		</Dialog>
	);
}

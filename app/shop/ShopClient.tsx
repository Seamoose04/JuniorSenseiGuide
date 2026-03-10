"use client";

import { useState, useTransition } from "react";
import { createShopItem, updateShopItem, deleteShopItem } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ShoppingBag, Plus, Pencil, Trash2, Coins } from "lucide-react";

interface ShopItem {
	id: string;
	name: string;
	cost: number;
	description: string;
}

interface Props {
	shopItems: ShopItem[];
}

const emptyForm = { name: "", cost: "", description: "" };

export function ShopClient({ shopItems }: Props) {
	const [isPending, startTransition] = useTransition();

	// Create/edit dialog
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingItem, setEditingItem] = useState<ShopItem | null>(null);
	const [form, setForm] = useState(emptyForm);
	const [formError, setFormError] = useState("");

	// Delete dialog
	const [deleteTarget, setDeleteTarget] = useState<ShopItem | null>(null);

	function openCreate() {
		setEditingItem(null);
		setForm(emptyForm);
		setFormError("");
		setDialogOpen(true);
	}

	function openEdit(item: ShopItem) {
		setEditingItem(item);
		setForm({
			name: item.name,
			cost: String(item.cost),
			description: item.description ?? "",
		});
		setFormError("");
		setDialogOpen(true);
	}

	function handleFormChange(
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) {
		setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	}

	function handleSubmit() {
		const name = form.name.trim();
		const cost = parseInt(form.cost, 10);
		const description = form.description.trim();

		if (!name) {
			setFormError("Name is required.");
			return;
		}
		if (isNaN(cost) || cost <= 0) {
			setFormError("Cost must be a positive number.");
			return;
		}

		setFormError("");
		startTransition(async () => {
			if (editingItem) {
				await updateShopItem(editingItem.id, { name, cost, description });
			} else {
				await createShopItem({ name, cost, description });
			}
			setDialogOpen(false);
		});
	}

	function handleDelete() {
		if (!deleteTarget) return;
		startTransition(async () => {
			await deleteShopItem(deleteTarget.id);
			setDeleteTarget(null);
		});
	}

	return (
		<div className="min-h-screen bg-background">
		{/* Header */}
		<div className="border-b bg-card">
		<div className="mx-auto max-w-3xl px-6 py-6">
		<div className="flex items-center justify-between">
		<div className="flex items-center gap-3">
		<ShoppingBag className="h-6 w-6 text-muted-foreground" />
		<h1 className="text-2xl font-semibold tracking-tight">Shop</h1>
		</div>
		<Button onClick={openCreate} className="gap-2">
		<Plus className="h-4 w-4" />
		New item
		</Button>
		</div>
		</div>
		</div>

		{/* Content */}
		<div className="mx-auto max-w-3xl px-6 py-6">
		{shopItems.length === 0 ? (
			<div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-20 text-center">
			<ShoppingBag className="mb-3 h-8 w-8 text-muted-foreground/50" />
			<p className="text-sm font-medium text-muted-foreground">
			No shop items yet
			</p>
			<p className="mt-1 text-xs text-muted-foreground">
			Create one to get started.
				</p>
			<Button onClick={openCreate} variant="outline" className="mt-4 gap-2">
			<Plus className="h-4 w-4" />
			New item
			</Button>
			</div>
		) : (
		<div className="flex flex-col gap-3">
		{shopItems.map((item) => (
			<div
			key={item.id}
			className="flex items-center gap-4 rounded-lg border bg-card px-5 py-4"
			>
			<div className="flex min-w-0 flex-1 flex-col">
			<span className="truncate font-medium">{item.name}</span>
			{item.description && (
				<span className="mt-0.5 truncate text-sm text-muted-foreground">
				{item.description}
				</span>
			)}
			</div>
			<div className="flex items-center gap-2 text-sm font-medium text-amber-600">
			<Coins className="h-4 w-4" />
			<span className="tabular-nums">{item.cost} pts</span>
			</div>
			<div className="flex items-center gap-1">
			<Button
			variant="ghost"
			size="icon"
			onClick={() => openEdit(item)}
			disabled={isPending}
			>
			<Pencil className="h-4 w-4" />
			</Button>
			<Button
			variant="ghost"
			size="icon"
			onClick={() => setDeleteTarget(item)}
			disabled={isPending}
			className="text-destructive hover:bg-destructive/10 hover:text-destructive"
			>
			<Trash2 className="h-4 w-4" />
			</Button>
			</div>
			</div>
		))}
		</div>
		)}
		</div>

		{/* Create / Edit dialog */}
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
		<DialogContent className="sm:max-w-md">
		<DialogHeader>
		<DialogTitle>
		{editingItem ? "Edit item" : "New shop item"}
		</DialogTitle>
		</DialogHeader>

		<div className="flex flex-col gap-4 py-2">
		<div className="flex flex-col gap-1.5">
		<label className="text-sm font-medium">Name</label>
		<Input
		name="name"
		placeholder="e.g. Homework pass"
		value={form.name}
		onChange={handleFormChange}
		/>
		</div>
		<div className="flex flex-col gap-1.5">
		<label className="text-sm font-medium">Cost (points)</label>
		<Input
		name="cost"
		type="number"
		min={1}
		placeholder="e.g. 50"
		value={form.cost}
		onChange={handleFormChange}
		className="tabular-nums"
		/>
		</div>
		<div className="flex flex-col gap-1.5">
		<label className="text-sm font-medium">
		Description{" "}
		<span className="font-normal text-muted-foreground">
		(optional)
		</span>
		</label>
		<Textarea
		name="description"
		placeholder="Brief description of the item"
		value={form.description}
		onChange={handleFormChange}
		rows={2}
		/>
		</div>
		{formError && (
			<p className="text-xs text-destructive">{formError}</p>
		)}
		</div>

		<DialogFooter>
		<Button
		variant="outline"
		onClick={() => setDialogOpen(false)}
		disabled={isPending}
		>
		Cancel
		</Button>
		<Button onClick={handleSubmit} disabled={isPending}>
		{isPending
			? "Saving..."
			: editingItem
				? "Save changes"
				: "Create"}
				</Button>
				</DialogFooter>
				</DialogContent>
				</Dialog>

				{/* Delete confirmation */}
				<AlertDialog
				open={!!deleteTarget}
				onOpenChange={(open) => !open && setDeleteTarget(null)}
				>
				<AlertDialogContent>
				<AlertDialogHeader>
				<AlertDialogTitle>Delete "{deleteTarget?.name}"?</AlertDialogTitle>
				<AlertDialogDescription>
				This cannot be undone. Any existing transactions that reference
				this item by name will not be affected.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
				<AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
				<AlertDialogAction
				onClick={handleDelete}
				disabled={isPending}
				className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
				>
				{isPending ? "Deleting..." : "Delete"}
				</AlertDialogAction>
				</AlertDialogFooter>
				</AlertDialogContent>
				</AlertDialog>
				</div>
	);
}

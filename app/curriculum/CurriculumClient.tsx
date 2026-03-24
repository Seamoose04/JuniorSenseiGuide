"use client";

import { useState, useTransition } from "react";
import {
	createSection,
	updateSection,
	deleteSection,
	createProject,
	updateProject,
	deleteProject,
	createCircuitsProject,
	updateCircuitsProject,
	deleteCircuitsProject,
	createRoboticsProject,
	updateRoboticsProject,
	deleteRoboticsProject,
} from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { BookOpen, Plus, Pencil, Trash2, ChevronDown, ChevronRight } from "lucide-react";

interface Section {
	id: string;
	name: string;
}

interface Project {
	id: string;
	name: string;
	order: number;
	section: string;
}

interface FlatProject {
	id: string;
	name: string;
	order: number;
}

type Tab = "codespark" | "circuits" | "robotics";

interface Props {
	sections: Section[];
	projects: Project[];
	circuitsProjects: FlatProject[];
	roboticsProjects: FlatProject[];
}

export function CurriculumClient({ sections, projects, circuitsProjects, roboticsProjects }: Props) {
	const [isPending, startTransition] = useTransition();
	const [activeTab, setActiveTab] = useState<Tab>("codespark");

	// Collapsible sections
	const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
	function toggleCollapse(id: string) {
		setCollapsed((prev) => {
			const next = new Set(prev);
			next.has(id) ? next.delete(id) : next.add(id);
			return next;
		});
	}

	// Section dialog
	const [sectionDialog, setSectionDialog] = useState(false);
	const [editingSection, setEditingSection] = useState<Section | null>(null);
	const [sectionName, setSectionName] = useState("");
	const [sectionError, setSectionError] = useState("");

	function openCreateSection() {
		setEditingSection(null);
		setSectionName("");
		setSectionError("");
		setSectionDialog(true);
	}

	function openEditSection(s: Section) {
		setEditingSection(s);
		setSectionName(s.name);
		setSectionError("");
		setSectionDialog(true);
	}

	function submitSection() {
		const name = sectionName.trim();
		if (!name) { setSectionError("Name is required."); return; }
		setSectionError("");
		startTransition(async () => {
			if (editingSection) {
				await updateSection(editingSection.id, { name });
			} else {
				await createSection({ name });
			}
			setSectionDialog(false);
		});
	}

	// Delete section dialog
	const [deleteSectionTarget, setDeleteSectionTarget] = useState<Section | null>(null);

	function confirmDeleteSection() {
		if (!deleteSectionTarget) return;
		startTransition(async () => {
			await deleteSection(deleteSectionTarget.id);
			setDeleteSectionTarget(null);
		});
	}

	// CodeSpark project dialog
	const [projectDialog, setProjectDialog] = useState(false);
	const [editingProject, setEditingProject] = useState<Project | null>(null);
	const [projectSectionId, setProjectSectionId] = useState("");
	const [projectForm, setProjectForm] = useState({ name: "", order: "" });
	const [projectError, setProjectError] = useState("");

	function openCreateProject(sectionId: string) {
		setEditingProject(null);
		setProjectSectionId(sectionId);
		const sectionProjects = projects.filter((p) => p.section === sectionId);
		const nextOrder = sectionProjects.length > 0
			? Math.max(...sectionProjects.map((p) => p.order)) + 1
			: 1;
		setProjectForm({ name: "", order: String(nextOrder) });
		setProjectError("");
		setProjectDialog(true);
	}

	function openEditProject(p: Project) {
		setEditingProject(p);
		setProjectSectionId(p.section);
		setProjectForm({ name: p.name, order: String(p.order) });
		setProjectError("");
		setProjectDialog(true);
	}

	function submitProject() {
		const name = projectForm.name.trim();
		const order = parseInt(projectForm.order, 10);
		if (!name) { setProjectError("Name is required."); return; }
		if (isNaN(order) || order < 1) { setProjectError("Order must be a positive number."); return; }
		setProjectError("");
		startTransition(async () => {
			if (editingProject) {
				await updateProject(editingProject.id, { name, order });
			} else {
				await createProject({ name, section: projectSectionId, order });
			}
			setProjectDialog(false);
		});
	}

	// Delete CodeSpark project dialog
	const [deleteProjectTarget, setDeleteProjectTarget] = useState<Project | null>(null);

	function confirmDeleteProject() {
		if (!deleteProjectTarget) return;
		startTransition(async () => {
			await deleteProject(deleteProjectTarget.id);
			setDeleteProjectTarget(null);
		});
	}

	// Flat project dialog (shared for Circuits and Robotics)
	const [flatProjectDialog, setFlatProjectDialog] = useState(false);
	const [editingFlatProject, setEditingFlatProject] = useState<FlatProject | null>(null);
	const [flatProjectForm, setFlatProjectForm] = useState({ name: "", order: "" });
	const [flatProjectError, setFlatProjectError] = useState("");

	function openCreateFlatProject(existingProjects: FlatProject[]) {
		setEditingFlatProject(null);
		const nextOrder = existingProjects.length > 0
			? Math.max(...existingProjects.map((p) => p.order)) + 1
			: 1;
		setFlatProjectForm({ name: "", order: String(nextOrder) });
		setFlatProjectError("");
		setFlatProjectDialog(true);
	}

	function openEditFlatProject(p: FlatProject) {
		setEditingFlatProject(p);
		setFlatProjectForm({ name: p.name, order: String(p.order) });
		setFlatProjectError("");
		setFlatProjectDialog(true);
	}

	function submitFlatProject() {
		const name = flatProjectForm.name.trim();
		const order = parseInt(flatProjectForm.order, 10);
		if (!name) { setFlatProjectError("Name is required."); return; }
		if (isNaN(order) || order < 1) { setFlatProjectError("Order must be a positive number."); return; }
		setFlatProjectError("");
		startTransition(async () => {
			if (activeTab === "circuits") {
				if (editingFlatProject) {
					await updateCircuitsProject(editingFlatProject.id, { name, order });
				} else {
					await createCircuitsProject({ name, order });
				}
			} else {
				if (editingFlatProject) {
					await updateRoboticsProject(editingFlatProject.id, { name, order });
				} else {
					await createRoboticsProject({ name, order });
				}
			}
			setFlatProjectDialog(false);
		});
	}

	// Delete flat project dialog
	const [deleteFlatProjectTarget, setDeleteFlatProjectTarget] = useState<FlatProject | null>(null);

	function confirmDeleteFlatProject() {
		if (!deleteFlatProjectTarget) return;
		startTransition(async () => {
			if (activeTab === "circuits") {
				await deleteCircuitsProject(deleteFlatProjectTarget.id);
			} else {
				await deleteRoboticsProject(deleteFlatProjectTarget.id);
			}
			setDeleteFlatProjectTarget(null);
		});
	}

	const projectsBySection = new Map<string, Project[]>();
	for (const p of projects) {
		const list = projectsBySection.get(p.section) ?? [];
		list.push(p);
		projectsBySection.set(p.section, list);
	}

	const flatProjects = activeTab === "circuits" ? circuitsProjects : roboticsProjects;
	const sortedFlatProjects = flatProjects.slice().sort((a, b) => a.order - b.order);

	const tabs: { key: Tab; label: string }[] = [
		{ key: "codespark", label: "CodeSpark" },
		{ key: "circuits", label: "Circuits" },
		{ key: "robotics", label: "Robotics" },
	];

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<div className="border-b bg-card">
				<div className="mx-auto max-w-3xl px-6 py-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<BookOpen className="h-6 w-6 text-muted-foreground" />
							<h1 className="text-2xl font-semibold tracking-tight">Curriculum</h1>
						</div>
					</div>
					{/* Tabs */}
					<div className="mt-4 flex gap-1 border-b border-border -mb-px">
						{tabs.map((tab) => (
							<button
								key={tab.key}
								onClick={() => setActiveTab(tab.key)}
								className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
									activeTab === tab.key
										? "border-primary text-foreground"
										: "border-transparent text-muted-foreground hover:text-foreground"
								}`}
							>
								{tab.label}
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="mx-auto max-w-3xl px-6 py-6 flex flex-col gap-4">
				{activeTab === "codespark" ? (
					<>
						<div className="flex justify-end">
							<Button onClick={openCreateSection} className="gap-2">
								<Plus className="h-4 w-4" />
								New section
							</Button>
						</div>

						{sections.length === 0 ? (
							<div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-20 text-center">
								<BookOpen className="mb-3 h-8 w-8 text-muted-foreground/50" />
								<p className="text-sm font-medium text-muted-foreground">No sections yet</p>
								<p className="mt-1 text-xs text-muted-foreground">Create a section to get started.</p>
								<Button onClick={openCreateSection} variant="outline" className="mt-4 gap-2">
									<Plus className="h-4 w-4" />
									New section
								</Button>
							</div>
						) : (
							sections.map((section) => {
								const sectionProjects = (projectsBySection.get(section.id) ?? [])
									.slice()
									.sort((a, b) => a.order - b.order);
								const isCollapsed = collapsed.has(section.id);

								return (
									<div key={section.id} className="rounded-lg border bg-card">
										{/* Section header */}
										<div className="flex items-center gap-2 px-4 py-3">
											<button
												onClick={() => toggleCollapse(section.id)}
												className="flex items-center gap-2 flex-1 text-left"
											>
												{isCollapsed
													? <ChevronRight className="h-4 w-4 text-muted-foreground" />
													: <ChevronDown className="h-4 w-4 text-muted-foreground" />
												}
												<span className="font-semibold">{section.name}</span>
												<span className="text-xs text-muted-foreground ml-1">
													({sectionProjects.length} {sectionProjects.length === 1 ? "activity" : "activities"})
												</span>
											</button>
											<Button
												variant="ghost"
												size="icon"
												onClick={() => openEditSection(section)}
												disabled={isPending}
											>
												<Pencil className="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												onClick={() => setDeleteSectionTarget(section)}
												disabled={isPending}
												className="text-destructive hover:bg-destructive/10 hover:text-destructive"
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>

										{/* Projects list */}
										{!isCollapsed && (
											<div className="border-t border-border">
												{sectionProjects.map((project) => (
													<div
														key={project.id}
														className="flex items-center gap-3 border-b border-border last:border-b-0 px-4 py-2.5 pl-10"
													>
														<span className="text-xs tabular-nums text-muted-foreground w-5 text-right">
															{project.order}.
														</span>
														<span className="flex-1 text-sm">{project.name}</span>
														<Button
															variant="ghost"
															size="icon"
															onClick={() => openEditProject(project)}
															disabled={isPending}
														>
															<Pencil className="h-3.5 w-3.5" />
														</Button>
														<Button
															variant="ghost"
															size="icon"
															onClick={() => setDeleteProjectTarget(project)}
															disabled={isPending}
															className="text-destructive hover:bg-destructive/10 hover:text-destructive"
														>
															<Trash2 className="h-3.5 w-3.5" />
														</Button>
													</div>
												))}
												<div className="px-4 py-2 pl-10">
													<Button
														variant="ghost"
														size="sm"
														className="gap-1.5 text-muted-foreground h-8"
														onClick={() => openCreateProject(section.id)}
														disabled={isPending}
													>
														<Plus className="h-3.5 w-3.5" />
														Add activity
													</Button>
												</div>
											</div>
										)}
									</div>
								);
							})
						)}
					</>
				) : (
					<>
						<div className="flex justify-end">
							<Button onClick={() => openCreateFlatProject(flatProjects)} className="gap-2">
								<Plus className="h-4 w-4" />
								New activity
							</Button>
						</div>

						{sortedFlatProjects.length === 0 ? (
							<div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-20 text-center">
								<BookOpen className="mb-3 h-8 w-8 text-muted-foreground/50" />
								<p className="text-sm font-medium text-muted-foreground">No activities yet</p>
								<p className="mt-1 text-xs text-muted-foreground">Create an activity to get started.</p>
								<Button onClick={() => openCreateFlatProject(flatProjects)} variant="outline" className="mt-4 gap-2">
									<Plus className="h-4 w-4" />
									New activity
								</Button>
							</div>
						) : (
							<div className="rounded-lg border bg-card">
								{sortedFlatProjects.map((project) => (
									<div
										key={project.id}
										className="flex items-center gap-3 border-b border-border last:border-b-0 px-4 py-2.5"
									>
										<span className="text-xs tabular-nums text-muted-foreground w-5 text-right">
											{project.order}.
										</span>
										<span className="flex-1 text-sm">{project.name}</span>
										<Button
											variant="ghost"
											size="icon"
											onClick={() => openEditFlatProject(project)}
											disabled={isPending}
										>
											<Pencil className="h-3.5 w-3.5" />
										</Button>
										<Button
											variant="ghost"
											size="icon"
											onClick={() => setDeleteFlatProjectTarget(project)}
											disabled={isPending}
											className="text-destructive hover:bg-destructive/10 hover:text-destructive"
										>
											<Trash2 className="h-3.5 w-3.5" />
										</Button>
									</div>
								))}
							</div>
						)}
					</>
				)}
			</div>

			{/* Section dialog */}
			<Dialog open={sectionDialog} onOpenChange={setSectionDialog}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>{editingSection ? "Edit section" : "New section"}</DialogTitle>
					</DialogHeader>
					<div className="flex flex-col gap-1.5 py-2">
						<label className="text-sm font-medium">Name</label>
						<Input
							placeholder="e.g. Chapter 1: Basics"
							value={sectionName}
							onChange={(e) => setSectionName(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && submitSection()}
						/>
						{sectionError && <p className="text-xs text-destructive">{sectionError}</p>}
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setSectionDialog(false)} disabled={isPending}>
							Cancel
						</Button>
						<Button onClick={submitSection} disabled={isPending}>
							{isPending ? "Saving..." : editingSection ? "Save changes" : "Create"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete section dialog */}
			<AlertDialog
				open={!!deleteSectionTarget}
				onOpenChange={(open) => !open && setDeleteSectionTarget(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete "{deleteSectionTarget?.name}"?</AlertDialogTitle>
						<AlertDialogDescription>
							This will delete the section. Activities within it will not be deleted but will
							become unsectioned.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmDeleteSection}
							disabled={isPending}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							{isPending ? "Deleting..." : "Delete"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* CodeSpark project dialog */}
			<Dialog open={projectDialog} onOpenChange={setProjectDialog}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>{editingProject ? "Edit activity" : "New activity"}</DialogTitle>
					</DialogHeader>
					<div className="flex flex-col gap-4 py-2">
						<div className="flex flex-col gap-1.5">
							<label className="text-sm font-medium">Name</label>
							<Input
								placeholder="e.g. Loops and sequences"
								value={projectForm.name}
								onChange={(e) => setProjectForm((prev) => ({ ...prev, name: e.target.value }))}
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<label className="text-sm font-medium">Order</label>
							<Input
								type="number"
								min={1}
								value={projectForm.order}
								onChange={(e) => setProjectForm((prev) => ({ ...prev, order: e.target.value }))}
								className="tabular-nums"
							/>
						</div>
						{projectError && <p className="text-xs text-destructive">{projectError}</p>}
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setProjectDialog(false)} disabled={isPending}>
							Cancel
						</Button>
						<Button onClick={submitProject} disabled={isPending}>
							{isPending ? "Saving..." : editingProject ? "Save changes" : "Create"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete CodeSpark project dialog */}
			<AlertDialog
				open={!!deleteProjectTarget}
				onOpenChange={(open) => !open && setDeleteProjectTarget(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete "{deleteProjectTarget?.name}"?</AlertDialogTitle>
						<AlertDialogDescription>
							This cannot be undone. Student progress records for this activity will remain
							but will no longer link to a valid activity.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmDeleteProject}
							disabled={isPending}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							{isPending ? "Deleting..." : "Delete"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Flat project dialog (Circuits / Robotics) */}
			<Dialog open={flatProjectDialog} onOpenChange={setFlatProjectDialog}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>{editingFlatProject ? "Edit activity" : "New activity"}</DialogTitle>
					</DialogHeader>
					<div className="flex flex-col gap-4 py-2">
						<div className="flex flex-col gap-1.5">
							<label className="text-sm font-medium">Name</label>
							<Input
								placeholder="e.g. LED circuits"
								value={flatProjectForm.name}
								onChange={(e) => setFlatProjectForm((prev) => ({ ...prev, name: e.target.value }))}
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<label className="text-sm font-medium">Order</label>
							<Input
								type="number"
								min={1}
								value={flatProjectForm.order}
								onChange={(e) => setFlatProjectForm((prev) => ({ ...prev, order: e.target.value }))}
								className="tabular-nums"
							/>
						</div>
						{flatProjectError && <p className="text-xs text-destructive">{flatProjectError}</p>}
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setFlatProjectDialog(false)} disabled={isPending}>
							Cancel
						</Button>
						<Button onClick={submitFlatProject} disabled={isPending}>
							{isPending ? "Saving..." : editingFlatProject ? "Save changes" : "Create"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete flat project dialog */}
			<AlertDialog
				open={!!deleteFlatProjectTarget}
				onOpenChange={(open) => !open && setDeleteFlatProjectTarget(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete "{deleteFlatProjectTarget?.name}"?</AlertDialogTitle>
						<AlertDialogDescription>
							This cannot be undone. Student progress records for this activity will remain
							but will no longer link to a valid activity.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmDeleteFlatProject}
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

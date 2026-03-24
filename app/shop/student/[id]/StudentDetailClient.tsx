"use client";

import { useState, useTransition } from "react";
import { createTransaction } from "./actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ShoppingBag, Plus, Minus, TrendingUp, Coins } from "lucide-react";

interface Student {
    id: string;
    first_name: string;
    last_name: string;
    cohort: string;
}

interface Transaction {
    id: string;
    amount: number;
    reason: string;
    created: string;
}

interface ShopItem {
    id: string;
    name: string;
    cost: number;
    description: string;
}

interface Props {
    student: Student;
    transactions: Transaction[];
    shopItems: ShopItem[];
    totalPoints: number;
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function StudentDetailClient({
    student,
    transactions: initialTransactions,
    shopItems,
    totalPoints: initialTotal,
}: Props) {
    const [isPending, startTransition] = useTransition();
    const [sheetOpen, setSheetOpen] = useState(false);

    // Manual transaction form state
    const [manualAmount, setManualAmount] = useState("");
    const [manualReason, setManualReason] = useState("");
    const [manualError, setManualError] = useState("");

    function handleShopItemClick(item: ShopItem) {
        startTransition(async () => {
            await createTransaction(student.id, -item.cost, item.name);
        });
    }

    function handleManualSubmit() {
        const parsed = parseInt(manualAmount, 10);
        if (isNaN(parsed) || parsed === 0) {
            setManualError("Amount must be a non-zero number.");
            return;
        }
        if (!manualReason.trim()) {
            setManualError("Reason is required.");
            return;
        }
        setManualError("");
        startTransition(async () => {
            await createTransaction(student.id, parsed, manualReason.trim());
            setManualAmount("");
            setManualReason("");
        });
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-card">
                <div className="mx-auto max-w-5xl px-6 py-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight">
                                {student.first_name} {student.last_name}
                            </h1>
                            {student.cohort && (
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {student.cohort}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Points badge */}
                            <div className="flex items-center gap-2 rounded-lg border bg-background px-4 py-2">
                                <Coins className="h-4 w-4 text-amber-500" />
                                <span className="text-sm font-medium text-muted-foreground">
                                    Balance
                                </span>
                                <span
                                    className={`text-lg font-bold tabular-nums ${
                                        initialTotal < 0
                                            ? "text-destructive"
                                            : "text-foreground"
                                    }`}
                                >
                                    {initialTotal}
                                </span>
                            </div>

                            {/* Shop sheet trigger */}
                            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <ShoppingBag className="h-4 w-4" />
                                        Shop
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-80 sm:w-96">
                                    <SheetHeader>
                                        <SheetTitle className="flex items-center gap-2">
                                            <ShoppingBag className="h-5 w-5" />
                                            Shop Items
                                        </SheetTitle>
                                    </SheetHeader>

                                    <div className="mt-6 flex flex-col gap-3">
                                        {shopItems.length === 0 ? (
                                            <p className="text-sm text-muted-foreground">
                                                No shop items found.
                                            </p>
                                        ) : (
                                            shopItems.map((item) => (
                                                <button
                                                    key={item.id}
                                                    onClick={() => handleShopItemClick(item)}
                                                    disabled={isPending}
                                                    className="flex w-full items-center justify-between rounded-lg border bg-card px-4 py-3 text-left transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <div className="min-w-0">
                                                        <p className="truncate font-medium">
                                                            {item.name}
                                                        </p>
                                                        {item.description && (
                                                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                                                {item.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <Badge
                                                        variant="secondary"
                                                        className="ml-3 shrink-0 tabular-nums"
                                                    >
                                                        -{item.cost} pts
                                                    </Badge>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="mx-auto max-w-5xl px-6 py-6">
                <Tabs defaultValue="transactions">
                    <TabsList>
                        <TabsTrigger value="transactions" className="gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Transactions
                        </TabsTrigger>
                        {/* Future tabs go here */}
                    </TabsList>

                    <TabsContent value="transactions" className="mt-6 space-y-6">
                        {/* Manual transaction form */}
                        <div className="rounded-lg border bg-card p-4">
                            <p className="mb-3 text-sm font-medium">Add transaction</p>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                                <div className="flex gap-2">
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            placeholder="Amount"
                                            value={manualAmount}
                                            onChange={(e) => setManualAmount(e.target.value)}
                                            className="w-28 tabular-nums"
                                        />
                                    </div>
                                    <div className="flex gap-1">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className="h-10 w-10 shrink-0 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                                            onClick={() => {
                                                const v = Math.abs(parseInt(manualAmount) || 0);
                                                setManualAmount(String(v || ""));
                                            }}
                                            title="Make positive"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className="h-10 w-10 shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                            onClick={() => {
                                                const v = Math.abs(parseInt(manualAmount) || 0);
                                                setManualAmount(v ? String(-v) : "");
                                            }}
                                            title="Make negative"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <Input
                                    placeholder="Reason"
                                    value={manualReason}
                                    onChange={(e) => setManualReason(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleManualSubmit()}
                                    className="flex-1"
                                />
                                <Button
                                    onClick={handleManualSubmit}
                                    disabled={isPending}
                                    className="shrink-0"
                                >
                                    {isPending ? "Saving..." : "Add"}
                                </Button>
                            </div>
                            {manualError && (
                                <p className="mt-2 text-xs text-destructive">{manualError}</p>
                            )}
                        </div>

                        {/* Transactions table */}
                        {initialTransactions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
                                <TrendingUp className="mb-3 h-8 w-8 text-muted-foreground/50" />
                                <p className="text-sm font-medium text-muted-foreground">
                                    No transactions yet
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Add one above or use the Shop panel.
                                </p>
                            </div>
                        ) : (
                            <div className="rounded-lg border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Reason</TableHead>
                                            <TableHead className="text-right">Amount</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {initialTransactions.map((t) => (
                                            <TableRow key={t.id}>
                                                <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                                                    {formatDate(t.created)}
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {t.reason || (
                                                        <span className="italic text-muted-foreground">
                                                            No reason
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <span
                                                        className={`tabular-nums font-medium ${
                                                            t.amount > 0
                                                                ? "text-emerald-600"
                                                                : "text-destructive"
                                                        }`}
                                                    >
                                                        {t.amount > 0 ? "+" : ""}
                                                        {t.amount}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

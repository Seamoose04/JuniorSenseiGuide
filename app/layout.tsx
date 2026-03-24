import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Junior Sensei Guide",
	description: "Student progress tracker",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
		<body className={`${geist.variable} antialiased bg-dark-background min-h-screen text-dark-foreground`}>
		<nav className="border-b border-dark-border px-6 py-4 flex gap-6">
		<a href="/" className="font-bold text-dark-primary">Junior Sensei</a>
		<a href="/students" className="text-dark-foreground-secondary hover:text-dark-foreground">Students</a>
		<a href="/shop" className="text-dark-foreground-secondary hover:text-dark-foreground">Shop</a>
		<a href="/curriculum" className="text-dark-foreground-secondary hover:text-dark-foreground">Curriculum</a>
		</nav>
		<main className="px-6 py-8">
		{children}
		</main>
		</body>
		</html>
	);
}

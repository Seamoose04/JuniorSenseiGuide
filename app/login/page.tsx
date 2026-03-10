'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { loginAction } from '@/app/actions/auth';

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setError('');

		const result = await loginAction(email, password);

		if (result.success) {
			router.push('/students');
		} else {
			setError(result.error || 'Invalid credentials');
		}

		setLoading(false);
	}

	return (
		<div className="min-h-screen flex items-center justify-center">
			<Card className="w-full max-w-sm bg-dark-card border-dark-border">
				<CardHeader>
					<CardTitle className="text-dark-primary text-xl">Junior Sensei</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="flex flex-col gap-4">
						<div className="flex flex-col gap-1">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div className="flex flex-col gap-1">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
						{error && <p className="text-dark-error text-sm">{error}</p>}
						<Button type="submit" disabled={loading}>
							{loading ? 'Logging in...' : 'Login'}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}

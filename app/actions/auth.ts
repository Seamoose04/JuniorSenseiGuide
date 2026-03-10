'use server';

import { cookies } from 'next/headers';
import pb from '@/lib/pocketbase';

export async function loginAction(email: string, password: string) {
    try {
        await pb.collection('users').authWithPassword(email, password);
        const cookieStore = await cookies();
        cookieStore.set('pb_auth', pb.authStore.token, {
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        });
        return { success: true };
    } catch {
        return { success: false, error: 'Invalid credentials' };
    }
}

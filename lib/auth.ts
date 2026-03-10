import pb from './pocketbase';

export async function login(email: string, password: string) {
	await pb.collection('users').authWithPassword(email, password);
	return pb.authStore.isValid;
}

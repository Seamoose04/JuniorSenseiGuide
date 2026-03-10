import PocketBase from 'pocketbase';
import type { TypedPocketBase } from './pocketbase-types';

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL) as TypedPocketBase;

export default pb;

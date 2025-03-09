import { Session } from "next-auth";

export default function checkClientSessionExpiry(session: Session | null, status: 'authenticated' | 'loading' | 'unauthenticated') : boolean{
    return (session && status === 'authenticated' && session.user && session.user.expires_at && session.user.expires_at > Date.now() / 1000);
}
import spotifyProfile, { refreshAccessToken } from './SpotifyProfile';
import { Account, AuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { CreateUser } from '@/db/UserUpdate';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  image: string;
  access_token: string;
  token_type: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  scope: string;
};

const authOptions: AuthOptions = {
  providers: [spotifyProfile],
  session: {
    maxAge: 60 * 60, // 1h
  },
  callbacks: {
    async jwt({ token, account }: { token: JWT; account: Account | null }) {
      // If no account -> return existing token
      if (!account) {
        return token;
      }

      const updatedToken = {
        ...token,
        access_token: account.access_token,
        token_type: account.token_type,
        expires_at: account.expires_at ?? Math.floor(Date.now() / 1000),
        expires_in: (account.expires_at ?? 0) - Math.floor(Date.now() / 1000),
        refresh_token: account.refresh_token,
        scope: account.scope,
        id: account.providerAccountId, // Set token.id from providerAccountId
      };

      // Refresh token if needed
      if (Date.now() < updatedToken.expires_at * 1000) {
        return refreshAccessToken(updatedToken);
      }

      try {
        await CreateUser(updatedToken);
      } catch (error) {
        console.error(error);
      }

      return updatedToken;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      // Extend session.user with the id from token
      session.user.id = token.id as string;
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;

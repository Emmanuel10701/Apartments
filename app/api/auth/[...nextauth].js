import NextAuth from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '../../../libs/prisma';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import bcrypt from 'bcryptjs';

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'jsmith@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter an email and password');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.hashedPassword) {
          throw new Error('No user found');
        }

        const passwordMatch = await bcrypt.compare(credentials.password, user.hashedPassword);

        if (!passwordMatch) {
          throw new Error('Incorrect password');
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      profile: (profile) => ({
        id: profile.sub,
        name: profile.name,
        email: profile.email,
      }),
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      profile: (profile) => ({
        id: profile.id,
        name: profile.name,
        email: profile.email,
      }),
    }),
  ],
  secret: process.env.SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 2, // Session expires in 2 hours
  },
  pages: {
    signIn: '/login',
    newUser: '/register',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        if (!user.email) {
          throw new Error('Email is required for sign-in');
        }

        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              name: user.name || '',
              email: user.email,
              hashedPassword: '', // No password for OAuth users
              role: 'USER', // Default role for new users
            },
          });
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user?.email) {
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: { role: true },
        });

        if (user) {
          session.user.role = user.role; // Add role to the session
        }
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl + '/dashboard'; // Default to dashboard for all successful logins
    },
  },
  debug: true, // Enable debug logging
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

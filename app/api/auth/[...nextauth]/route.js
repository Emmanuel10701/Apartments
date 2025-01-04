import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../../libs/prisma"; // Adjust the import according to your project structure
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Define the NextAuth configuration options
export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Credentials provider for email and password authentication
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Ensure both email and password are provided
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter an email and password");
        }

        // Check if the user exists in the database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // If no user or missing password, throw error
        if (!user || !user.hashedPassword) {
          throw new Error("No user found");
        }

        // Compare the provided password with the stored hashed password
        const passwordMatch = await bcrypt.compare(credentials.password, user.hashedPassword);
        if (!passwordMatch) {
          throw new Error("Incorrect password");
        }

        // If authentication is successful, return the user details
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      },
    }),
  ],
  secret: process.env.SECRET,  // Ensure you set a SECRET for JWT
  session: {
    strategy: "jwt",  // Using JWT strategy for session
    maxAge: 60 * 60 * 2,  // Session expires in 2 hours
  },
  pages: {
    signIn: "/login",   // Custom login page URL
    newUser: "/register", // Custom registration page URL
    error: "/auth/error", // Custom error page URL
  },
  callbacks: {
    // Custom session management
    async session({ session, token }) {
      if (session.user?.email) {
        try {
          // Add role and id to the session object
          const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { role: true },
          });

          if (user) {
            session.user.role = user.role;  // Add role to session
            session.user.id = token.id;    // Add id to session
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
      return session;
    },

    // Custom redirect after sign-in
    async redirect({ url, baseUrl }) {
      return baseUrl + "/dashboard";  // Default redirect to dashboard
    },
  },
  debug: true,  // Enable debugging in development
};

// NextAuth handler for both GET and POST requests
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "../../../../lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user) return null;
        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;
        return {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.userType,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const newToken = {
          ...token,
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          role: (user as any).role,
        } as any;
        try {
          newToken.jwtToken = Buffer.from(JSON.stringify({
            id: newToken.id,
            email: newToken.email,
            username: newToken.username,
            role: newToken.role,
          })).toString('base64');
        } catch (e) {
          newToken.jwtToken = '';
        }
        return newToken;
      }

      // Ensure we keep a stringified token (useful for other server-side flows)
      if (!(token as any).jwtToken) {
        try {
          (token as any).jwtToken = Buffer.from(JSON.stringify(token)).toString('base64');
        } catch (e) {
          (token as any).jwtToken = '';
        }
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...(session.user as any),
          id: (token as any).id,
          email: (token as any).email ?? (session.user as any).email,
          username: (token as any).username,
          role: (token as any).role,
          jwtToken: (token as any).jwtToken ?? '',
        },
      };
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt" as const
  },
  pages: {
    signIn: "/"
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
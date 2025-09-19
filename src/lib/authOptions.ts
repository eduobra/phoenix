import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import mysql from "mysql2/promise";
import { JWT } from "next-auth/jwt";
import { Session, User } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid profile email",
          prompt: "select_account",
        },
      },
    }),
  ],

  
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user }: { user: User }): Promise<boolean> {
      try {
        const db = await mysql.createConnection({
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT) || 3306,
          user: process.env.DB_USER,
          password: process.env.DB_PASS,
          database: process.env.DB_NAME,
        });

        await db.execute(
          `INSERT IGNORE INTO users (email, full_name) VALUES (?, ?)`,
          [user.email, user.name || null]
        );

        await db.end();
        return true;
      } catch (err) {
        console.error("MySQL insert error:", err);
        return true;
      }
    },

    async jwt({ token, user }: { token: JWT; user?: User }): Promise<JWT> {
      if (user) token.user = user;
      return token;
    },

    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session> {
      session.user = token.user as Session["user"];
      return session;
    },
  },

  pages: {
    error: "/auth/error",
  },
};

import { mergeAnonCartToUserCart } from "@/lib/db/cart";
import { prisma } from "@/lib/db/prisma";
import { env } from "@/lib/env";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma as PrismaClient), //as Adapter
	providers: [
		GoogleProvider({
			clientId: env.GOOGLE_CLIENT_ID, //zod validated
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		}),
	],
	callbacks: {
		session({ session, user }) {
			session.user.id = user.id;
			return session;
		},
	},
	events: {
		async signIn({ user }) {
			await mergeAnonCartToUserCart(user.id);
		},
	},
};

const handler = NextAuth(authOptions);

// The code below is necessary because right now, next auth is configured to use the old 'pages' directory in nextjs, not the 'app' directory we are using now
export { handler as GET, handler as POST };

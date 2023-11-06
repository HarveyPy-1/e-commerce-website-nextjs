// This code just prevents a new prisma client from creating everytime we save a project and the server restarts. It sets up a new prisma client and makes it global. Only if it doesn't exist on global, does a new one get created.
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

// We created a prisma extension to add new functionality that will happen everytime we use prisma. In this case, whenever we use the prisma 'update' function, we are adding the 'updatedAt' parameter to the current time/date. We needed to do this because, native mongodb doesn't update the 'updatedat' automatically when you update something. It might be fixed later. The reason we have to update the updatedAt, is because we want to know which carts haven't been updated in a while and delete them {cron job}. So we don't have so many abandoned carts clogging up the database. Without extension, the immediate line below is enough to initialize prisma. just change the name back to prisma, instead of prismabase.

const prismaBase = globalForPrisma.prisma ?? new PrismaClient();
export const prisma = prismaBase.$extends({
	query: {
		cart: {
			async update({ args, query }) {
				args.data = { ...args.data, updatedAt: new Date() };
				return query(args);
			},
		},
	},
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prismaBase;

"use server";

import { createCart, getCart } from "@/lib/db/cart";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

// We are doing server actions that belong to this route, since you can't use server actions in client sides and /product/id's page is client side

export async function incrementProductQuantity(productId: string) {
	const cart = (await getCart()) ?? (await createCart());

	const itemInCart = cart.items.find((item) => item.productId === productId);

	if (itemInCart) {
		await prisma.cart.update({
			where: { id: cart.id },
			data: {
				items: {
					update: {
						where: {
							id: itemInCart.id,
						},
						data: { quantity: { increment: 1 } },
					},
				},
			},
		});
	} else {
		await prisma.cart.update({
			where: {
				id: cart.id,
			},
			data: {
				items: {
					create: {
						productId,
						quantity: 1,
					},
				},
			},
		});
	}

	revalidatePath("/products/[id]");
}

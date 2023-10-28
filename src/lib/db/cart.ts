import { Cart, Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { cookies } from "next/dist/client/components/headers";

export type CartWithProducts = Prisma.CartGetPayload<{
	include: { items: { include: { product: true } } };
}>;

export type ShoppingCart = CartWithProducts & {
	size: number;
	subtotal: number;
};

export async function createCart(): Promise<ShoppingCart> {
	const newCart = await prisma.cart.create({
		data: {},
	});

	// We need to allow adding to cart if not signed in, also, we need to find the cart and continue from where we stopped when the user signs in. Hence the cookies. Don't forget to encrypt cookies in production.
	cookies().set("localCartId", newCart.id);

	return {
		...newCart,
		items: [],
		size: 0,
		subtotal: 0,
	};
}

export async function getCart(): Promise<ShoppingCart | null> {
	const localCartId = cookies().get("localCartId")?.value;
	const cart = localCartId
		? await prisma.cart.findUnique({
				where: { id: localCartId }, // First you get the cartID
				include: { items: { include: { product: true } } }, //Next, you include the cart items that correspond with the id from the cartItem db, then go another level deep and add include the products details from the product db.
		  })
		: null;

	if (!cart) {
		return null;
	}

	return {
		...cart,
		size: cart.items.reduce((sum, item) => sum + item.quantity, 0),
		subtotal: cart.items.reduce(
			(total, item) => total + item.quantity * item.product.price,
			0
		),
	};
}

import { Cart, CartItem, Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { cookies } from "next/dist/client/components/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export type CartWithProducts = Prisma.CartGetPayload<{
	include: { items: { include: { product: true } } };
}>;

export type CartItemWithProduct = Prisma.CartItemGetPayload<{
	include: { product: true };
}>;

export type ShoppingCart = CartWithProducts & {
	size: number;
	subtotal: number;
};

export async function createCart(): Promise<ShoppingCart> {
	const session = await getServerSession(authOptions);

	let newCart: Cart;

	if (session) {
		newCart = await prisma.cart.create({
			data: { userId: session.user.id },
		});
	} else {
		newCart = await prisma.cart.create({
			data: {},
		});

		// We need to allow adding to cart if not signed in, also, we need to find the cart and continue from where we stopped when the user signs in. Hence the cookies. Don't forget to encrypt cookies in production.
		cookies().set("localCartId", newCart.id);
	}

	return {
		...newCart,
		items: [],
		size: 0,
		subtotal: 0,
	};
}

export async function getCart(): Promise<ShoppingCart | null> {
	const session = await getServerSession(authOptions);

	let cart: CartWithProducts | null = null;

	if (session) {
		cart = await prisma.cart.findFirst({
			where: { userId: session.user.id },
			include: { items: { include: { product: true } } },
		});
	} else {
		const localCartId = cookies().get("localCartId")?.value;
		cart = localCartId
			? await prisma.cart.findUnique({
					where: { id: localCartId }, // First you get the cartID from local storage
					include: { items: { include: { product: true } } }, //Next, you include the cart items that correspond with the id from the cartItem db, then go another level deep and add include the products details from the product db.
			  })
			: null;
	}

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

//Merge offline cart to logged in cart
export async function mergeAnonCartToUserCart(userId: string) {

	//Get the id of the offline cart
	const localCartId = cookies().get("localCartId")?.value;

	// Find the corresponding cart in the db with same id
	const localCart = localCartId
		? await prisma.cart.findUnique({
				where: { id: localCartId }, // First you get the cartID from local storage
				include: { items: true },
		  })
		: null;

	// If there isn't any, return;
	if (!localCart) return;

	// Check the db if there's any cart associated with the logged in user
	const userCart = await prisma.cart.findFirst({
		where: { userId },
		include: { items: true },
	});

	//We are trying to delete the user cart and merge the anon and the existing user cart together. When doing multiple db operations like this, it's disastrous if one fails along the way. So we use something called db transactions. In db transactions, when something along the line of commands fail, it rolls back to how things were before and nothing is saved or persisted.

	// tx is just a prisma client, and anything done inside the anonymous function of tx, will be part of the transaction.

	await prisma.$transaction(async (tx) => {
		// If a user cart exists, merge the local and new together
		if (userCart) {
			const mergedCartItems = mergeCartItems(localCart.items, userCart.items);

			// Delete multiple entries??? if it exists in both local and user cart????
			await tx.cartItem.deleteMany({
				where: { cartId: userCart.id },
			});

			// Finally, map the contents of the merged cart to the user cart
			await tx.cartItem.createMany({
				data: mergedCartItems.map((item) => ({
					cartId: userCart.id,
					productId: item.productId,
					quantity: item.quantity,
				})),
			});
		} else {

			// Else, if no user cart, create one from the offline cart
			await tx.cart.create({
				data: {
					userId,
					items: {
						createMany: {
							data: localCart.items.map((item) => ({
								productId: item.productId,
								quantity: item.quantity,
							})),
						},
					},
				},
			});
		}

		// Finally, delete the local cart item
		await tx.cart.delete({
			where: { id: localCart.id },
		});

		cookies().set("localCartId", "");
	});
}

function mergeCartItems(...cartItems: CartItem[][]) {
	return cartItems.reduce((acc, items) => {
		items.forEach((item) => {
			const existingItem = acc.find((i) => i.productId === item.productId);

			if (existingItem) {
				existingItem.quantity += item.quantity;
			} else {
				acc.push(item);
			}
		});
		return acc;
	}, [] as CartItem[]);
}

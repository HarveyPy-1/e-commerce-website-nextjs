import { getCart } from "@/lib/db/cart";
import CartEntry from "./CartEntry";
import { updateProductQuantity } from "./actions";
import { formatPrice } from "@/lib/db/formatPrice";
import Link from "next/link";

export const metadata = {
	title: "Your Cart | FlowMazon",
};

const CartPage = async () => {
	const cart = await getCart();

	return (
		<div>
			<h1 className="mb-6 text-3xl font-bold">Shopping Cart</h1>
			{cart?.items.map((cartItem) => (
				<CartEntry
					cartItem={cartItem}
					key={cartItem.id}
					updateProductQuantity={updateProductQuantity}
				/>
			))}
			{!cart?.items.length && <p>Your cart is empty!</p>}
			<div className="flex flex-col items-end">
				<p className="mb-3 font-bold md:text-2xl">
					Total: {formatPrice(cart?.subtotal || 0)}
				</p>
				{!cart?.items.length ? (
					<Link href="/" className="w-full mb-20">
						<button className="btn btn-primary w-full">Continue Shopping</button>
					</Link>
				) : (
					<button className="btn btn-primary w-full mb-20">Checkout</button>
				)}
			</div>
		</div>
	);
};
export default CartPage;

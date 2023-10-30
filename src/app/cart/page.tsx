import { getCart } from "@/lib/db/cart";
import CartEntry from "./CartEntry";
import { updateProductQuantity } from "./actions";
import { formatPrice } from "@/lib/db/formatPrice";

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
				<p className="mb-3 font-bold text-2xl:lg">Total: {formatPrice(cart?.subtotal || 0)}</p>
				{!cart?.items.length ? <div /> :
					<button className="btn btn-primary w-full">Checkout</button>
				}
			</div>
		</div>
	);
};
export default CartPage;

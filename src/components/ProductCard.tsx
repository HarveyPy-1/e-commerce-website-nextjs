import { Product } from "@prisma/client";
import Link from "next/link";
import PriceTag from "./PriceTag";
import Image from "next/image";

interface ProductCardProps {
	product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
	const isNew =
		Date.now() - new Date(product.createdAt).getTime() < 1000 * 60 * 60 * 24 * 7;

	return (
		<Link
			href={`/products/${product.id}`}
			className="card w-full bg-base-100 hover:shadow-xl transition-shadow">
			<figure>
				<Image
					src={product.imageUrl}
					alt={product.name}
					width={800}
					height={400}
					className="object-cover h-80"
				/>
			</figure>
			<div className="card-body">
				<h2 className="card-title">
					{product.name} {isNew && <div className="badge badge-secondary">NEW</div>}
				</h2>

				<p>{product.description}</p>
				<PriceTag price={product.price} />
			</div>
		</Link>
	);
};
export default ProductCard;

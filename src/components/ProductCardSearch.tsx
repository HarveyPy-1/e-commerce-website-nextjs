import { Product } from "@prisma/client";
import Link from "next/link";
import PriceTag from "./PriceTag";
import Image from "next/image";
import Highlighter from "react-highlight-words";

interface ProductCardSearchProps {
	product: Product;
	query: string;
}

const ProductCardSearch = ({ product, query }: ProductCardSearchProps) => {
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
					<Highlighter
						searchWords={[query]}
						autoEscape={true}
						textToHighlight={product.name}
					/>
				</h2>

				<p>
					<Highlighter
						searchWords={[query]}
						autoEscape={true}
						textToHighlight={product.description}
					/>
				</p>
				<PriceTag price={product.price} />
			</div>
		</Link>
	);
};
export default ProductCardSearch;

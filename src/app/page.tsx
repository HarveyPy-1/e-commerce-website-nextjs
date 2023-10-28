import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/db/prisma";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  // Code to get all products from the database and order them by 'id' in descending order
	const products = await prisma.product.findMany({
		orderBy: { id: "desc" },
	});

	return (
		<div>
			<p className="text-2xl mb-2">Recently Added </p>
			<div className="hero rounded-xl bg-base-200">
				<div className="hero-content flex-col lg:flex-row">
					<Image
						src={products[0].imageUrl}
						alt={products[0].name}
						width={400}
						height={800}
						className="w-full max-w-sm rounded-lg shadow-2xl"
						priority
					/>
					<div>
						<h1 className="text-5xl font-bold">{products[0].name}</h1>
						<p className="py-6">{products[0].description}</p>
						<Link href={`/products/${products[0].id}`} className="btn btn-primary">
							Check it out
						</Link>
					</div>
				</div>
			</div>
			<p className="text-2xl mb-1 mt-2">{"All Products >"}</p>
			<div className="my-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
				{products.slice(1).map((product) => (
					<ProductCard product={product} key={product.id} />
				))}
			</div>
		</div>
	);
}

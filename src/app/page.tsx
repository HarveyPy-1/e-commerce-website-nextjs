import PaginationBar from "@/components/PaginationBar";
import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/db/prisma";
import Image from "next/image";
import Link from "next/link";

interface HomeProps {
	searchParams: { page: string }; // Must be called searchParams to get it from the url
}

export default async function Home({
	searchParams: { page = "1" },
}: HomeProps) {
	// Code for pagination
	const currentPage = parseInt(page);
	const pageSize = 6;
	const heroItemCount = 1;

	const totalItemCount = await prisma.product.count();
	// Round up to nearest whole number if decimal
	const totalPages = Math.ceil((totalItemCount - heroItemCount) / pageSize);

	// Code to get all products from the database and order them by 'id' in descending order to display on the homepage
	const products = await prisma.product.findMany({
		orderBy: { id: "desc" },
		skip: (currentPage - 1) * pageSize + (currentPage === 1 ? 0 : heroItemCount),
		take: pageSize + (currentPage === 1 ? heroItemCount : 0),
	});

	return (
		<div className="flex flex-col items-center">
			{currentPage === 1 && (
				<>
					<div className="flex justify-items-start w-full">
						<p className="text-2xl mb-2 font-bold">Recently Added </p>
					</div>
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
					<div className="flex w-full justify-items-start">
						<p className="text-2xl mb-1 mt-2 font-bold">{"All Products"}</p>
					</div>
				</>
			)}
			<div className="my-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
				{(currentPage === 1 ? products.slice(1) : products).map((product) => (
					<ProductCard product={product} key={product.id} />
				))}
			</div>
			{totalPages > 1 && (
				<PaginationBar currentPage={currentPage} totalPages={totalPages} />
			)}
		</div>
	);
}

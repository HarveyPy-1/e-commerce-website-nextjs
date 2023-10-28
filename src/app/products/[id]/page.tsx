import { prisma } from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import PriceTag from "@/components/PriceTag";
import { Metadata } from "next/types";
import { cache } from "react";

interface ProductPageProps {
	params: {
		id: string;
	};
}

//Cache data from database, so you can use it multiple times without calling the db every time. This is native from react
const getProduct = cache(async (id: string) => {
	const product = await prisma.product.findUnique({ where: { id } });
	if (!product) notFound();
	return product;
});

//page metadata. Function generateMetadata has to be spelt exactly. Not MetaData. Pheew!
export async function generateMetadata({
	params: { id },
}: ProductPageProps): Promise<Metadata> {
	const product = await getProduct(id);
	return {
		title: product.name + " | FlowMazon",
		description: product.description,
		//OpenGraph is used to customize how your link (image, description) looks when you share it on social media
		openGraph: {
			images: [{ url: product.imageUrl }],
		},
	};
}

export default async function ProductPage({
	params: { id },
}: ProductPageProps) {
	const product = await getProduct(id);

	return (
		<div className="flex flex-col lg:flex-row gap-4 lg:items-center">
			<Image
				src={product.imageUrl}
				alt={product.name}
				width={500}
				height={500}
				className="rounded-lg"
				priority
			/>
			<div>
				<h1 className="text-5xl font-bold">{product.name}</h1>
				<PriceTag price={product.price} className="mt-4" />
				<p className="py-6">{product.description}</p>
			</div>
		</div>
	);
}

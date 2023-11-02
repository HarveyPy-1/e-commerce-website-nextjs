import FormSubmitButton from "@/components/FormSubmitButton";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export const metadata = {
	title: "Add Product - FlowMazon",
};

// This code never gets to the client, this is the same as setting up an API route separate from our client code. This code is executed in the server only.
async function addProduct(formData: FormData) {
	"use server";

	//Protect button with login
	const session = await getServerSession(authOptions);

	if (!session) {
		redirect("api/auth/signin?callbackUrl=/add-product");
	}

	const name = formData.get("name")?.toString();
	const description = formData.get("description")?.toString();
	const imageUrl = formData.get("ImageUrl")?.toString();
	const price = Number(formData.get("price") || 0);

	if (!name || !description || !imageUrl || !price) {
		throw Error("Missing required fields!");
	}

	await prisma.product.create({
		data: { name, description, imageUrl, price },
	});

	redirect("/");
}

export default async function AddProductPage() {
	//Protect route with login
	const session = await getServerSession(authOptions);

	if (!session) {
		redirect("api/auth/signin?callbackUrl=/add-product");
	}

	return (
		<div>
			<h1 className="text-lg mb-3 font-bold">Add Product</h1>
			<form action={addProduct}>
				<input
					required
					type="text"
					className="mb-3 w-full input input-bordered"
					name="name"
					placeholder="Name"
				/>
				<textarea
					name="description"
					placeholder="Description"
					className="textarea textarea-bordered mb-3 w-full"
				/>
				<input
					required
					type="url"
					className="mb-3 w-full input input-bordered"
					name="ImageUrl"
					placeholder="Image URL"
				/>
				<input
					required
					type="number"
					className="mb-3 w-full input input-bordered"
					name="price"
					placeholder="Price"
				/>
				<FormSubmitButton className="btn-block mb-32">Add Product</FormSubmitButton>
			</form>
		</div>
	);
}

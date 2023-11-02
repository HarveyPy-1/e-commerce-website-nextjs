"use client";

import { Session } from "next-auth";
import Image from "next/image";
import profilePicPlaceholder from "@/assets/profile-pic-placeholder.png";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";

interface UserMenuButtonProps {
	session: Session | null;
}

const UserMenuButton = ({ session }: UserMenuButtonProps) => {
	// We can use the 'useSession' hook from next-auth instead of Session above. But that's for only client side. For server side, we do it the way we are doing it now. Because this button is a server component so user is logged in immediately not waiting. Ignore the "use client above", when it's wrapped in NavBar.tsx, navbar is a server component. We just need client here to get the onclick functionality, which is javascript.
	const user = session?.user;
	return (
		<div className="dropdown dropdown-end">
			<label tabIndex={0} className="btn btn-ghost btn-circle">
				{/* He keeps saying the className determines the size of the image, not the width and height */}
				{user ? (
					<Image
						src={user?.image || profilePicPlaceholder}
						alt="profile-picture"
						width={40}
						height={40}
						className="w-10 rounded-full"
					/>
				) : (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24">
						<path
							fill="currentColor"
							d="M12 21v-2h7V5h-7V3h7q.825 0 1.413.588T21 5v14q0 .825-.588 1.413T19 21h-7Zm-2-4l-1.375-1.45l2.55-2.55H3v-2h8.175l-2.55-2.55L10 7l5 5l-5 5Z"
						/>
					</svg>
				)}
			</label>
			<ul
				tabIndex={0}
				className="dropdown-content menu rounded-box menu-sm z-30 mt-3 w-52 bg-base-100 p-2 shadow">
				<li>
					{user ? (
						<>
							<button onClick={() => signOut({ callbackUrl: "/" })}>Sign Out</button>{" "}
							<Link href={"/add-product"}>
								<button>Add Product</button>
							</Link>
						</>
					) : (
						<button onClick={() => signIn()}>Sign In</button>
					)}
				</li>
			</ul>
		</div>
	);
};
export default UserMenuButton;

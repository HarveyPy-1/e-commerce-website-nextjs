import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import SessionProvider from "./SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "MarketHub",
	description: "Whatever you want, we've got it!",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<SessionProvider>
					{/*Because we are fetching all our data server side, we don't need this session provider wrap. But it's still good to put it incase a client side needs it */}
					<Navbar />
					<main className="p-4 max-w-7xl m-auto min-w-[300px]">{children}</main>
					<Footer />
				</SessionProvider>
			</body>
		</html>
	);
}

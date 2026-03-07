import { Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Home, Menu, ArrowLeftIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { logoutServerFn } from "@/server/authServerFns";
import { accessTokenStore } from "@/store/accessTokenStore";
import { useUserQuery } from "@/hooks/queries/userQueries";
import { Spinner } from "@/components/elements/Spinner";

const navConfig = {
	items: [{ to: "/home", label: "Home", icon: Home }],
	itemBaseClass:
		"flex items-center gap-3 p-3 mb-2 font-medium rounded-lg transition-colors"
};

export default function Header() {
	const router = useRouter();

	const { isPending: uQuPending, data: uQuData } = useUserQuery();

	const [isOpen, setIsOpen] = useState(false);

	const toggleMenu = () => setIsOpen((prev) => !prev);

	const logoutMutation = useMutation({
		mutationFn: logoutServerFn,
		onSuccess: async (ctx) => {
			// Clear access token regardless of server response
			accessTokenStore.clearAccessToken();

			if (!ctx.success) {
				// Just log error to not block user in their account
				console.log("error when logging out: ", ctx.message);
			}

			router.navigate({ to: "/login" });
		},
		onError: (error) => {
			console.log(error.message);
		}
	});

	function handleLogout() {
		toggleMenu();
		logoutMutation.mutate(undefined);
	}

	const user = uQuData?.data?.user;

	return (
		<>
			{/* Main Header */}
			<header className="p-4 flex items-center bg-burnt text-white shadow-lg">
				<button
					onClick={toggleMenu}
					className="p-2 hover:bg-metal rounded-lg transition-colors"
					aria-label="Open menu"
				>
					<Menu size={24} />
				</button>
				<h1 className="ml-4 text-xl font-semibold">
					<Link to="/">Fitnessway - Food Review</Link>
				</h1>
			</header>

			{/* Side Menu */}
			<aside
				className={`fixed top-0 left-0 h-full w-80 bg-burnt text-white shadow-2xl z-50 
                            transform transition-transform duration-300 ease-in-out flex flex-col 
                            ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
			>
				{/* Side Menu - Title */}
				<div className="flex items-center justify-between p-4 border-b border-b-metal">
					<h2 className="text-xl font-bold">Quick Links</h2>
					<button
						onClick={toggleMenu}
						className="p-2 hover:bg-metal rounded-lg transition-colors"
						aria-label="Close menu"
					>
						<ArrowLeftIcon size={24} />
					</button>
				</div>

				{/* Side Menu - Navigation && User Name */}
				<div className="p-4 h-full flex flex-col">
					<div className="grow">
						{/* Side Menu - User query loading indicator */}
						{uQuPending && (
							<div className="flex justify-center">
								<Spinner size={28} />
							</div>
						)}

						{user && (
							<div className="h-full flex flex-col">
								{/* Side Menu - Navigation */}
								<nav className="grow">
									{navConfig.items.map((item) => {
										const Icon = item.icon;

										return (
											<Link
												key={item.to}
												to={item.to}
												onClick={toggleMenu}
												className={`${navConfig.itemBaseClass} hover:bg-metal`}
												activeProps={{
													className: `${navConfig.itemBaseClass} bg-dry-green hover:bg-wet-green`
												}}
											>
												<Icon size={20} />
												{item.label}
											</Link>
										);
									})}
								</nav>

								{/* Side Menu - User Name */}
								<p className="text-white opacity-60 font-medium mx-auto">
									{user.name}
								</p>
							</div>
						)}
					</div>

					{/* Logout Button */}
					<button
						onClick={handleLogout}
						className={`${navConfig.itemBaseClass} justify-center  bg-red-600  hover:bg-red-500 w-full 
                                    mt-4 hover:cursor-pointer`}
					>
						Log out
					</button>
				</div>
			</aside>
		</>
	);
}

import { Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Home, Menu, ArrowLeftIcon, ClipboardList } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { logoutServerFn } from "@/api/auth/authApi";
import { accessTokenStore } from "@/store/accessTokenStore";

export default function Header() {
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen((prev) => !prev);

    const logoutMutation = useMutation({
        mutationFn: logoutServerFn,
        onSuccess: async (ctx) => {
            if (!ctx.success) {
                // Just log error to not block user in their account
                console.log(`error when logging out: ${ctx.message}`);
            }

            // Clear access token regardless of server response
            accessTokenStore.clearAccessToken();

            router.navigate({ to: "/login" });
        },
        onError: (error) => {
            console.log(error.message);
        }
    });

    const handleLogout = () => {
        toggleMenu();
        logoutMutation.mutate(undefined);
    };

    return (
        <>
            {/* Main Header */}
            <header className="p-4 flex items-center bg-zinc-800 text-white shadow-lg">
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
                className={`fixed top-0 left-0 h-full w-80 bg-zinc-800 text-white shadow-2xl z-50 
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

                <div className="p-4 h-full flex flex-col">
                    {/* Side menu - Links */}
                    <nav className="grow">
                        {navConfig.items.map((item) => {
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    onClick={toggleMenu}
                                    className={`${navConfig.baseClass} hover:bg-metal`}
                                    activeProps={{
                                        className: `${navConfig.baseClass} bg-emerald hover:bg-sibling-emerald`
                                    }}
                                >
                                    <Icon size={20} />
                                    <span className="font-medium">
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>

                    <button
                        onClick={handleLogout}
                        className={`${navConfig.baseClass} justify-center  bg-red-600  hover:bg-red-500 w-full`}
                    >
                        Log out
                    </button>
                </div>
            </aside>
        </>
    );
}

const navConfig = {
    items: [
        { to: "/home", label: "Home", icon: Home },
        { to: "/pending", label: "Pending", icon: ClipboardList }
    ],
    baseClass: "flex items-center gap-3 p-3 mb-2 rounded-lg transition-colors"
};

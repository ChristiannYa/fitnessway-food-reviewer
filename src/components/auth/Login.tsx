import type { LoginReq } from "@/schemas/authSchema";
import React from "react";
import { useLoginMutation } from "@/hooks/mutations/authMutations";

export function Login() {
	const loginMutation = useLoginMutation();

	const handleLogin = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.target as HTMLFormElement);

		const loginData: LoginReq = {
			email: formData.get("email") as string,
			password: formData.get("password") as string,
			deviceName: "HP Envy x360 (Web)"
		};

		loginMutation.mutate({ loginData: loginData });
	};

	return (
		<div className="fixed inset-0 bg-charcoal flex items-start justify-center p-8">
			<div className="border border-smoke bg-charcoal p-8 rounded-lg shadow-lg">
				<h1 className="text-2xl font-bold mb-4">Login</h1>
				<form onSubmit={(e) => handleLogin(e)} className="space-y-4">
					<div>
						<label htmlFor="email" className="block text-xs">
							Email
						</label>
						<input
							type="email"
							name="email"
							id="email"
							className="px-2 py-1 w-full rounded-sm bg-zinc-600"
						/>
					</div>
					<div>
						<label htmlFor="password" className="block text-xs">
							Password
						</label>
						<input
							type="password"
							name="password"
							id="password"
							className="px-2 py-1 w-full rounded-sm bg-zinc-600"
						/>
					</div>
					<button
						type="submit"
						className="w-full bg-dry-green  text-white rounded-sm py-2 font-black
                                    transition-colors hover:cursor-pointer hover:bg-wet-green"
						disabled={loginMutation.status === "pending"}
					>
						{loginMutation.status === "pending" ? "..." : "LOGIN"}
					</button>
				</form>
				{loginMutation.isError && (
					<p className="text-red-500 text-center text-sm mt-2">
						Error logging in
					</p>
				)}
				{loginMutation.data?.status === 401 && (
					<p className="text-mist text-center text-sm mt-2">
						Invalid email or password
					</p>
				)}
			</div>
		</div>
	);
}

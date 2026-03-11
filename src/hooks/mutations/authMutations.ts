import { login, logout } from "@/auth/authHandlers";
import { useAccessTokenStore } from "@/store/accessTokenStore";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";

export const useLoginMutation = () => {
	const router = useRouter();

	return useMutation({
		mutationFn: login,
		onSuccess: async (ctx) => {
			if (!ctx.success) {
				console.log("error logging in: ", ctx.message);
				return;
			}

			// Store just the access token because this is the responsibility of
			// the client
			useAccessTokenStore.getState().save(ctx.data.accessToken);

			await router.invalidate();
			router.navigate({ to: "/" });
		},
		onError: (error) => {
			console.log("error logging in: ", error.message);
		}
	});
};

export const useLogoutMutation = () => {
	const router = useRouter();

	return useMutation({
		mutationFn: logout,
		onSuccess: async (ctx) => {
			// Clear access token regardless of server response
			useAccessTokenStore.getState().remove();

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
};

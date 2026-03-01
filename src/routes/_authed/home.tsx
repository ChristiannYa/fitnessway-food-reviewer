import { logoutServerFn } from '@/api/auth/authApi';
import { accessTokenStore } from '@/store/accessTokenStore';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router';

export const Route = createFileRoute('/_authed/home')({
    component: Home
});

function Home() {
    const router = useRouter();

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
        onError: (error) => { console.log(error.message); }
    });

    const handleLogout = () => {
        logoutMutation.mutate(undefined);
    };

    return (
        <div className="min-h-screen bg-stone-50 flex flex-col items-center pt-20 px-6">
            <h1
                className="text-6xl md:text-7xl font-black text-stone-800 tracking-tight mb-10"
                style={{ fontFamily: "'Georgia', serif" }}
            >
                🍽 Food Reviewer
            </h1>

            <button
                onClick={handleLogout}
                className="px-6 py-2.5 bg-stone-800 hover:bg-stone-700 active:bg-stone-900 text-white font-medium rounded-lg transition-colors text-sm tracking-wide"
            >
                Log Out
            </button>
        </div>
    );
}
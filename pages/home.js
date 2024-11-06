import { useSession, SessionProvider, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Home = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login');
        }
    }, [status, router]);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'unauthenticated') {
        return null; // Avoid rendering if redirecting
    }

    return (
        <div>
            <h1>Welcome, {session.user.username}!</h1>
            {/* Add more content here as needed */}
        </div>
    );
};

const HomePage = ({ session }) => (
    <SessionProvider session={session}>
        <Home />
    </SessionProvider>
);

export async function getServerSideProps(context) {
    const session = await getSession(context);
    return { props: { session } };
}

export default HomePage;

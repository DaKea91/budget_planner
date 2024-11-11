import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

const Home = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login"); // Redirect to login if the user is unauthenticated
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return null; // Don't render anything if redirecting
  }

  return (
    <div>
      <h1>Welcome, {session.user.username}!</h1>
      {/* Add more content as needed */}
    </div>
  );
};

export default Home;

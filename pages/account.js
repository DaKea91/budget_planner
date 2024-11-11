import { getSession } from "next-auth/react";  // Import getSession for server-side session check

const Account = ({ session }) => {
  if (!session) {
    return <div>Please log in to view your account details.</div>;
  }

  return (
    <div>
      <h2>Account Details</h2>
      <p>Email: {session.user.email}</p> {/* Display user email */}
    </div>
  );
};

// Server-side session check
export async function getServerSideProps(context) {
  const session = await getSession(context); // Get session on the server

  if (!session) {
    return {
      redirect: {
        destination: "/auth/login", // Redirect to login page if not logged in
        permanent: false,
      },
    };
  }

  return {
    props: { session }, // Pass session to the component
  };
}

export default Account;

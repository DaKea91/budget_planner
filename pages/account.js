import { getSession } from 'next-auth/react'; // Use getSession to check session server-side

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

// Protect the page using getSession on server-side
export async function getServerSideProps(context) {
  const session = await getSession(context); // Get session

  if (!session) {
    return {
      redirect: {
        destination: '/auth/login', // Redirect to login page if no session
        permanent: false,
      },
    };
  }

  return {
    props: { session }, // Pass session to the component
  };
}

export default Account;


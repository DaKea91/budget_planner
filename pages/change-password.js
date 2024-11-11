import { getSession } from "next-auth/react"; // Import getSession for server-side session check

const ChangePassword = ({ session }) => {
  if (!session) {
    return <div>Please log in to change your password.</div>;
  }

  return (
    <div>
      <h2>Change Password</h2>
      <form>
        {/* Your form for changing the password */}
        <label>New Password:</label>
        <input type="password" name="newPassword" />
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);  // Check session on the server side

  if (!session) {
    return {
      redirect: {
        destination: "/auth/login", // Redirect to login page if no session
        permanent: false,
      },
    };
  }

  return {
    props: { session }, // Pass session data to the page
  };
}

export default ChangePassword;


// components/Layout.js
import { useSession, signOut } from "next-auth/react"; // Import NextAuth hooks
import Link from "next/link"; // Link for routing to other pages
import { useRouter } from "next/router"; // Router to handle page redirection
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material"; // MUI components

const Layout = ({ children }) => {
  const { data: session, status } = useSession(); // Get session data from useSession hook
  const router = useRouter(); // Access the router for redirection

  // Handle the logout process
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login" }); // Sign out and redirect to login
  };

  return (
    <div>
      {/* AppBar (Header) */}
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Budget Planner
          </Typography>

          {/* Links and actions depending on the session */}
          <Button color="inherit" component={Link} href="/home">
            Home
          </Button>

          {session ? (
            <>
              <Button color="inherit" component={Link} href="/account">
                Account
              </Button>
              <Button color="inherit" component={Link} href="/change-password">
                Change Password
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button color="inherit" component={Link} href="/auth/login">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container>
        <main>{children}</main>
      </Container>
    </div>
  );
};

export default Layout;


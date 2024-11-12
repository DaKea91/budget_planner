import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";

const Layout = ({ children }) => {
  const { data: session } = useSession();  // Fetch session data using useSession

  // Handle the logout process
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login" });  // Logout and redirect to login
  };

  return (
    <div>
      {/* AppBar (Header) */}
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Budget Planner
          </Typography>

          {/* Always visible links */}
          <Button color="inherit" component={Link} href="/home">
            Home
          </Button>

          {/* Conditionally render "Account" and "Change Password" links if logged in */}
          {session && (
            <>
              <Button color="inherit" component={Link} href="/account">
                Account
              </Button>
              <Button color="inherit" component={Link} href="/change-password">
                Change Password
              </Button>
              <Button color="inherit" component={Link} href="/expenses">
                Expenses
              </Button>
            </>
          )}


          {/* Conditionally render "Logout" button if logged in */}
          {session && (
            <Button color="inherit" onClick={handleLogout}>
              Logout
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

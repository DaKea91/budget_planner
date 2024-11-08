import { signOut } from "next-auth/react";
import Link from "next/link";
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const Layout = ({ children }) => {
  // Handle the logout process
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login" });
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

          {/* ... other links and buttons as needed */}

          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
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
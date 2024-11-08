// pages/_app.js
import { SessionProvider } from "next-auth/react"; // Import SessionProvider to manage session
import Layout from "../components/layout"; // Import the global Layout component
// import "../styles/globals.css"; // Import your global styles --this is needed only for CSS in JS

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Layout> {/* Wrap pages in Layout to provide header, logout button, etc. */}
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}

export default MyApp;

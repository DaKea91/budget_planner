import { SessionProvider } from "next-auth/react"; // Import SessionProvider to manage session
import Layout from "../components/layout"; // Import the global Layout component

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

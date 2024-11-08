import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";  // Ensure bcrypt is imported for password comparison
import { getDatabase } from "../../../lib/db"; // Adjust the import path as needed

export default NextAuth.default({
    providers: [
        CredentialsProvider.default({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text", placeholder: "email@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    console.log('Authorize called with credentials:', credentials);
                    const database = await getDatabase();
                    const users = database.collection('users');

                    const user = await users.findOne({ email: credentials.email });
                    if (!user) {
                        console.error(`User not found for email: ${credentials.email}`);
                        return null; // Could also throw an error if needed
                    }

                    const passwordMatch = await bcrypt.compare(credentials.password, user.passwordHash);
                    if (!passwordMatch) {
                        console.error('Password comparison failed for user:', user.email);
                        return null; // Could throw a more specific error message if needed
                    }

                    // Return a user object that contains essential info
                    return { id: user._id.toString(), email: user.email, username: user.username }; // Ensure `_id` is a string
                } catch (error) {
                    console.error("Error during authorization:", error);
                    return null; // Handle errors and return null on failure
                }
            }
        })
    ],
    pages: {
        signIn: '/auth/login', // Custom login page
    },
    session: {
        strategy: "jwt", // Use JWT strategy for sessions
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;  // Make sure user.id is available (as a string)
                token.email = user.email; // You can also store email if needed
                token.username = user.username; // Optional: Store username in token if needed
            }
            return token; // Return the token object
        },
        async session({ session, token }) {
            session.user.id = token.id; // Assign `id` to the session
            session.user.email = token.email; // Optionally, add email to the session
            session.user.username = token.username; // Optionally, add username to the session
            return session; // Return the session object
        }
    },
    secret: process.env.NEXTAUTH_SECRET, // Ensure the secret is set for JWT encryption
});

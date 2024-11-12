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

                    // Find the user by email
                    const user = await users.findOne({ email: credentials.email });
                    if (!user) {
                        console.error(`User not found for email: ${credentials.email}`);
                        return null; // Could also throw an error if needed
                    }

                    // Compare the password
                    const passwordMatch = await bcrypt.compare(credentials.password, user.passwordHash);
                    if (!passwordMatch) {
                        console.error('Password comparison failed for user:', user.email);
                        return null; // Could throw a more specific error message if needed
                    }

                    // Return a user object with essential info, including MongoDB _id
                    return { 
                        id: user._id.toString(), // Ensure `_id` is a string
                        email: user.email,
                        username: user.username
                    };
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
            // If user exists, store the user information in the token
            if (user) {
                token.id = user.id;  // Store MongoDB _id in token
                token.email = user.email; // Optionally store email
                token.username = user.username; // Optionally store username
            }
            return token; // Return the updated token
        },
        async session({ session, token }) {
            // Attach user data to session from the token
            session.user.id = token.id; // Attach the MongoDB _id
            session.user.email = token.email; // Attach email to the session
            session.user.username = token.username; // Attach username to the session
            return session; // Return the updated session object
        }
    },
    secret: process.env.NEXTAUTH_SECRET, // Ensure the secret is set for JWT encryption
});

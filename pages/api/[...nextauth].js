import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text", placeholder: "email@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                console.log('Authorize called with credentials:', credentials);
                const database = await getDatabase();
                const users = database.collection('users');

                const user = await users.findOne({ email: credentials.email });
                if (!user) {
                    console.error(`User not found for email: ${credentials.email}`);
                    return null;
                }

                const passwordMatch = await bcrypt.compare(credentials.password, user.passwordHash);
                if (!passwordMatch) {
                    console.error('Password comparison failed for user:', user.email);
                    return null;
                }

                return { id: user._id, email: user.email, username: user.username };
            }
        })
    ],
    pages: {
        signIn: '/auth/login',
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id;
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
});

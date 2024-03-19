import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
    providers: [{
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        authorization: {
            params: {
                prompt: "consent",
                access_type: "offline",
                response_type: "code"
            }
        }
    }],
    callbacks: {
        // Invoked on successful signin
        async signIn({ profile }) {
            // TODO Connect the DB

            // TODO Check is user exists 

            // TODO If user does not exist, add to db

            // TODO Return true to allow signin
        },
        // TODO Modifies the session object 
        async session({ session }) {
            // TODO GEt user from db

            // TODO Assign user id to session 

            // TODO return session
        }
    }
}
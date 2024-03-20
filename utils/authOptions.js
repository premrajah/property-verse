import connectDB from "../config/database";
import User from '../models/User';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
    ],
    callbacks: {
        // Invoked on successful signin
        async signIn({ profile }) {
            // connect DB
            await connectDB();

            // Check is user exists 
            const userExists = await User.findOne({
                email: profile.email
            })

            //If user does not exist, add to db
            if (!userExists) {
                // Truncate username if too long 
                const username = profile.name.slice(0, 20);

                await User.create({
                    email: profile.email,
                    username,
                    image: profile.picture
                })
            }

            // Return true to allow signin
            return true;
        },
        // TODO Modifies the session object 
        async session({ session }) {
            //  Get user from db
            const user = await User.findOne({
                email: session.user.email
            })

            //Assign user id to session 
            session.user.id = user._id.toString();

            //return session
            return session
        }
    }
}
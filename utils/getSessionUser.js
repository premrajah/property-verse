
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from 'next-auth/next'

export const getSessionUser = async () => {
    try {
        // Get the session 
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return null;
        }

        return {
            user: session.user,
            userId: session.user.id
        }

    } catch (error) {

        console.log("getSessionUser error ", error);
        return null;
    }
}   
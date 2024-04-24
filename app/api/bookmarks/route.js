import connectDB from "@/config/database";
import User from "@/models/User";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = "force-dynamic";

export const POST = async (request) => {
    try {
        await connectDB();

        const { propertyId } = await request.json();

        const sessionUser = await getSessionUser();

        if (!session || !session.userId) {
            return new Response({
                message: "User ID is required"
            }, { status: 401 })
        }

        const { userId } = sessionUser;

        //  find user in db
        const user = await User.findOne({ _id: userId })

        // check if property is bookmarked
        let isBookmarked = user.bookmarks.includes(propertyId);

        let message;

        if (isBookmarked) {
            // if already bookmarked remove it
            user.bookmarks.pull(propertyId);
            message = "Bookmark removed successfully."
            isBookmarked = false;
        } else {
            // if not bookmarked add it 
            user.bookmarks.push(propertyId);
            message = "Bookmark added successfully.";
            isBookmarked = true;
        }

        await user.save();

        return new Response(JSON.stringify({
            message,
            isBookmarked
        }), { status: 200 })

    } catch (error) {
        console.log("Bookmark property error ", error);
        return new Response({ message: "Something went wrong" }, { status: 500 })
    }
}
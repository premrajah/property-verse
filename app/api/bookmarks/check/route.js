import connectDB from "@/config/database";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = "force-dynamic";

export const POST = async (request) => {
    try {
        await connectDB();

        const { propertyId } = await request.json();
        console.log("++ ", propertyId);

        const sessionUser = await getSessionUser();

        if (!sessionUser || !sessionUser.userId) {
            return new Response({
                message: "User ID is required"
            }, { status: 401 })
        }

        const { userId } = sessionUser;

        //  find user in db
        const user = await User.findOne({ _id: userId })

        // check if property is bookmarked
        let isBookmarked = user.bookmarks.includes(propertyId);


        return new Response(JSON.stringify({
            isBookmarked
        }), { status: 200 })

    } catch (error) {
        console.log("Bookmark property error ", error);
        return new Response({ message: "Something went wrong" }, { status: 500 })
    }
}
import connectDB from "@/config/database";
import Property from "@/models/Property";

// GET /api/properties/user/userid
export const GET = async (request, { params }) => {
    try {
        await connectDB();

        const userId = params.userId;
        console.log(">> ", userId);

        if (!userId) {
            return new Response("User ID is required", { status: 400 })
        }

        const properties = await Property.find({ owner: userId });

        return new Response(JSON.stringify({
            data: properties
        }), {
            status: 200
        })

    } catch (error) {
        console.log("GET userid error ", error);
        return new Response("Something went wrong ", { status: 500 })
    }
}
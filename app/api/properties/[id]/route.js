import connectDB from "@/config/database"
import Property from "@/models/Property"
import { getSessionUser } from "@/utils/getSessionUser";


// GET /api/properties/:id
export const GET = async (request, { params }) => {
    try {

        await connectDB();

        const property = await Property.findById(params.id);

        if (!property) return new Response({ message: "Property not found." }, { status: 404 })

        return new Response(JSON.stringify({
            data: property
        }, {
            status: 200
        }))

    } catch (error) {
        console.log("Property error ", error);
        return new Response({ message: "Something went wrong" }, {
            status: 500
        })
    }
}

// DELETE /api/properties/:id
export const DELETE = async (request, { params }) => {
    try {

        const propertyId = params.id
        const sessionUser = await getSessionUser();

        // check for session
        if (!sessionUser || !sessionUser.user.id) {
            return new Response({ message: "User Id id required " }, { status: 401 })
        }

        const { userId } = sessionUser;

        await connectDB();

        const property = await Property.findById(propertyId);

        if (!property) return new Response({ message: "Property not found." }, { status: 404 })

        // Verify ownership 
        if (property.owner.toString() !== userId) {
            return new Response({ message: "Unauthorized " }, { status: 401 })
        }

        await property.deleteOne();

        return new Response({ message: "Property Deleted " }, {
            status: 200
        })

    } catch (error) {
        console.log("Property delete error ", error);
        return new Response({ message: "Something went wrong" }, {
            status: 500
        })
    }
}
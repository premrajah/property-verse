import connectDB from "@/config/database"
import Property from "@/models/Property"
import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = "force-dynamic";


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

// PUT /api/properties/:id
export const PUT = async (request, { params }) => {
    try {
        await connectDB();

        const sessionUser = await getSessionUser();

        if (!sessionUser || !sessionUser.userId) {
            return new Response({ message: "User Id is Required" }, { status: 401 })
        }

        const { id } = params;
        const { userId } = sessionUser;

        const formData = await request.formData();

        // Access all values from amenities
        const amenities = formData.getAll("amenities");

        // get property to update
        const existingProperty = await Property.findById(id);

        if (!existingProperty) {
            return new Response({ message: "Property dies not exist " }, { status: 404 })
        }

        // verify ownership 
        if (existingProperty.owner.toString() !== userId) {
            return new Response({ message: "Unauthorized " }, { status: 401 })
        }

        // object for db
        const propertyData = {
            name: formData.get("name"),
            type: formData.get("type"),
            description: formData.get("description"),
            location: {
                address1: formData.get("location.address1"),
                address2: formData.get("location.address2"),
                city: formData.get("location.city"),
                county: formData.get("location.county"),
                country: formData.get("location.country"),
                postcode: formData.get("location.postcode"),
            },
            beds: formData.get("beds"),
            baths: formData.get("baths"),
            square_feet: formData.get("square_feet"),
            amenities,
            rates: {
                nightly: formData.get("rates.nightly"),
                weekly: formData.get("rates.weekly"),
                monthly: formData.get("rates.monthly"),
            },
            seller_info: {
                name: formData.get("seller_info.name"),
                email: formData.get("seller_info.email"),
                phone: formData.get("seller_info.phone"),
            },
            owner: userId,
        }

        // update property in db
        const updatedProperty = await Property.findByIdAndUpdate(id, propertyData);

        return new Response(JSON.stringify({ data: updatedProperty }), { status: 200 })

    } catch (error) {

        console.log("properties post error ", error);

        return new Response({ message: "Something went wrong" }, {
            status: 500
        })
    }
}
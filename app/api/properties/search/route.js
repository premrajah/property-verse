import connectDB from "@/config/database";
import Property from "@/models/Property";

export const dynamic = "force-dynamic";


// GET /api/properties/search
export const GET = async (request) => {
    try {
        await connectDB();

        // params
        const { searchParams } = new URL(request.url);
        const location = searchParams.get("location");
        const propertyType = searchParams.get("propertyType");

        const locationPattern = new RegExp(location, "i");

        // Match location pattern again db fields
        let query = {
            $or: [
                { name: locationPattern },
                { description: locationPattern },
                { "location.address1": locationPattern },
                { "location.address2": locationPattern },
                { "location.city": locationPattern },
                { "location.county": locationPattern },
                { "location.postcode": locationPattern },
            ]
        }

        // only check for property that is not "All"
        if (propertyType && propertyType !== "All") {
            const typePattern = new RegExp(propertyType, "i");
            query.type = typePattern;
        }

        const properties = await Property.find(query);


        return new Response(JSON.stringify({
            data: properties,
            message: "Success"
        }), { status: 200 })

    } catch (error) {

        console.log("Search api error ", error);

        return new Response(JSON.stringify({
            message: "Something went wrong."
        }), { status: 500 })

    }
}
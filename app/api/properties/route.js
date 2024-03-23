import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";



// GET /api/properties
export const GET = async (request) => {
    try {
        await connectDB();

        const properties = await Property.find({});

        return new Response(JSON.stringify({
            data: properties
        }), {
            status: 200
        })
    } catch (error) {
        console.log("properties get error ", error);
        return new Response("Something went wrong", {
            status: 500
        })
    }
}

export const POST = async (request) => {
    try {
        await connectDB();

        const sessionUser = await getSessionUser();

        if (!sessionUser || !sessionUser.userId) {
            return new Response("User Id is Required", { status: 401 })
        }

        const { userId } = sessionUser;

        const formData = await request.formData();

        // Access all values from 
        const amenities = formData.getAll("amenities");
        // with check for empty upload
        const images = formData.getAll("images").filter(image => image.name !== "");

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
            // images
        }

        const newProperty = new Property(propertyData);
        await newProperty.save();

        return Response.redirect(`${process.env.NEXTAUTH_URL}/properties/${newProperty._id}`);


        // return new Response(JSON.stringify({
        //     data: "test"
        // }), {
        //     status: 200
        // })
    } catch (error) {

        console.log("properties post error ", error);

        return new Response("Something went wrong", {
            status: 500
        })
    }
}
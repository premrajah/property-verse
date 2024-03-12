import connectDB from "@/config/database";

export const GET = async (request) => {
    try {
        await connectDB();

        return new Response(JSON.stringify({
            message: "Test, Hello World!"
        }), {
            status: 200
        })
    } catch (error) {
        console.log("properties error ", error);
        return new Response("Something went wrong", {
            status: 500
        })
    }
}
import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = "force-dynamic";

// PUT /api/messages/:id
export const PUT = async (request, { params }) => {
    try {
        await connectDB();

        const { id } = params;

        const sessionUser = await getSessionUser();

        if (!sessionUser || !sessionUser.user) {
            return new Response("User id is required.", { status: 401 });
        }

        const { userId } = sessionUser;

        const message = await Message.findById(id);

        if (!message) {
            return new Response("Message not found", { status: 404 });
        }

        // verify ownership 
        if (message.recipient.toString() !== userId) {
            return new Response("Unauthorized", { status: 401 });
        }

        // Update message read or unread depending on current status
        message.read = !message.read

        await message.save();

        return new Response(JSON.stringify({ data: message }), { status: 200 });

    } catch (error) {
        console.log("Read message error ", error);
        return new Response("Something went wrong. ", { status: 500 });

    }
}

// DELETE /api/messages/:id
export const DELETE = async (request, { params }) => {
    try {
        await connectDB();

        const { id } = params;

        const sessionUser = await getSessionUser();

        if (!sessionUser || !sessionUser.user) {
            return new Response("User id is required.", { status: 401 });
        }

        const { userId } = sessionUser;

        const message = await Message.findById(id);

        if (!message) {
            return new Response("Message not found", { status: 404 });
        }

        // verify ownership 
        if (message.recipient.toString() !== userId) {
            return new Response("Unauthorized", { status: 401 });
        }

        await message.deleteOne();

        return new Response("Message Deleted Successfully.", { status: 200 });

    } catch (error) {
        console.log("Read message error ", error);
        return new Response("Something went wrong. ", { status: 500 });

    }
}
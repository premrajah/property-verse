import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";


export const dynamic = "force-dynamic";

// GET /api/messages
export const GET = async () => {
    try {
        await connectDB();

        const sessionUser = await getSessionUser();

        if (!sessionUser || !sessionUser.user) {
            return new Response(JSON.stringify({ message: "User id is required." }), { status: 401 })
        }

        const { userId } = sessionUser;

        const readMessages = await Message.find({ recipient: userId, read: true })
            .sort({ createdAt: -1 }) // sort read in ascending order
            .populate("sender", "username")
            .populate("property", "name");

        const unreadMessages = await Message.find({ recipient: userId, read: false })
            .sort({ createdAt: -1 }) // sort read in ascending order
            .populate("sender", "username")
            .populate("property", "name");

        const messages = [...unreadMessages, ...readMessages];

        return new Response(JSON.stringify({
            data: messages
        }), { status: 200 })


    } catch (error) {
        console.log("get messages error ", error);
        return new Response("Something went wrong", { status: 500 })
    }
}

// POST /api/messages
export const POST = async (request) => {
    try {

        await connectDB();

        const { name, email, phone, message, property, recipient } = await request.json();

        const sessionUser = await getSessionUser();

        if (!sessionUser || !sessionUser.user) {
            return new Response(JSON.stringify({ message: "You must be logged in to send a message" }), { status: 401 })
        }

        const { user } = sessionUser;

        // Cannot send message to self
        if (user.id === recipient) {
            return new Response(JSON.stringify({ message: "Can not send message to self." }), { status: 400 })
        }

        const newMessage = new Message({
            sender: user.id,
            recipient,
            property,
            name,
            email,
            phone,
            body: message
        });

        await newMessage.save();

        return new Response(JSON.stringify({
            message: "Message sent.",
            data: newMessage
        }), { status: 200 })


    } catch (error) {
        console.log("New message error ", error);
        return new Response("Something went wrong.", { status: 500 })
    }
}
import { fetchRedis } from "@/app/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { getServerSession } from "next-auth";
import { z } from "zod";

// handle post request made by the client
export async function POST(req: Request) {
  try {
    const body = await req.json(); // access to the body content of the request

    const { email: emailToAdd } = addFriendValidator.parse(body.email); // validate the email

    const idToAdd = (await fetchRedis(
      "get",
      `user:email:${emailToAdd}`
    )) as string;    
    
    if(!idToAdd) {
      return new Response("This user does not exit.", { status: 404 });
    }
    const session = await getServerSession(authOptions)

    if(!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    if(idToAdd === session.user.id) {
      return new Response("You can't add yourself.", { status: 400 });
    }

    // check if user is already added.
    const isAlreadyAdded = (await fetchRedis(
      "sismember",
      `user:${idToAdd}:incoming_friend_requests`,
      session.user.id
    )) as 0 | 1;

    if(isAlreadyAdded) {
      return new Response("User already added.", { status: 400 });
    }

    // check if user is already a friend.
    const isAlreadyFriends = (await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idToAdd
    )) as 0 | 1;

    if(isAlreadyFriends) {
      return new Response("User already added.", { status: 400 });
    }
    // validate request, send friend requset
    db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id);

    return new Response("OK");

  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }
    return new Response('Invalid Request', { status: 400 });
  }
}
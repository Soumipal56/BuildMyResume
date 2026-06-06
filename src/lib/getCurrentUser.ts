import { cookies } from "next/headers";
import { verifyToken } from "./jwt";

export async function getCurrentUser(){
    const cookieStore = await cookies();

    const token = cookieStore.get('token')?.value;

    if(!token) return null;

    try {
        const decode = verifyToken(token);
        if (!decode) return null;
        return decode.userId;
    } catch (error) {
        return null;
    }
}
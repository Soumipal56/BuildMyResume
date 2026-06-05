import { JWTPayload } from "@/types/user.types"
import jwt from "jsonwebtoken"

const generateToken = (payload: JWTPayload) => {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: '1h'
    })
}
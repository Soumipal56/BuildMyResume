import { IUser } from "@/types/user.types"
import mongoose, { Document } from "mongoose"
import bcrypt from 'bcrypt'

interface UserDocument extends Omit<IUser, '_id'>, Document {
    comparePass(candidatePassword: string): boolean
}

let userSchema = new mongoose.Schema<UserDocument>({
    name: {
        type: String,
        trim: true,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        trim: true,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"]
    },
    mobile: {
        type: String,
    }
}, {
    timestamps: true
})

userSchema.pre('save', function (): void {
    if(!this.isModified('password')) return
    this.password = bcrypt.hashSync(this.password, 10)
})

userSchema.methods.comparePass = function(candidatePassword: string): boolean {
    return bcrypt.compareSync(candidatePassword, this.password)
}

const userModel = mongoose.models.User || mongoose.model<UserDocument>('User', userSchema)

export default userModel
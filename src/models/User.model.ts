import { IUser } from "@/types/user.types"
import mongoose from "mongoose"
import bcrypt from 'bcrypt'

let userSchema = new mongoose.Schema<IUser>({
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
        minlength: [10, "Minimum 10 characters required"],
        maxlength: [10, "Maximum 10 characters required"]
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

const userModel = mongoose.model('User', userSchema)

export default userModel
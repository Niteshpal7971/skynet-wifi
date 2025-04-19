import { z } from 'zod'

export const signupSchema = z.object({
    userName: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters")
})
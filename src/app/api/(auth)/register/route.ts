import { NextResponse, NextRequest } from 'next/server';
import { User } from '@/models/userModel';
import { connect } from '@/lib/db';
import bcryptjs from 'bcryptjs';
import { sendVerificationMail } from '@/lib/sendVerificationEmail';
import { v4 as uuidv4 } from 'uuid';


const adminEmails = ["niteshpal4585@gmail.com", "niteshsaveasweb@gmail.com"]
export async function POST(request: NextRequest) {
    try {
        await connect();

        const body = await request.json();

        const { userName, email, password } = body;

        if (!userName || !email || !password) {
            return NextResponse.json(
                {
                    success: false,
                    message: "All fields are required",
                },
                { status: 400 }
            )
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            if (!existingUser.isVerified) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Your email is not verified. Please verify your email first."
                    },
                    { status: 400 }
                )
            }
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        const isAdmin = adminEmails.includes(email);
        const role = isAdmin ? 'admin' : 'user';

        const verifyToken = uuidv4();
        const verifyTokenExpiry = new Date(Date.now() + 1000 * 60 * 60);

        const newUser = new User({
            userName,
            email,
            password: hashedPassword,
            role,
            isAdmin,
            verifyToken,
            verifyTokenExpiry,
            isVerified: false
        })

        await sendVerificationMail(email, verifyToken);
        await newUser.save();
        return NextResponse.json(
            {
                success: true,
                message: "Signup successful! Please check your email to verify.",
                user: newUser
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Email Verification Error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Internal Server Error"
            },
            { status: 500 }
        )
    }
}

//besic validation
//check if user already exist in database
//create new user
//
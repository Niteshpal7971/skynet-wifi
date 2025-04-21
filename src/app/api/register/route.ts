import { NextResponse, NextRequest } from 'next/server';
import { User } from '@/models/userModel';
import { connect } from '@/lib/db';
import bcryptjs from 'bcryptjs'

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
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcryptjs.hash(password, 10)
        console.log(hashedPassword)
        const newUser = new User({
            userName,
            email,
            password: hashedPassword
        })

        await newUser.save();

        return NextResponse.json(
            {
                success: true,
                message: "User Registered Successfully",
                User: newUser
            },
            { status: 201 }
        )
    } catch (error) {
        console.error("[Register Error]", error);
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
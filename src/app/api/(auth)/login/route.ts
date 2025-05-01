import { NextRequest, NextResponse } from "next/server";
import { connect } from '@/lib/db';
import { User } from '@/models/userModel'
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    try {
        await connect();

        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                {
                    sucess: false,
                    message: "Email and Password both are required"
                },
                { status: 400 }
            )
        }

        const user = await User.findOne({
            email
        });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status: 404
                }
            )
        }

        const isValidPassword = await bcryptjs.compare(password, user.password)
        if (!isValidPassword) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Incorrect password"
                },
                { status: 401 }
            )
        }

        if (!user.isVerified) {
            return NextResponse.json({
                success: false,
                message: 'Please verify your email first'
            },
                { status: 401 }
            )
        }

        const accessToken = jwt.sign({
            id: user._id,
            email: user.email,
            userName: user.userName,
            role: user.role
        },
            process.env.JWT_ACCESS_SECRET!,
            { expiresIn: "1d" }
        );

        const refreshToken = jwt.sign({
            id: user._id,
        },
            process.env.JWT_REFRESH_SECTRET!,
            { expiresIn: "7d" }
        );


        (await cookies()).set('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: '/'
        });

        (await cookies()).set('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: '/'
        });



        return NextResponse.json(
            {
                success: true,
                message: "Login Successfull",
                user: {
                    userName: user.userName,
                    email: user.email
                },
            },
            { status: 201 }
        )

    } catch (error) {
        console.error("[LOGIN_ERROR]");
        return NextResponse.json(
            {
                success: false,
                message: "Internal Server Error"
            },
            { status: 500 }
        )
    }
}
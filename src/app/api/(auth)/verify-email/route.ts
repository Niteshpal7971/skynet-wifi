import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/models/userModel';
import { connect } from '@/lib/db';

export const GET = async (req: Request, res: Response) => {
    try {
        await connect();

        const { searchParams } = new URL(req.url);

        const token = searchParams.get('token');
        console.log("user.token", token)
        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Token is missing",
                },
                { status: 400 }
            )
        };

        const newUser = await User.findOne({
            verifyToken: token,
        });

        console.log("checking debugging", newUser?.verifyToken);

        if (!newUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid or expired token"
                },
                { status: 400 }
            )
        };

        //when token expired
        if (newUser.verifyTokenExpiry && newUser.verifyTokenExpiry < new Date()) {
            return NextResponse.json({
                success: false,
                message: "Token expired",
                email: newUser.email,
            },
                { status: 400 }
            )
        }

        newUser.isVerified = true;
        newUser.verifyToken = undefined;
        newUser.verifyTokenExpiry = undefined;
        await newUser.save()

        return NextResponse.json(
            {
                success: true,
                message: "User Registered Successfully",
                User: newUser
            },
            { status: 201 }
        );
    } catch (error) {
        console.log(error);
        NextResponse.json(
            {
                success: false,
                message: "Internal server error"
            },
            { status: 500 }
        )
    }
}
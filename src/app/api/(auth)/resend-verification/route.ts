import { NextResponse, NextRequest } from "next/server";
import { connect } from '@/lib/db'
import { User } from '@/models/userModel'
import { sendVerificationMail } from "@/lib/sendVerificationEmail";
import { v4 as uuidv4 } from 'uuid';

export const POST = async (request: NextRequest) => {
    try {
        await connect();

        // get email from request
        const { email } = await request.json();
        console.log(email);
        //find email in userData
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                {
                    success: "false",
                    message: "User not found"
                },
                { status: 400 }
            )
        };

        //create new Token and expiry
        const verifyToken = uuidv4();
        const verifyTokenExpiry = new Date(Date.now() + 1000 * 60 * 60);

        user.verifyToken = verifyToken;
        user.verifyTokenExpiry = verifyTokenExpiry;

        await user.save();

        await sendVerificationMail(email, verifyToken)

    } catch (error) {
        console.error("Email Verification Error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Internal server error"
            },
            { status: 500 }
        )
    }

}
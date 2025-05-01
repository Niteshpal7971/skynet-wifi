import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
export async function POST() {

    (await cookies()).set('accessToken', "", {
        httpOnly: true,
        expires: new Date(0),
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
    });

    return NextResponse.json(
        {
            success: true,
            message: "user loggedout successfully"
        },
        { status: 201 }
    )
}

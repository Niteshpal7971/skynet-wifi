'use client'
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [status, setStatus] = useState<"loading" | "verified" | "expired" | "error">('loading');
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    console.log("userToken", token);
    useEffect(() => {
        const verify = async () => {
            if (!token) return;
            try {
                const res = await fetch(`/api/verify-email?token=${token}`,
                    {
                        method: "GET"
                    }
                );
                const data = await res.json()
                console.log(data);

                if (!res.ok) {
                    if (data.message === "Token expired") {
                        setEmail(data.email);
                        setStatus("expired")
                    } else {
                        setStatus("error");
                        setMessage(data.message || "Veification failed")
                    }
                } else {
                    setStatus("verified");
                    setMessage(data.message || "Email verified successfully")
                }
            } catch (error) {
                setStatus("error");
                setMessage("Something went wrong");
                console.error(error)
            }
        }

        if (token) verify();

        else {
            setStatus("error");
            setMessage("No token provided");
        }

    }, [token])

    const handleResend = async () => {
        try {
            const response = await fetch('/api/resend-verification',
                {
                    method: "POST",
                    headers: { 'Content-type': 'application/json' },
                    body: JSON.stringify({ email })
                }
            );
            const data = await response.json();
            console.log(data);
            if (response.ok) {
                alert("Verification email resent successfully!")
            } else {
                alert(data.message || "Failed to resend verification email.")
            }

        } catch (error) {
            console.error("Error while resending resending email", error)
            alert("something went wrong while resending email")
        }
    }

    return (
        <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
            {status === "loading" && <p>Verifying your email...</p>}

            {status === "verified" && (
                <div>
                    <h2>✅ {message}</h2>
                    <p>You can now login to your account.</p>
                </div>
            )}

            {status === "expired" && (
                <div>
                    <h2>⏰ Verification link expired</h2>
                    <p>Email: <strong>{email}</strong></p>
                    <button onClick={handleResend} className='text-blue-500 hover:underline'>Resend Verification Email</button>
                </div>
            )}

            {status === "error" && (
                <div>
                    <h2>❌ {message}</h2>
                </div>
            )}
        </div>
    )
}

export default VerifyEmailPage
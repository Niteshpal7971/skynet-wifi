import nodemailer from 'nodemailer'

export const sendVerificationMail = async (email: string, token: string): Promise<void> => {

    const verifyUrl = `${process.env.BASE_URL}/verify-email?token=${token}`;
    //create transporter

    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER || 'niteshpal4585@gmail.com',
            pass: process.env.EMAIL_PASS || 'xiwqzburlwxjnuwu'
        },
    });

    await transport.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify your email",
        html: `<p>Click below to verify your email:</p><a href="${verifyUrl}">${verifyUrl}</a>`,
    })
}
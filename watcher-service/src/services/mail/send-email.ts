import transporter from './transporter';

export interface emailPayload {
    email_id: string;
    subject: string;
    body: string;
}

async function sendEmail({ email_id, subject, body }: emailPayload): Promise<void> {
    // 2. Configure email content.
    const mailOptions = {
        from: process.env.EMAIL_ADMIN,
        to: email_id,
        subject: subject,
        html: body,
    }

    //3. Send email
    try {
        const result = await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error(`Unable to send email : ${error}`)
    }
}

export { sendEmail };

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendOTPEmail = async (to: string, otp: string) => {
  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f7f6; padding: 20px; border-radius: 8px;">
      <div style="background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); text-align: center;">
        <h1 style="color: #333333; margin-bottom: 20px; font-size: 24px;">Verify Your Account</h1>
        <p style="color: #666666; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
          Thank you for signing up for Task App. Please use the following One-Time Password (OTP) to complete your verification process.
        </p>
        <div style="background-color: #f0f7ff; border: 2px dashed #0066cc; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h2 style="margin: 0; color: #0066cc; font-size: 36px; letter-spacing: 5px;">${otp}</h2>
        </div>
        <p style="color: #999999; font-size: 14px; margin-bottom: 0;">
          If you didn't request this code, you can safely ignore this email.
        </p>
        <p style="color: #565555ff; font-size: 14px; margin-bottom: 0;">
          This OTP will expire in <span style="font-weight: bold; color: #0066cc;">5 minutes</span>.
        </p>
      </div>
      <div style="text-align: center; margin-top: 20px;">
        <p style="color: #aaaaaa; font-size: 12px;">© ${new Date().getFullYear()} Task App. All rights reserved.</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Task App" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify your account",
    html: htmlTemplate
  });
};

export { sendOTPEmail };
const nodemailer = require("nodemailer");

// Create a test account for development if no SMTP settings are provided
const createTestAccount = async () => {
  try {
    return await nodemailer.createTestAccount();
  } catch (error) {
    console.error("Error creating test email account:", error);
    throw error;
  }
};

// Configure nodemailer transporter
const createTransporter = async () => {
  // If we have SMTP settings in environment variables, use them
  if (process.env.SMTP_HOST && process.env.SMTP_PORT) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  // Otherwise, create a test account for development
  const testAccount = await createTestAccount();
  console.log("Ethereal Email Account:", testAccount.user, testAccount.pass);

  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

// Send verification email
const sendVerificationEmail = async (userEmail, verificationCode) => {
  try {
    const transporter = await createTransporter();

    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"E-Commerce Support" <jikebe4706@firain.com>`,
      to: userEmail,
      subject: "Email Verification",
      text: `Your verification code is: ${verificationCode}. This code is valid for 1 hour.`,
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
                    <h2 style="color: #333;">Email Verification</h2>
                    <p>Thank you for creating an account with our service.</p>
                    <p>Your verification code is:</p>
                    <h1 style="background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 24px; letter-spacing: 5px;">${verificationCode}</h1>
                    <p>This code is valid for <strong>1 hour</strong>.</p>
                    <p>If you didn't request this verification, please ignore this email.</p>
                </div>
            `,
    });

    console.log("Email sent:", info.messageId);

    // For development, log the URL where the email can be previewed
    if (info.messageId) {
      console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
    }

    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
};

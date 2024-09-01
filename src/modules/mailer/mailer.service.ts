import nodemailer from "nodemailer";

// Load environment variables
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendApplicationNotification = async (
  to: string,
  fullName: string,
  positionTitle: string
) => {
  const mailOptions = {
    from: `"Fynder.ai - Indus Valley Technologies" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: "Application Received",
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
            }
            .email-container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border: 1px solid #dddddd;
                border-radius: 8px;
                overflow: hidden;
            }
            .header {
                background-color: #ffffff;
                text-align: center;
                padding: 20px;
            }
            .header img {
                max-width: 100%;
                height: auto;
                border: 0;
            }
            .content {
                padding: 20px;
                color: #333333;
            }
            .content h2 {
                color: #007BFF;
            }
            .footer {
                background-color: #f4f4f4;
                padding: 20px;
                text-align: center;
                font-size: 14px;
                color: #666666;
            }
            .footer a {
                color: #007BFF;
                text-decoration: none;
            }
            .button {
                display: inline-block;
                padding: 10px 20px;
                margin: 10px 0;
                background-color: #007BFF;
                color: #ffffff;
                text-decoration: none;
                border-radius: 4px;
                font-weight: bold;
                text-align: center;
                font-size: 16px;
                line-height: 1.5;
                transition: background-color 0.3s, transform 0.3s;
            }
            .button:hover {
                background-color: #0056b3;
                transform: scale(1.05);
            }
            .button:active {
                background-color: #004494;
                transform: scale(0.95);
            }
            @media only screen and (max-width: 600px) {
                .email-container {
                    width: 100% !important;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <img src="https://fynder.ai/header-black.png" alt="Fynder.ai logo">
            </div>
            <div class="content">
                <h2>Dear ${fullName},</h2>
                <p>Thank you for applying for the position of ${positionTitle}. We have received your application and will review it soon. Our team will get in touch with you shortly.</p>
                <br>
                <p>Best regards,<br>Team Fynder.ai</p>
                <a href="https://fynder.ai/home" class="button">Visit Our Website</a>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Fynder.ai - Indus Valley Technologies. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Application notification email sent to ${to}`);
  } catch (error: any) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send application notification email");
  }
};

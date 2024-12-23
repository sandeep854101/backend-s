// sending email verification like link

// import nodemailer from "nodemailer";
// const sendEmail = async (email, token) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: "Gmail", // Replace with your email service
//       auth: {
//         user: process.env.EMAIL_USER, // Your email
//         pass: process.env.EMAIL_PASS, // Your email password
//       },
//     });

//     const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
//     const mailOptions = {
//       from: "noreply@yourapp.com",
//       to: email,
//       subject: "Email Verification",
//       html: `
//         <h1>Email Verification</h1>
//         <p>Please click the link below to verify your email address:</p>
//         <a href="${verificationLink}">Verify Email</a>
//       `,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log(`Verification email sent to ${email}`);
//   } catch (error) {
//     console.error("Error sending verification email:", error.message);
//     throw new Error("Could not send verification email.");
//   }
// };

// export default sendEmail



// sending verification by otp

import nodemailer from "nodemailer";
import { Verification_Email_Template } from "../Mail/EmailTemplate.js";
// Function to generate a random OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
};

const sendEmail = async (email) => {
  try {
    // Generate OTP
    const otp = generateOTP();

    // Create a transporter to send email
    const transporter = nodemailer.createTransport({
      service: "Gmail", // Replace with your email service
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password
      },
    });

    // Email content
    const mailOptions = {
      from: "noreply@yourapp.com",
      to: email,
      subject: "Email OTP Verification",
      html: `
        ${Verification_Email_Template(otp)}
      `,
    };

    // Send email with OTP
    await transporter.sendMail(mailOptions);

    // Return OTP to be saved in the database (this is for server-side verification)
    return otp;

  } catch (error) {
    console.error("Error sending OTP email:", error.message);
    throw new Error("Could not send OTP email.");
  }
};

export default sendEmail;

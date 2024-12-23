export const Verification_Email_Template = (otp) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
          }
          .container {
              max-width: 600px;
              margin: 30px auto;
              background: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              border: 1px solid #ddd;
          }
          .header {
              background-color: #4CAF50;
              color: white;
              padding: 20px;
              text-align: center;
              font-size: 26px;
              font-weight: bold;
          }
          .content {
              padding: 25px;
              color: #333;
              line-height: 1.8;
          }
          .verification-code {
              display: block;
              margin: 20px 0;
              font-size: 22px;
              color: #4CAF50;
              background: #e8f5e9;
              border: 1px dashed #4CAF50;
              padding: 10px;
              text-align: center;
              border-radius: 5px;
              font-weight: bold;
              letter-spacing: 2px;
          }
          .footer {
              background-color: #f4f4f4;
              padding: 15px;
              text-align: center;
              color: #777;
              font-size: 12px;
              border-top: 1px solid #ddd;
          }
          p {
              margin: 0 0 15px;
          }
      </style>
  </head>
  <body>
      <div class="container">
    <div class="header">🎉 Verify Your Email 🎉</div>
    <div class="content">
        <p>Hello there,</p>
        <p>
            We're so excited to have you join us! To make sure it's really you, please take a moment to confirm your email address by entering the code below:
        </p>
        <span class="verification-code">${otp}</span>
        <p>
            This step helps us ensure a safe and secure experience for everyone. If you didn’t sign up, no worries—just ignore this message.
        </p>
        <p>
            Got questions or need help? Our friendly support team is just a click away!
        </p>
    </div>
    <div class="footer">
        <p>
            💖 Thank you for choosing us! <br />
            &copy; ${new Date().getFullYear()} Your Company. All rights reserved.
        </p>
    </div>
</div>

  </body>
  </html>
`;


// uses in email sending otp
// export const generateWelcomeEmail = ( otp) => {
//     return `
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Welcome to Our Community</title>
//         <style>
//             body {
//                 font-family: Arial, sans-serif;
//                 margin: 0;
//                 padding: 0;
//                 background-color: #f4f4f4;
//                 color: #333;
//             }
//             .container {
//                 max-width: 600px;
//                 margin: 30px auto;
//                 background: #ffffff;
//                 border-radius: 8px;
//                 box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
//                 overflow: hidden;
//                 border: 1px solid #ddd;
//             }
//             .header {
//                 background-color: #007BFF;
//                 color: white;
//                 padding: 20px;
//                 text-align: center;
//                 font-size: 26px;
//                 font-weight: bold;
//             }
//             .content {
//                 padding: 25px;
//                 line-height: 1.8;
//             }
//             .welcome-message {
//                 font-size: 18px;
//                 margin: 20px 0;
//             }
//             .button {
//                 display: inline-block;
//                 padding: 12px 25px;
//                 margin: 20px 0;
//                 background-color: #007BFF;
//                 color: white;
//                 text-decoration: none;
//                 border-radius: 5px;
//                 text-align: center;
//                 font-size: 16px;
//                 font-weight: bold;
//                 transition: background-color 0.3s;
//             }
//             .button:hover {
//                 background-color: #0056b3;
//             }
//             .footer {
//                 background-color: #f4f4f4;
//                 padding: 15px;
//                 text-align: center;
//                 color: #777;
//                 font-size: 12px;
//                 border-top: 1px solid #ddd;
//             }
//             p {
//                 margin: 0 0 15px;
//             }
//         </style>
//     </head>
//     <body>
//         <div class="container">
//             <div class="header">Welcome to Our Community!</div>
//             <div class="content">
//                 <p class="welcome-message">Hello</p>
//                 <p>We’re thrilled to have you join us! Your registration was successful, and we’re committed to providing you with the best experience possible.</p>
//                 <p>Your OTP code is <strong>${otp}</strong> to verify your email address.</p>
//                 <p>Here’s how you can get started:</p>
//                 <ul>
//                     <li>Explore our features and customize your experience.</li>
//                     <li>Stay informed by checking out our blog for the latest updates and tips.</li>
//                     <li>Reach out to our support team if you have any questions or need assistance.</li>
//                 </ul>
//                 <a href="#" class="button">Get Started</a>
//                 <p>If you need any help, don’t hesitate to contact us. We’re here to support you every step of the way.</p>
//             </div>
//             <div class="footer">
//                 <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
//             </div>
//         </div>
//     </body>
//     </html>
//     `;
//   };

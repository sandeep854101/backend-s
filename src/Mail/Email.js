import { transporter } from "../middleware/Mail.middlawre.js";
import { Verification_Email_Template } from "./EmailTemplate.js";


export const SendVerificationcode=async(Email,verificationcode)=> {
  
  try{
    const reponse = await transporter.sendMail({
        from: '"Verify Email for Sign Up" <roopeshkumarbxr2017@gmail.com>', // sender address
        to: Email, // list of receivers
        subject: "Verif your email", 
        text: "verify your email", 
        html: Verification_Email_Template.replace("{verificationCode}",verificationcode), 
      });
    
      console.log("Message sent: %s", reponse);
      // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }

    catch(error){
        console.log(error)

    }
  }
import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: "roopeshkumarbxr2017@gmail.com",
    pass: "poyz sdyl rxgs evba",
  },
});


// const Sendmail=async()=> {
  
//   try{
//     const info = await transporter.sendMail({
//         from: '"Maddison Foo Koch 👻" <roopeshkumarbxr2017@gmail.com>', // sender address
//         to: "roopeshkumar00011@gmail.com", // list of receivers
//         subject: "Hello ✔", 
//         text: "Hello world?", 
//         html: "<b>Hello world?</b>", 
//       });
    
//       console.log("Message sent: %s", info);
//       // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
//   }

//     catch(error){
//         console.log(error)

//     }
//   }
//   Sendmail()





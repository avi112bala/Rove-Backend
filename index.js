const express=require('express');
const nodemailer=require('nodemailer');
const cors=require('cors');
// const {connectWithRetry}=require('./db/config');
const User = require('./db/User');
const UserBook=require('./db/Userbook');
const bodyParser = require("body-parser");
const crypto = require("crypto");
const Jwt =require('jsonwebtoken');
const jwtkey = "rove-avi-arsh-secrete";
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const app=express();
const PORT = process.env.PORT || 5000;



app.use(express.json())
app.use(cors({
  origin: 'https://rove-frontend-six.vercel.app', // Allow only this origin
  methods: 'GET,POST',
  credentials: true, // Allow cookies and credentials
}));
app.use(bodyParser.json());
// connectWithRetry(); 
mongoose.connect(mongodb+srv://avi116:Techavi1216@cluster0.dxy3r.mongodb.net/RoveIndia?retryWrites=true&w=majority&appName=Cluster0, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('Error connecting to MongoDB:', err));

//Sent Otp for email
function generateotp(){
  // return crypto.randomBytes(5).toString('base64').toUpperCase();
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendMail(email,otps){
  // console.log(otps,'kjkkkjk');
// const otpbase=Buffer.from(otp,'base64');
 const buffer = Buffer.from(otps, "base64");
 const otp= buffer.toString("utf-8");

// console.log(otp,'uuuu');
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "roveindia1518@gmail.com",
      pass: "hmgj wbpt hooo hshu",
    },
  });

  const mailOptions = {
    from: "roveindia1518@gmail.com",
    to: email,
    subject: "otp verification",
    text: `Your Otp is ${otp}`,
  };
  await transporter.sendMail(mailOptions);
}

//send otp
app.post('/send-otp',async(req,res)=>{
  const {email}=req.body;
  const otp = generateotp();
   const buffer = Buffer.from(otp, "utf-8");
   const otps= buffer.toString("base64");
  try{
     sendMail(email,otps);
    res.status(200).json({success:true,message:'OTP Sent Successfully',Response:'1',otp:otps});
  }catch{
     res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
  });

  //send oto for signu-up
  app.post("/send-otp-signup", async (req, res) => {
    const { email } = req.body;
    const alreadyuser=await User.findOne({ email: email});
    if(alreadyuser){
      return res.status(403).json({message:"User already exists!."})
    }else{
            const otp = generateotp();
            const buffer = Buffer.from(otp, "utf-8");
            const otps = buffer.toString("base64");
            try {
              sendMail(email, otps);
              res.status(200).json({
                success: true,
                message: "OTP Sent Successfully",
                Response: "1",
                otp: otps,
              });
            } catch {
              res
                .status(500)
                .json({ success: false, message: "Failed to send OTP" });
            }
    }

  });

// checkEmail



app.post("/check-email", async (req, res) => {
  const { email } = req.body;
    // console.log(email);
  try {
    const existingUser = await User.findOne({ email });
    // console.log(existingUser);
    if (existingUser) {
      res.json({ emailExists: true });
    } else {
      res.json({ emailExists: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user with the entered email
    const user = await User.findOne({ email });
      console.log(jwtkey);
    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }
    // Successful login
    if(user){
       Jwt.sign({ user }, jwtkey, { expiresIn: "4h" }, (err, token) => {
         if (err) {
           return res.status(500).json({ message: "Internal server error" });
         }
         res.send({ user, token: token, Response: "1" });
         //  res.status(200).json({ user: user, Response: "1" , token:token});
       });
    }
   
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Signup 
app.post("/signup", async (req, resp) => {
    try {
      console.log("hello");
      let user = new User(req.body);
      let result = await user.save();
      console.log(result);
      Jwt.sign({ result }, jwtkey, { expiresIn: "4h" }, (err, token) => {
        if (err) {
          return resp.status(500).json({ message: "Internal server error" });
        }
        resp.send({
          data: result,
          token: token,
          Response: "1",
          success: true,
          message: "Sign up successfully!",
        });
        //  res.status(200).json({ user: user, Response: "1" , token:token});
      });
      // resp
      //   .status(200)
      //   .json({
      //     success: true,
      //     message: "Sign up successfully!",
      //     data: result,
      //   });
    } catch (error) {
      console.error("Error saving user:", error.message);
      resp.status(500).json({ success: false, message: "Failed to signup" });
    }

});

// BOOK 

app.post('/book',async(req,resp)=>{
   let user=new UserBook(req.body);
   
   const transporter = nodemailer.createTransport({
     service: "gmail",
     auth: {
       user: "roveindia1518@gmail.com",
       pass: "nyfi ljii fwnu bpzc",
     },
   });
   const mailOptions={
    from:'roveindia1518@gmail.com',
    to:user.email,
    subject:'Booking Confirmation',
    text:`Hello Sir, your booking is confirmed`
   }
   await transporter.sendMail(mailOptions);
   let result =await user.save();
   resp.send(result);
})


// CREATE NODEMAILER
app.post("/send-email", async (req, res) => {
  const { name, email, Msg } = req.body;
  console.log(req.body)

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "roveindia1518@gmail.com",
      pass: "nyfi ljii fwnu bpzc",
    },
  });

  const mailOptions = {
    from: "roveindia1518@gmail.com",
    to: `${email}`,
    subject: "New message from your website",
    text: `${name} (${email}) says: (${Msg})`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({status:"ok",msg:'Email sent'});
  } catch (error) {
    console.error(error);
    res.status(500).send({status:"FAIL" ,msg:'Email is Not Sent'});
  }
});




app.listen(PORT,()=>{
  console.log('LIsting on port 5000')
});

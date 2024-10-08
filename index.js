const express=require('express');
const nodemailer=require('nodemailer');
const cors=require('cors');
const multer = require("multer");
// const {connectWithRetry}=require('./db/config');
const User = require('./db/User');
const UserBook=require('./db/Userbook');
const bodyParser = require("body-parser");
const State = require("./db/State");
const  City =require("./db/City")
const Place =require("./db/Places");
const path = require("path");
const crypto = require("crypto");
const Jwt =require('jsonwebtoken');
const jwtkey = "rove-avi-arsh-secrete";
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require("fs");
dotenv.config();
const app=express();
const PORT = process.env.PORT || 5000;



app.use(express.json())
app.use(cors({
  origin: 'https://rove-frontend-six.vercel.app',  
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  credentials: true     
}));

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     methods: "GET,POST,PUT,DELETE,OPTIONS",
//     credentials: true,
//   })
// );

app.options('*', cors());  // Handle preflight requests for all routes

app.use(bodyParser.json());
// connectWithRetry(); 
const uri = process.env.MONGODB_URI;
// const MONGODB_URI =
//   "mongodb+srv://avi116:Techavi1216@cluster0.dxy3r.mongodb.net/RoveIndia?retryWrites=true&w=majority";

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    keepAlive: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

//upload image
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Save files with unique names
  },
});
const upload = multer({ storage });


// POST route to handle form submissions

app.post("/api/states", upload.single("stateimage"), async (req, res) => {
    try {
        const { statename, statedesp, staterate } = req.body;

        const newState = new State({
            statename,
            statedesp,
            staterate,
            stateimage: req.file.path, // Save the image file path
        });

        await newState.save();

        res.status(201).json({ message: "State data submitted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Failed to submit state data", error });
    }
});
app.get("/api/states", async (req, res) => {
  try {
    const states = await State.find();
    res.status(200).json(states);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve states", error });
  }
});

//Get Single Data
app.get("/api/states/:id", async (req, res) => {
  const { id } = req.params; // Extract the ID from the URL
  try {
    const state = await State.findById(id); // Find the state by ID
    if (!state) {
      return res.status(404).json({ message: "State not found" });
    }
    res.status(200).json(state);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve the state", error });
  }
});

//add single package details
app.post("/api/singlecity", upload.single("stateimage"), async (req, res) => {
  try {
    const { name, desp, rate, selectedState } = req.body;

    const newcity = new City({
      name,
      desp,
      rate,
      selectedState,
      stateimage: req.file.path, // Save the image file path
    });

    await newcity.save();

    res.status(201).json({ message: "State data submitted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit state data", error });
  }
});

//Get all single city
app.get("/api/allcity", async (req, res) => {
  try {
    const states = await City.find();
    res.status(200).json(states);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve states", error });
  }
});

// Get Single City 
app.get("/api/single-states/:id", async (req, res) => {
  const { id } = req.params; // Extract the ID from the URL
  try {
    
    const states = await City.find({ selectedState: id });
    res.status(200).json(states);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve states", error });
  }
});


// Delete city 
app.post("/api/deletecity/:id", async (req, res) => {
  try {
    const cityId = req.params.id;
    const cityToDelete = await City.findById(cityId);
    if (!cityToDelete) {
      return res.status(404).json({ message: "State not found" });
    }
    const imagePath = path.join(__dirname, cityToDelete.stateimage);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    await City.findByIdAndDelete(cityId);
    res.status(200).json({ message: "State deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete state", error });
  }
});


// Add Single Place 
app.post("/api/singleplace", upload.single("stateimage"), async (req, res) => {
  try {
    const { name, desp, rate, selectedState } = req.body;

    const newPlace = new Place({
      name,
      desp,
      rate,
      selectedState,
      stateimage: req.file.path, // Save the image file path
    });

    await newPlace.save();

    res.status(201).json({ message: "places data submitted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit places data", error });
  }
});


// Get All Places 
app.get("/api/allplaces", async (req, res) => {
  try {
    const places = await Place.find();
    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve places", error });
  }
});


// Get Single Place 
app.get("/api/single-place/:id", async (req, res) => {
  const { id } = req.params; // Extract the ID from the URL
  try {
    const place = await Place.find({ selectedState: id });
    res.status(200).json(place);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve place", error });
  }
});

// Delete single place 
app.post("/api/deleteplace/:id", async (req, res) => {
  try {
    const PlaceId = req.params.id;
    const placeToDelete = await Place.findById(PlaceId);
    if (!placeToDelete) {
      return res.status(404).json({ message: "State not found" });
    }
    const imagePath = path.join(__dirname, placeToDelete.stateimage);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    await Place.findByIdAndDelete(PlaceId);
    res.status(200).json({ message: "State deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete state", error });
  }
});

// DELETE route to remove a state by its ID
app.post("/api/deletestates/:id", async (req, res) => {
    try {
        const stateId = req.params.id;
        const stateToDelete = await State.findById(stateId);
        if (!stateToDelete) {
            return res.status(404).json({ message: "State not found" });
        }
        const imagePath = path.join(__dirname, stateToDelete.stateimage); 
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath); 
        }
        await State.findByIdAndDelete(stateId);
        res.status(200).json({ message: "State deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete state", error });
    }
});






app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});


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

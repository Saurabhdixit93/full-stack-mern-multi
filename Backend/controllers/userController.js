const userModel = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateJwt");
const { mailTransporter } = require("../utils/Nodemailer");
const otpGenerator = require("otp-generator");


const newUserAccount = async (req, res, next) => {
  try {
    const { email, name, password, confirmPassword, profilePic } = req.body;
    if (!name || !email || !password || !confirmPassword || !profilePic) {
        return res.json({
            success: false,
            message: "All fields Required .",
        });
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    // Requires at least 6 characters, one lowercase letter, one uppercase letter, one digit, and one special character
   const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    const validEmail = email.toLowerCase();
    // Validate email
    const isValidEmail = (validEmail) => emailRegex.test(validEmail);
    // Validate password
    const isValidPassword = (password) => passwordRegex.test(password);
    if (!isValidEmail(validEmail)) {
      return res.json({
        message: "Invalid email format",
        success: false,
      });
    }
    if (!isValidPassword(password)) {
      return res.json({
        message: "Invalid password format",
        success: false,
      });
    }
    // haashed password generate
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword) {
      return res.json({
        message: "Error In Hashing Password !t",
        success: false,
      });
    }
 
      const user = await userModel.findOne({ email: validEmail });
      if (user) {
        return res.json({
          message: "User Already Exists with this email !",
          success: false,
        });
      }
      const newUser = new userModel({
        name:name,
        email: validEmail,
        password: hashedPassword,
        profilePic:profilePic,
      });
      await newUser.save();
    
      const subject = "Account Created Successfully";
      const html = `
      <p>Hello ${newUser.name},</p>
       <img src="${newUser.profilePic}" alt="Profile Picture" style="max-width: 100px; height: auto;">
      <p>Your account has been successfully created. Welcome to our platform!</p>
      <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>
      <p>Thank you for joining us!</p>
    `;
  
      const mailOptions = {
              from: process.env.MAIL_FROM,
              to:  newUser.email,
              subject:subject,
              html: html,
          }
      await mailTransporter.sendMail(mailOptions);
      return res.json({
        success: true,
        message: "Account Created Successfully ",
      });
   
  } catch (error) {
     return res.json({
      success: false,
      message: "Internal Server Error .",
    });
  }
};

const userLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validEmail = email.toLowerCase();
    const user = await userModel.findOne({ email: validEmail });
    if (!user) {
      return res.json({
        success: false,
        message: "User Not found with given email ! ",
      });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.json({
        success: false,
        message: "Wrong Email or Password ! ",
      });
    }
    const otp = otpGenerator.generate(6, {
      digits: true,
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });
    const otpExpirationMinutes = 10;
    const otpExpiresAt = new Date();
    otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + otpExpirationMinutes);

    // Store the OTP and its expiration time in the user's document
    user.otp = {
      code: otp,
      expiresAt: otpExpiresAt,
    };
    await user.save();
    await sendOtpToUser(user.email, otp, otpExpiresAt);
    return res.json({
      success: true,
      isOtpVerify: false,
      message: "OTP sent to your email. Please verify.",
    });
  } catch (error) {
    console.log(error,"Error in login otp");
     return res.json({
      success: false,
      message: "Internal Server Error .",
    });
  }
};

const verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;
  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.json({
        success: false,
        message: "User not found. !",
      });
    }
    if (otp === user.otp.code && new Date() < user.otp.expiresAt) {
      // OTP matches, generate JWT token and return success respons
      const payload = {
        userid: user._id
      };

      const secretKey = process.env.SECRETKEY;
      const expiresIn = "7d";
      const token = await generateToken(payload, secretKey, expiresIn);
      user.otp = undefined;
      await user.save();
      return res.json({
        success: true,
        message: "OTP verified. User Logged in successfully.",
        isOtpVerify: true,
        token,
      });
    } else {
      return res.json({
      success: false,
      message: "Invalid Otp .",
    });
    }
  } catch (error) {
      return res.json({
      success: false,
      message: "Internal Server Error .",
    });
  }
};

const sendOtpToUser = async (toEmail, otp, otpExpiresAt) => {
  try {
    const html = `<p>Your OTP for login verification: <strong>${otp}</strong></p>
    <p>This OTP will expire on: ${otpExpiresAt}</p>
    `;
    const subject = "OTP for Login Verification";
    const mailOptions = {
              from: process.env.MAIL_FROM,
              to:  toEmail,
              subject:subject,
              html: html,
          }
    await mailTransporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error(error);
  }
};
const deleteUser = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const deleteUser = await userModel.findByIdAndDelete(userId);
    if (deleteUser === null) {
      return res.json({
        message: "User Not found to delete !",
        success: false,
      });
    }
  
    const subject = "Account Deleted Successfully";
    const html = `
    <p>Hello ${deleteUser.name},</p>
    <p>Your account has been successfully deleted.</p>
    <p>We're sorry to see you go. If you ever decide to come back, we'll be here for you!</p>
    <p>If you have any feedback or suggestions, please feel free to share them with us.</p>
    <p>Thank you for being a part of our community.</p>
  `;
    const toMail = deleteUser.email;
    const mailOptions = {
              from: process.env.MAIL_FROM,
              to:  toMail,
              subject:subject,
              html: html,
          }
    await mailTransporter.sendMail(mailOptions);
    return res.json({
      success: true,
      message: "User deleted successfully ",
    });
  } catch (error) {
    console.log("Error in delete account !" ,error);
      return res.json({
      success: false,
      message: "Internal Server Error .",
    });
  }
};


// const updateUser = async (req, res, next) => {
//   const { email, name, profilePic } = req.body;
//   const { userId } = req.params;

//   if (!name || !email || !profilePic) {
//     return res.json({
//       success: false,
//       message: "All fields required!",
//     });
//   }

//   const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
//   const validEmail = email.toLowerCase();

//   // Validate email
//   const isValidEmail = (validEmail) => emailRegex.test(validEmail);
  
//   if (!isValidEmail(validEmail)) {
//     return res.json({
//       message: "Invalid email format",
//       success: false,
//     });
//   }

//   try {
//     // Check if the provided email already exists
//     const existingUser = await userModel.findOne({ email: validEmail });
//     if (existingUser) {
//       return res.json({
//         success: false,
//         message: "Email already exists. Please use a different email.",
//       });
//     }


//     const updateUser = await userModel.findByIdAndUpdate(
//       userId,
//       { name, email: validEmail, profilePic },
//       { new: true }
//     );

//     if (!updateUser) {
//       return res.json({
//         message: "User not found.",
//         success: false,
//       });
//     }

//     return res.json({
//       success: true,
//       message: "User updated successfully.",
//     });
//   } catch (error) {
//     return res.json({
//       success: false,
//       message: "Internal Server Error.",
//     });
//   }
// };

const updateUser = async (req, res, next) => {
  const { email, name, profilePic } = req.body;
  const { userId } = req.params;
  try {
    const existingUser = await userModel.findOne({
      email: email.toLowerCase(),
    });
    if (existingUser) {
      return res.json({
        success: false,
        message: "Email already exists. Please use a different email.",
      });
    }
  } catch (error) {
    return res.json({
      success: false,
      message: "Internak Server Error",
    });
  }
  const updates = {};

  if (name) {
    updates.name = name;
  }
  if (email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const validEmail = email.toLowerCase();

    if (!emailRegex.test(validEmail)) {
      return res.json({
        message: "Invalid email format",
        success: false,
      });
    }

    updates.email = validEmail;
  }
  if (profilePic) {
    updates.profilePic = profilePic;
  }

  if (Object.keys(updates).length === 0) {
    return res.json({
      success: false,
      message: "No fields to update.",
    });
  }

  try {
    const updatedUser = await userModel.findByIdAndUpdate(userId, updates, {
      new: true,
    });
    if (!updatedUser) {
      return res.json({
        message: "User not found.",
        success: false,
      });
    }

    return res.json({
      success: true,
      message: "User updated successfully.",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

const currentUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({
        success: false,
        message: "User not found .",
      });
    }

    return res.json({
      success: true,
      user: {
        profilePic: user.profilePic,
        name:user.name,
        email:user.email,
      }
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Internal Server Error !",
    });
  }
};



module.exports = {
  newUserAccount,
  userLogin,
  deleteUser,
  updateUser,
  verifyOtp,
  currentUser,
};

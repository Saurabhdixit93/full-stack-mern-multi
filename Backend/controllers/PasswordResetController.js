const passwordResetModel = require("../models/PasswordResetModel");
const userModel = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const { mailTransporter } = require("../utils/Nodemailer");
const { generateResetToken } = require("../utils/ResetPassToken");

const sendPasswordResetLink = async (req, res, next) => {
  const { email } = req.body;
  const validEmail = email.toLowerCase();
  try {
    const user = await userModel.findOne({ email: validEmail });
    if (!user) {
      return res.json({
        message: "User no Found !",
        success: false,
      });
    }

    const resetToken = generateResetToken();
    const resetTokenExpiresAt = new Date(Date.now() + 3600000);
    const resetTokenDoc = new passwordResetModel({
      user: user._id,
      resetToken,
      resetTokenExpiresAt,
    });

    await resetTokenDoc.save();
    const resetTokenValue = resetToken;
    const subject = "Password Reset Token";
    const html = `
      <p>Hello ${user.name},</p>
      <p>You have requested to reset your password. Copy this token to complete password reset proccess:</p>
      <p>${resetTokenValue}</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;
        const mailOptions = {
              from: process.env.MAIL_FROM,
              to:  user.email,
              subject:subject,
              html: html,
          }
    await mailTransporter.sendMail(mailOptions);
    return res.json({
      success: true,
      message: "Password reset link sent successfully.",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Internal Server Error .",
    });
  }
};

const handlePasswordLink = async (req, res, next) => {
  try {
    const { token } = req.body;
    const resetTokenDoc = await passwordResetModel.findOne({
      resetToken: token,
      resetTokenExpiresAt: { $gt: new Date() },
      isTokenUsed: false,
    });
    if (!resetTokenDoc) {
      return res.json({
        message: "Invalid or expired reset token.",
        success: false,
      });
    }
    // Find the user associated with the reset token using userModel
    const user = await userModel.findById(resetTokenDoc.user);

    if (!user) {
      return res.json({
        message: "User not found.",
        success: false,
      });
    }

    resetTokenDoc.isTokenUsed = true;
    await resetTokenDoc.save();

    return res.json({
      success: true,
      message: "Valid reset token. now update your password .",
      passToken: token,
    });
  } catch (error) {
      return res.json({
      success: false,
      message: "Internal Server Error .",
    });
  }
};

const updatePassword = async (req, res, next) => {
  const { token, password } = req.body;
  try {
    // Find the reset password token in the database
    const resetTokenDoc = await passwordResetModel.findOne({
      resetToken: token,
      resetTokenExpiresAt: { $gt: new Date() },
      isTokenUsed:false,
    });

    if (!resetTokenDoc) {
      return res.json({
        message: "Invalid or expired reset token .",
        success: false,
      });
    }
    // Find the user associated with the reset token
    const user = await userModel.findById(resetTokenDoc.user);

    if (!user) {
      return res.json({
        message: "User not found .",
        success: false,
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    // Mark the reset token as used
    resetTokenDoc.isTokenUsed = true;
    resetTokenDoc.resetToken = null; // Use null to indicate clearing
    resetTokenDoc.resetTokenExpiresAt = null; // Use null to indicate clearing
    await resetTokenDoc.save();

    // Send a response or perform a redirection
    return res.json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.log(error,"In Paass Update");
     return res.json({
      success: false,
      message: "Internal Server Error .",
    });
  }
};
module.exports = {
  handlePasswordLink: handlePasswordLink,
  sendPasswordResetLink: sendPasswordResetLink,
  updatePassword: updatePassword,
};

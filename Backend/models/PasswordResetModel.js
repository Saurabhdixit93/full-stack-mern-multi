const { Schema, model } = require("mongoose");

const resetPasswordSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "UserModel",
    },
    resetToken: {
      type: String,
      default: null,
    },
    resetTokenExpiresAt: {
      type: Date,
      default: null, 
    },
    isTokenUsed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const ResetPasswordModel = model("ResetPasswordModel", resetPasswordSchema);
module.exports = ResetPasswordModel;

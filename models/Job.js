const mongoose = require("mongoose");
const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      maxlength: 30,
      required: [true, "please provide company"],
    },

    position: {
      type: String,
      maxlength: 30,
      required: [true, "please provide position"],
    },
    status: {
      type: String,
      required: [true, "please provide status"],
      enum: ["interview", "pending", "declined"],
      default: "pending",
    },
    createdby: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "please provide user"],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Job", JobSchema);

const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
{
name: {
type: String,
required: true,
trim: true,
},


email: {
  type: String,
  required: true,
  trim: true,
},

feedback: {
  type: String,
  required: true,
  trim: true,
},


},
{
timestamps: true,
}
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;

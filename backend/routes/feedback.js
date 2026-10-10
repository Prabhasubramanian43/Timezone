const express = require("express");
const Feedback = require("../models/Feedback");

const router = express.Router();

// POST Customer Feedback
router.post("/", async (req, res) => {
  try {
    const { name, email, feedback } = req.body;

    if (!name || !email || !feedback) {
      return res.status(400).json({
        message: "Please fill in all fields",
      });
    }

    const newFeedback = new Feedback({
      name,
      email,
      feedback,
    });

    await newFeedback.save();

    res.status(201).json({
      message: "Thank you for your feedback!",
    });
  } catch (error) {
    console.error("Feedback error:", error);

    res.status(500).json({
      message: "Unable to save feedback",
    });
  }
});

module.exports = router;
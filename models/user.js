const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/practice");

const studentSchema = mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true, // 🚀 prevents duplicates
  },
  course: String,
});

module.exports = mongoose.model("user", studentSchema);

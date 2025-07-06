const mongoose = require("mongoose");
const { Schema } = mongoose;

const studentSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
});

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;

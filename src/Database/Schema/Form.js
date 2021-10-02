const {Schema, model} = require("mongoose");

const FormSchema = new Schema({
  userID: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    required: true,
  },
  questions: {
    type: Array,
    required: true,
    default: []
  }
});

module.exports = model("Form", FormSchema);

const { string } = require("joi");
const mongoose = require("mongoose");
const Stateschema = new mongoose.Schema({
  statename: { type: String },
  statedesp: { type: String },
  staterate: { type: Number },
  stateimage: { type: String, required: true },
});
const State = mongoose.model("State", Stateschema);
module.exports=State
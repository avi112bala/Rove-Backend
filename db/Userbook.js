const {string, number}=require('joi');
const mongoose=require('mongoose');
const userscemabook = new mongoose.Schema({
  country: String,
  checkin: Date,
  checkout: Date,
  noofrooms: Number,
  noofadults: Number,
  noofchildren: Number,
  email: String,
  phoneno: Number,

},
{
    timestamps:true
}
);


module.exports = mongoose.model("book", userscemabook);
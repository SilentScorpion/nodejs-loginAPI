const mongoose =  require('mongoose');

const userModel = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phoneNo: String,
    date: {
        type : Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User',userModel);
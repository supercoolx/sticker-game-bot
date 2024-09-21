const mongoose = require('mongoose');

const connectDB = () => {
  return mongoose.connect(process.env.MONGO_URL).then(() => console.log('DB connected.'));
};

module.exports = connectDB;

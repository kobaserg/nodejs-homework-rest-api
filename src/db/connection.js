const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const connectMongo = async () => {
  return mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

const connectMongoTest = async () => {
  return mongoose.connect(process.env.MONGO_URL_TEST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = {
  connectMongo,
  connectMongoTest,
};

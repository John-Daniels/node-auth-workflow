const mongoose = require("mongoose");

const main = () => {
  const uri = process.env.MONGO_URI;

  mongoose.set("strictQuery", false);
  mongoose.connect(uri, (err) => {
    if (err) return console.log("something went wrong", err);
    console.log("successfully connected!");
  });
};

main();

import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const database = await mongoose.connect(`${process.env.MONGODB_URL}`);
    console.log("database is working", database.connection.host);
  } catch (error) {
    console.log(error, "Error while database cnnection");
  }
};

export { connectDb };

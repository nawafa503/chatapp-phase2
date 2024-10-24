import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.js";
import bcrypt from "bcrypt";

dotenv.config();

const seedSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);

    // Check if superadmin already exists
    const existingAdmin = await User.findOne({ role: "superadmin" });

    if (existingAdmin) {
      console.log("Superadmin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash("superadmin", 10);

    // Create a superadmin user
    const superAdmin = new User({
      username: "superadmin",
      email: "superadmin@gmail.com",
      password: hashedPassword,
      role: ["superadmin"],
    });

    // Save the user to the database
    await superAdmin.save();
    console.log("Superadmin created:", superAdmin);
  } catch (error) {
    console.error("Error seeding superadmin:", error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
};

seedSuperAdmin();

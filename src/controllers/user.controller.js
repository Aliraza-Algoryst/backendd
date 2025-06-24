import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import {
  finduser,
  processArray,
  searchDatabase,
  sendEmail,
} from "../utils/index.js";
import fs from "fs";
import { hash } from "crypto";

const authArray = [];

const registerUser = async (req, res) => {
  try {
    let { username, email, password, isDoctor } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ massage: "Email , Password  Cannot be empty" });

    const checkExistedUser = await User.findOne({ email: email });
    if (checkExistedUser)
      return res.status(400).json({ massage: "User Already existed" });

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashPassword || " ",
      isDoctor,
    });

    const myUser = user.toObject();
    delete myUser.password;

    if (!user) return res.status(200).json({ massage: "Somtehing Went Wrong" });
    return res.status(200).json({
      massage: `${isDoctor ? "Doctor" : "Patient"}  is Register`,
      myUser,
    });
  } catch (error) {
    console.log(error);
  }
};

const loginUser = async (req, res) => {
  try {
    let { email, password, isDoctor } = req.body;

    if (!email || !password)
      return res.status(400).json({
        massage: "Email , Password Cannot be empty For login",
      });

    const findedUser = await User.findOne({ email: email });
    console.log(findedUser);

    if (!findedUser)
      return res
        .status(401)
        .json({ massage: "NO User Found with this email or passowrd" });

    if (findedUser.isDoctor !== isDoctor)
      return res.status(400).json({ massage: "Login From your own page" });

    let decryptPassword = await bcrypt
      .compare(password, findedUser.password)
      .then((result) => {
        return result;
      });

    if (decryptPassword) {
      res
        .status(200)
        .json({ massage: "User Logged In Successfully", findedUser });
    } else {
      res.status(400).json({ massage: "Email, Password or Username is Wrong" });
    }
  } catch (error) {
    console.log(error);
  }
};
// };

const forgetPassword = async (req, res) => {
  let { email, otp } = req.body;

  let findUser = await User.findOne({ email: email });

  if (findUser) return res.status(400).json({ massage: "No User Founded" });
};

const updateEmail = async (req, res) => {
  try {
    let { currentEmail, updatedemail, otp } = req.body;

    if (!currentEmail || !updatedemail) {
      res.status(400).json({ massage: "Plz Enter Email or Otp first" });
    }
    const NewuserEmail = await User.findOne({ email: updatedemail });
    if (NewuserEmail)
      return res
        .status(400)
        .json({ masage: "This email already exit use new One" });

    const updateuser = await User.findOneAndUpdate(
      { email: currentEmail },
      { email: updatedemail }
    );
    if (!updateuser)
      return res.status(200).json({ massage: "Email not Founded in Db" });

    res.status(200).json({ massage: "Email is Updated", updateuser });
  } catch (error) {
    console.log(error);
  }
};

const updateinfo = async (req, res) => {
  try {
    const img_url = req.file.path;
    let {
      curruntusername,
      newusername,
      currentfullname,
      newfullname,
      otp,
      email,
    } = req.body;

    if (
      !newusername ||
      !currentfullname ||
      !otp ||
      !newfullname ||
      !curruntusername
    ) {
      res
        .status(400)
        .json({ massage: "Plz Enter UserName or Full name first" });
    }
    //

    const Updateuserinfo = await User.findOneAndUpdate(
      { username: curruntusername },
      { username: newusername, fullname: newfullname, img_url: img_url }
    );
    fs.unlink(Updateuserinfo.img_url, () => {
      console.log("Image has been dleted after new profile image upload");
    });

    // console.log(Updateuserinfo, "here is user infoooooo");
    if (!Updateuserinfo)
      return res
        .status(400)
        .json({ massage: "Username OR fullname OR Email not Founded in Db" });

    res.status(200).json({ massage: "Email info is Updated" });
  } catch (error) {
    console.log(error);
  }
};

const updatepassword = async (req, res) => {
  try {
    let { currentpassword, newpassword, email } = req.body;

    const user = await User.findOne({ email: email });

    if (!currentpassword || !newpassword || !email) {
      res
        .status(400)
        .json({ massage: "Plz Enter UserName or Full name first" });
    }
    let decryptPassword = await bcrypt
      .compare(currentpassword, user[i].password)
      .then((result) => {
        return result;
      });
    if (user.email !== email)
      return res.status(200).json({ massage: "Email  is not in Db" });

    const hashPassword = await bcrypt.hash(newpassword, 10);

    if (!decryptPassword)
      return res.status(400).json({ massage: "Password is wrong" });

    user.password = hashPassword;
    await user.save();

    res.status(200).json({ massage: "Email is Updated", user });
  } catch (error) {
    console.log(error);
  }
};

const deleteuser = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password)
      res.status(400).json({ massage: "Emai or password cannot be empty" });

    let finduser = await User.findOne({ email });

    if (!finduser)
      return res
        .status(400)
        .json({ massage: "Not user found with this email" });
    let decryptPassword = await bcrypt
      .compare(password, finduser.password)
      .then((result) => {
        return result;
      });

    let user_id = finduser._id;

    if ((finduser.email = email && decryptPassword)) {
      await finduser.deleteOne();
      fs.unlink(finduser.img_url, () => {});
    }
    res.status(200).json({ massage: "Congratulation USer is deleted" });
  } catch (error) {
    console.log(error);
  }
};

const getalluser = async (req, res) => {
  let { name, email } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    if (name || email) {
      let users = await User.find()
        .skip((page - 1) * limit)
        .limit(limit);

      const findedUser = users.filter(
        (data) => data.username === name || data.email === email
      );

      return res.json({
        message: "Filtered by name or email",
        findedUser,
      });
    }

    const user1 = await User.find()
      .skip((page - 1) * limit)
      .limit(limit);
    const totaldocument = await User.countDocuments();

    return res.status(200).json({
      message: "All users (no filter)",
      page,
      limit,
      totaldocument,
      user1,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const genrateOtp = async (req, res) => {
  try {
    let { email } = req.body;

    let user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ massage: "Email not Found" });
    let otp = Math.floor(Math.random() * 9000) + 1000;
    const obj = { otp, email };

    sendEmail(otp, email);
    authArray.push(obj);
    res.status(200).json({ massage: "Email Send" });
  } catch (error) {
    console.log(error);
  }
  console.log(authArray);
};

const verifyotp = async (req, res) => {
  let { email, otp } = req.body;
  let verified;
  const userotp = authArray.filter(
    (item) => item.otp == otp && item.email == email
  );
  if (userotp.length === 0)
    return res.status(400).json({ massage: "Otp is Invalid", verified: false });

  res.status(200).json({ massage: "Otp Verified", verified: true });
};

const updatepassfromOtp = async (req, res) => {
  try {
    const { newpassword, email } = req.body;

    const hashPassword = await bcrypt.hash(newpassword, 10);

    const user = await User.findOneAndUpdate(
      { email },
      { password: hashPassword }
    );

    res.status(200).json({ message: "Password Updated Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

export {
  updatepassfromOtp,
  verifyotp,
  genrateOtp,
  registerUser,
  deleteuser,
  loginUser,
  updateEmail,
  updateinfo,
  updatepassword,
  getalluser,
};

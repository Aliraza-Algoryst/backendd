import { User } from "../models/user.model.js";
const isAdmin = async (req, res, next) => {
let {email}=req.body
  let user = await User.findOne({ email: email });
  if (!user) res.status(400).json({massage:'first create your account'})
  if (user.isAdmin == false)
    return res.status(500).json({ massage: "Only Admin can do this task" });
  next();
};

export { isAdmin };



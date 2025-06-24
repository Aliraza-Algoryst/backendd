const isAuthorize = (req, res, next) => {
  const Auth = req.get("Authorization");
  console.log(Auth);
  
  if (Auth != "aliraza")
    return res.status(400).json({ massage: "Un Authorize Request" });
  next();
};



export {isAuthorize}
import jwt from "jsonwebtoken";

// useruser authentication middleware
// const authUser = async (req, res, next) => {
//   try {
//     const { token } = req.headers;
//     if (!token) {
//       return res.json({
//         success: false,
//         message: "Not Authorized Login Again",
//       });
//     }
//     const token_decode = jwt.verify(token, process.env.JWT_SECRET);
//     req.body.userId = token_decode.id;
//     next();
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };
// export default authUser;

const authUser = (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized. Please login again.",
      });
    }

    const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = tokenDecoded.id;
    next();
  } catch (error) {
    console.log("Auth error:", error);
    res.json({ success: false, message: error.message });
  }
};

export default authUser;

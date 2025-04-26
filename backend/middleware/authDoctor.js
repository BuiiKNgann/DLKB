// import jwt from "jsonwebtoken";

// const authDoctor = (req, res, next) => {
//   try {
//     const { dtoken } = req.headers;

//     if (!dtoken) {
//       return res.json({
//         success: false,
//         message: "Not Authorized. Please login again.",
//       });
//     }

//     const token_decoded = jwt.verify(dtoken, process.env.JWT_SECRET);
//     req.body.docId = token_decoded.id;
//     next();
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

// export default authDoctor;
import jwt from "jsonwebtoken";

const authDoctor = (req, res, next) => {
  try {
    const { dtoken } = req.headers;

    if (!dtoken) {
      return res.json({
        success: false,
        message: "Not Authorized. Please login again.",
      });
    }

    const token_decoded = jwt.verify(dtoken, process.env.JWT_SECRET);

    if (!req.body) req.body = {};
    req.body.docId = token_decoded.id;

    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export default authDoctor;

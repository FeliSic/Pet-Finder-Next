// import * as yup from "yup";

// export const validate = (schema, handler) => {
//   return async (req, res, next) => {
//     try {
//       await schema.validate(req.body, { abortEarly: false });
//       return handler(req, res, next);
//     } catch (err) {
//       if (err instanceof yup.ValidationError) {
//         return res.status(400).json({
//           errors: err.errors,
//         });
//       }
//       return next(err);
//     }
//   };
// }
import sendMail from "../utils/nodemailer.js";

export const verificationMail = (email, verificationToken) => {
  // TODO: work on template
  const template = "Your verification code is  : " + verificationToken;
  sendMail(email, "Pinterest 📷", ``, template);
};

export const loginMail = (email) => {
  // TODO: work on template
  const template = "Your pinterest account just logged in.";
  sendMail(email, "Pinterest 📷", ``, template);
};

export const UserVerifiedMail = (email) => {
  // TODO: work on template
  const template =
    "Your pinterest account has been verified. You can now login.";
  sendMail(email, "Pinterest 📷", ``, template);
};

export const forgetPasswordMail = (email, verificationCode) => {
  // TODO: work on template
  const template =
    "Your password reset link is  : " +
    "http://localhost:5173/change/" +
    verificationCode;
  sendMail(email, "Pinterest 📷", ``, template);
};

export const passwordChangedMail = (email) => {
  // TODO: work on template
  const template = "Your password has been changed successfully.";
  sendMail(email, "Pinterest 📷", ``, template);
};

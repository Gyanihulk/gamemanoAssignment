const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USER, // Sender gmail address
    pass: process.env.APP_PASSWORD, // App password from Gmail account
  },
});
//

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendTwoFactorTokenEmail = async (
  email: string,
  token: string
) => {
  const mail = {
    from: "adamya@gamemano.com",
    to: email,
    subject: "2FA Code",
    html: `<p>Your 2FA code: ${token}</p>`
  }
  await transporter.sendMail(mail);

};

export const sendPasswordResetEmail = async (
  email: string,
  token: string,
) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`
  const mail = {
    from: "adamya@gamemano.com",
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`
  }

  await transporter.sendMail(mail);

};

export const sendVerificationEmail = async (
  email: string,
  token: string
) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;
  const mail = {
    from: "adamya@gamemano.com",
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`
  }
  await transporter.sendMail(mail);

};

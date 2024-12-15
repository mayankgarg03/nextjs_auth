import User from "@/models/userModel";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";

const sendEmail = async ({ userId, emailType, email }: any) => {
  try {
    const token = await bcryptjs.hash(userId.toString(), 10);
    const expiry = Date.now() + 3600000;
    if (emailType == "VERIFY") {
      User.findByIdAndUpdate(userId, {
        $set: {
          verifyToken: token,
          verifyTokenExpiry: expiry,
        },
      });
    } else if (emailType == "RESET") {
      User.findByIdAndUpdate(userId, {
        $set: {
          resetPasswordToken: token,
          resetPasswordTokenExpiry: expiry,
        },
      });
    }

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    const subject =
      emailType == "VERIFY" ? "Verify Your Email" : "Reset Your Password";
    const url = `${process.env.DOMAIN}/verifyemail?token=${token}`;
    const mailOptions = {
      from: "admin@gmail.com",
      to: email,
      subject: subject,
      html: `<p>Click <a href="${url}">here</a> to ${subject}</p>`,
    };
    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    console.error("Error While Sending Email: ", error);
    throw new Error(error.message);
  }
};

export { sendEmail };

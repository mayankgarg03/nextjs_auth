import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, password, email } = reqBody;
    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { error: "User Already Exist" },
        { status: 409 }
      );
    }
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
    });
    const savedUser = await newUser.save();

    await sendEmail({ userId: savedUser._id, emailType: "VERIFY", email });
    return NextResponse.json({
      message: "User Created Successfully",
      user: savedUser,
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    const user: any = await User.findOne({
      email: email,
    });
    if (!user) {
      NextResponse.json({ error: "Invalid Email" }, { status: 500 });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      NextResponse.json({ error: "Invalid Password" }, { status: 500 });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.TOKEN_SECRET!,
      { expiresIn: "1h" }
    );

    const response = NextResponse.json({
      message: "User Logged-In Successfully",
      success: true,
    });
    response.cookies.set("token", token, {
      httpOnly: true,
    });

    return response;
  } catch (error: any) {
    NextResponse.json({ error: error.message }, { status: 500 });
  }
}

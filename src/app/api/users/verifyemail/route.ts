import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token } = reqBody;

    const user: any = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });
    if (!user) {
      NextResponse.json(
        { error: "Invalid Verification Token" },
        { status: 500 }
      );
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();
    NextResponse.json(
      { message: "User Verified Successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    NextResponse.json({ error: error.message }, { status: 500 });
  }
}

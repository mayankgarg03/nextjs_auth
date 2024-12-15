import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { getIdFromToken } from "@/helpers/getTokenDetails";
connect();

export async function GET(request: NextRequest) {
  try {
    const userId = getIdFromToken(request);

    const user: any = await User.findOne({
      _id: userId,
    }).select("-password");
    if (!user) {
      NextResponse.json({ error: "Invalid Token" }, { status: 500 });
    }

    const response = NextResponse.json({
      message: "User Found",
      success: true,
      data: user,
    });

    return response;
  } catch (error: any) {
    NextResponse.json({ error: error.message }, { status: 500 });
  }
}

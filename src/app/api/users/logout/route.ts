import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
  try {
    const response = NextResponse.json(
      {
        message: "Logout Successfully",
      },
      { status: 200 }
    );
    response.cookies.set("token", "", {
      httpOnly: true,
      expires: Date.now(),
    });

    return response;
  } catch (error: any) {
    NextResponse.json({ error: error.message }, { status: 500 });
  }
}

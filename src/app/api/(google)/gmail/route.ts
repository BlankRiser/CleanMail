
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { gmail } from "@googleapis/gmail";

export async function GET(request: Request) {
    const session = await auth()

  if (!session) {
    return new NextResponse(
      JSON.stringify({ status: "fail", message: "You are not logged in" }),
      { status: 401 }
    );
  }
  const response = await gmail("v1").users.messages.list({
    userId: "me",
    oauth_token: session.user.token.access_token,
    pageToken: "0",
  })

  console.log(response);

  return NextResponse.json({
    message: "",
    data: response,
  });
}

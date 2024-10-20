import { auth } from "@/lib/auth";
import { gmail } from "@googleapis/gmail";
import { NextResponse } from "next/server";

type QueryParams = {
  id: string;
};

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: QueryParams;
  }
) {
  const { id } = params;

  const session = await auth();

  if (!session) {
    return new NextResponse(
      JSON.stringify({ status: "fail", message: "You are not logged in" }),
      { status: 401 }
    );
  }

  const access_token = session.user.token.access_token;

  const emailList = await gmail("v1").users.messages.list({
    userId: "me",
    oauth_token: access_token,
    pageToken: id === "null" ? "0" : id,
  });

  if (!emailList.data.messages) {
    return new NextResponse(
      JSON.stringify({ status: "fail", message: "No emails found" }),
      { status: 404 }
    );
  }

  const emails = [];

  const emailPromises = emailList.data.messages.map((message) => {
    const emailMessageId = message.id as string;
    return gmail("v1").users.messages.get({
      id: emailMessageId,
      userId: "me",
      oauth_token: access_token,
    });
  });

  const emailResults = await Promise.all(emailPromises);
  emails.push(...emailResults);

  return NextResponse.json({
    meta: emailList.data,
    data: emails,
  });
}

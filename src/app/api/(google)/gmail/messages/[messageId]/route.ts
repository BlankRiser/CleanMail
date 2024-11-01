import { auth } from "@/lib/auth";
import { gmail } from "@googleapis/gmail";
import { NextResponse } from "next/server";

type QueryParams = {
  id: string;
  messageId: string;
};

/**
 * Deletes a Gmail message specified by the messageId parameter.
 *
 * @param req - The request object.
 * @param params - An object containing the query parameters.
 * @param params.messageId - The ID of the message to be deleted.
 * @returns A NextResponse object indicating the result of the delete operation.
 *
 * @remarks
 * - Requires the user to be authenticated.
 * - If the user is not authenticated, returns a 401 status with a failure message.
 * - Uses the Gmail API to delete the specified message.
 * - If the deletion is successful, returns a success message and the data from the Gmail API.
 */
export async function DELETE(
  {
    params,
  }: {
    params: QueryParams;
  }
) {
  const { messageId } = params;
  const session = await auth();

  console.log("MESSAGE API: ", messageId);

  if (!session) {
    return new NextResponse(
      JSON.stringify({ status: "fail", message: "You are not logged in" }),
      { status: 401 }
    );
  }

  const access_token = session.user.token.access_token;

  const data = await gmail("v1").users.messages.delete(
    {
      userId: "me",
      oauth_token: access_token,
      id: messageId + "1",
    }
  );

  return NextResponse.json({
    status: "success",
    message: "Email deleted successfully",
    data: data
  });
}

export async function POST(
  {
    params,
  }: {
    params: QueryParams;
  }
) {
  const { messageId } = params;
  const session = await auth();

  console.log("MESSAGE API: ", messageId);

  if (!session) {
    return new NextResponse(
      JSON.stringify({ status: "fail", message: "You are not logged in" }),
      { status: 401 }
    );
  }

  const access_token = session.user.token.access_token;

  const data = await gmail("v1").users.messages.delete(
    {
      userId: "me",
      oauth_token: access_token,
      id: messageId + "1",
    }
  );

  return NextResponse.json({
    status: "success",
    message: "Email deleted successfully",
    data: data
  });
}

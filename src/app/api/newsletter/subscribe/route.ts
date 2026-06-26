import { NextRequest, NextResponse } from "next/server";

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

type ApiResponse = {
  success: boolean;
  message?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as unknown;

    if (
      !body ||
      typeof body !== "object" ||
      body === null ||
      typeof (body as { email?: unknown }).email !== "string" ||
      !(body as { email: string }).email.trim()
    ) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Email is required." },
        { status: 400 }
      );
    }

    const email = (body as { email: string }).email.trim();

    if (!isValidEmail(email)) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const loopsFormId = process.env.LOOPS_FORM_ID;

    if (!loopsFormId) {
      console.error("Missing LOOPS_FORM_ID environment variable for newsletter subscription.");
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Newsletter service is unavailable." },
        { status: 500 }
      );
    }

    const endpoint = `https://app.loops.so/api/newsletter-form/${loopsFormId}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        email,
        userGroup: "",
        mailingLists: "",
      }),
    });

    const responseText = await response.text();
    let responseData: unknown = null;

    try {
      responseData = responseText ? JSON.parse(responseText) : null;
    } catch {
      responseData = null;
    }

    if (!response.ok) {
      const responseDataObject =
        responseData && typeof responseData === "object" && responseData !== null
          ? (responseData as { message?: unknown; error?: unknown })
          : null;

      const apiMessage =
        typeof responseDataObject?.message === "string"
          ? responseDataObject.message
          : typeof responseDataObject?.error === "string"
          ? responseDataObject.error
          : null;

      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: apiMessage || "Something went wrong. Please try again.",
        },
        { status: response.status }
      );
    }

    return NextResponse.json<ApiResponse>({ success: true }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong. Please try again.";

    console.error("Newsletter subscription error:", error);

    return NextResponse.json<ApiResponse>(
      { success: false, message },
      { status: 500 }
    );
  }
}

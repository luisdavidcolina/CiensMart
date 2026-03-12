import { NextResponse } from "next/server";

const DEFAULT_CIENSPAY_URL = "http://3.144.142.161/api/transactions/simulate/";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const upstreamUrl = process.env.CIENSPAY_API_URL || DEFAULT_CIENSPAY_URL;

    const upstreamResponse = await fetch(upstreamUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const rawBody = await upstreamResponse.text();

    let data: any;
    try {
      data = rawBody ? JSON.parse(rawBody) : null;
    } catch {
      data = { raw: rawBody };
    }

    if (!upstreamResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error: "Upstream Ciens Pay request failed",
          status: upstreamResponse.status,
          data,
        },
        { status: upstreamResponse.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Proxy error calling Ciens Pay",
        message: error?.message || "Unknown error",
      },
      { status: 502 }
    );
  }
}

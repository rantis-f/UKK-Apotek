import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logout Berhasil! Token dimusnahkan dari server.",
  });


  response.cookies.set("token", "", { 
    maxAge: 0,
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  response.cookies.set("user", "", { maxAge: 0, path: "/" });

  return response;
}
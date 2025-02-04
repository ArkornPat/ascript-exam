import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "public", "exam-3", "exam-3.json");

async function getJsonUser() {
  try {
    const data = await fs.promises.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading file:", error);
  }
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const users = await getJsonUser();
    const id = Number((await params).id)

    const user = users.find((user: { id: number }) => user.id === id);

    return NextResponse.json({
      message: `Get user by ${id}`,
      data: user
    }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to get user" }, { status: 500 });
  }
}

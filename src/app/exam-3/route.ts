import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "public", "exam-3", "exam-3.json");

interface User {
  id: number;
  email: string;
  password: string;
  fullName: string;
  phone: string;
  address: string;
  gender: "male" | "female" | "other";
}

async function getJsonUser() {
  try {
    const data = await fs.promises.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading file:", error);
  }
}

async function writeJsonUser(data: User[]) {
  try {
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing file:", error);
  }
}

export async function GET() {
  const data = await getJsonUser();
  return NextResponse.json(
    {
      message: "Get users",
      data: data,
    },
    { status: 200 },
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const users = await getJsonUser();

    if (!body.email || !body.password || !body.fullName || !body.phone || !body.address || !body.gender) {
      return NextResponse.json(
        { error: "Please fill out the information completely." },
        { status: 400 }
      );
    }

    const newUser = { id: Date.now(), ...body };
    users.push(newUser);
    await writeJsonUser(users);

    return NextResponse.json(
      {
        message: "Create user success",
        data: newUser,
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, email, password, fullName, phone, address, gender } = await req.json();
    const users = await getJsonUser();
    const userIndex = users.findIndex((user: User) => user.id === id);

    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedUser = { ...users[userIndex] };

    if (email) updatedUser.email = email;
    if (password) updatedUser.password = password;
    if (fullName) updatedUser.fullName = fullName;
    if (phone) updatedUser.phone = phone;
    if (address) updatedUser.address = address;
    if (gender) updatedUser.gender = gender;

    users[userIndex] = updatedUser;

    await writeJsonUser(users);

    return NextResponse.json(
      {
        message: "User updated successfully",
        data: users[userIndex],
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

  export async function DELETE(req: Request) {
    try {
      const { id } = await req.json();
      const users = await getJsonUser();
      const userIndex = users.findIndex((user: User) => user.id === id);
  
      if (userIndex === -1) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const deletedUser = users.splice(userIndex, 1)[0];
      await writeJsonUser(users);

      return NextResponse.json(
        {
          message: "Delete User",
          data: deletedUser,
        },
        { status: 200 },
      );
    } catch {
      return NextResponse.json({ error: "Failed to Delete user" }, { status: 500 });
    }
  }


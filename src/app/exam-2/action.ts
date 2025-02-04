"use server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "public", "exam-2", "exam-2.json");

type User = {
  id: number;
  image: string;
  email: string;
  fullName: string;
  phone?: string;
  address?: string;
  gender: "male" | "female";
  age?: number;
};

type GetUsersParams = {
  search?: string;
  gender?: "male" | "female" | "";
  sort?: keyof User;
  orderId?: "asc" | "desc";
  orderAge?: "asc" | "desc";
  page?: number;
  perPage?: number;
};

type GetUsersResponse = {
  users: User[];
  total: number;
};

export async function getUsers({
  search = "",
  gender = "",
  sort = "id",
  orderId = "asc",
  orderAge = "asc",
  page = 1,
  perPage = 10,
}: GetUsersParams): Promise<GetUsersResponse> {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    let users: User[] = JSON.parse(data);

    if (search) {
      const searchLower = search.toLowerCase();
      users = users.filter(
        (user) =>
          user.fullName.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          (user.phone && user.phone.includes(search))
      );
    }

    if (gender) {
      users = users.filter((user) => user.gender === gender);
    }

    //ใช้ Number.MAX_SAFE_INTEGER เพื่อให้ค่าที่ไม่มีการกำหนดจะถูกวางไว้ที่ด้านท้ายสุดของการจัดเรียง 
    //และ ใช้ Number.MIN_SAFE_INTEGER เพื่อให้ค่าที่ไม่มีการกำหนดจะถูกวางไว้ที่ด้านหน้าในการจัดเรียง
    users.sort((a, b) => {
      const order = sort === "id" ? orderId : orderAge;
      const valueA = a[sort] ?? (order === "asc" ? Number.MAX_SAFE_INTEGER : Number.MIN_SAFE_INTEGER);
      const valueB = b[sort] ?? (order === "asc" ? Number.MAX_SAFE_INTEGER : Number.MIN_SAFE_INTEGER);

      if (order === "asc") return valueA > valueB ? 1 : -1;
      return valueA < valueB ? 1 : -1;
    });

    const total = users.length;
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginatedUsers = users.slice(start, end);

    return { users: paginatedUsers, total };
  } catch (error) {
    console.error("Error reading users:", error);
    return { users: [], total: 0 };
  }
}

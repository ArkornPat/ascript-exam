"use client";
import { useEffect, useState } from "react";
import { getUsers } from "./action";
import Image from "next/image";

type User = {
  id: number;
  image?: string;
  email: string;
  fullName: string;
  phone?: string;
  address?: string;
  gender: "male" | "female";
  age?: number;
};

export default function Exam2() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [sort, setSort] = useState<keyof User>("id");
  const [orderId, setOrderId] = useState<"asc" | "desc">("asc");
  const [orderAge, setOrderAge] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    async function fetchData() {
      const params = { search, gender, sort, orderId, orderAge, page, perPage };
      const { users, total } = await getUsers(params);
      setUsers(users);
      setTotal(total);
    }
    fetchData();
  }, [search, gender, sort, orderId, orderAge, page]);

  const resetPageAndSet = <T,>(setter: (value: T) => void, value: T) => {
    setter(value);
    setPage(1);
  };

  const handleSort = (column: keyof User) => {
    if (column === "id") {
      resetPageAndSet(setOrderId, orderId === "asc" ? "desc" : "asc");
    } else if (column === "age") {
      resetPageAndSet(setOrderAge, orderAge === "asc" ? "desc" : "asc");
    }
    resetPageAndSet(setSort, column);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Users Info </h1>

      {/* Search & Filter */}
      <div className="flex gap-2 mb-4 ">
        <input
          type="text"
          placeholder="Search by name, email, phone"
          className="border p-2 rounded w-full"
          value={search}
          onChange={(e) => resetPageAndSet(setSearch, e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={gender}
          onChange={(e) => resetPageAndSet(setGender, e.target.value as "male" | "female" | "")}
        >
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-md border border-black">
        <table className="w-full border-separate border-spacing-0 rounded-md">
          <thead>
            <tr className="bg-blue-200">
              <th
                className="border border-black p-2 cursor-pointer first:rounded-tl-md last:rounded-tr-md bg-blue-300"
                onClick={() => handleSort("id")}
              >
                ID {orderId === "asc" ? "▼" : "▲"}
              </th>
              <th className="border border-black p-2">Image</th>
              <th className="border border-black p-2">Full Name</th>
              <th className="border border-black p-2">Email</th>
              <th className="border border-black p-2">Phone</th>
              <th className="border border-black p-2">Address</th>
              <th className="border border-black p-2">Gender</th>
              <th
                className="border border-black p-2 cursor-pointer last:rounded-tr-md bg-blue-300"
                onClick={() => handleSort("age")}
              >
                Age {orderAge === "asc" ? "▼" : "▲"}
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className="text-center">
                <td
                  className={`border border-black p-2 ${
                    index === users.length - 1 ? "first:rounded-bl-md last:rounded-br-md" : ""
                  }`}
                >
                  {user.id}
                </td>
                <td className="border border-black p-2">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.fullName}
                      className="w-12 h-12 object-cover mx-auto"
                      width={50}
                      height={50}
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="border border-black p-2">{user.fullName}</td>
                <td className="border border-black p-2">{user.email || "-"}</td>
                <td className="border border-black p-2">{user.phone || "-"}</td>
                <td className="border border-black p-2">{user.address || "-"}</td>
                <td className="border border-black p-2">{user.gender}</td>
                <td className={`border border-black p-2 ${index === users.length - 1 ? "last:rounded-br-md" : ""}`}>
                  {user.age ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-4 items-center">
        <button
          className="bg-blue-400 p-2 rounded disabled:opacity-50 text-white"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span className="text-center">
          Page {page} of {Math.ceil(total / perPage)}
        </span>
        <button
          className="bg-blue-400 p-2 rounded disabled:opacity-50 text-white"
          disabled={page >= Math.ceil(total / perPage)}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

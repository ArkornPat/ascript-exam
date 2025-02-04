"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { register } from "./action";
import { registerFormSchema, type RegisterFormData } from "@/zod/exam-1";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  });

  const [message, setMessage] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter()
  useEffect(() => {
    setMounted(true);
  }, []);

  const onSubmit = async (data: RegisterFormData) => {
    setMessage("");
    try {
      const result = await register(data);
      setMessage(result);
      router.push("/exam-1/success")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    }
  };

  if (!mounted) {
    return (
      <div className="flex flex-col gap-2 min-w-[600px] p-10 bg-white rounded-2xl shadow-lg border">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-700">ลงทะเบียน</h2>
        <div className="animate-pulse space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-2 min-w-[600px] p-10 bg-white rounded-2xl shadow-lg border"
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-700">Register form</h2>
      {message && <p className="mt-4 font-bold text-center text-green-600">{message}</p>}

      {[
        { id: "email", label: "Email", type: "email", placeholder: "example@email.com" },
        { id: "password", label: "Password", type: "password", placeholder: "Enter your password" },
        { id: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "Re-enter your password" },
        { id: "fullName", label: "Full Name", type: "text", placeholder: "John Doe" },
        { id: "phone", label: "Phone", type: "text", placeholder: "0812345678" },
        { id: "address", label: "Address", type: "text", placeholder: "Bangkok" },
      ].map(({ id, label, type, placeholder }) => (
        <div key={id} className="flex flex-col gap-2">
          <div className="flex justify-between">
            <label className="font-medium cursor-pointer" htmlFor={id}>
              {label}
            </label>
            {mounted && errors[id as keyof RegisterFormData] && (
              <span className="text-red-500 text-sm">{errors[id as keyof RegisterFormData]?.message}</span>
            )}
          </div>
          <input
            id={id}
            type={type}
            {...formRegister(id as keyof RegisterFormData)}
            placeholder={placeholder}
            className="border p-3 rounded-lg"
          />
        </div>
      ))}

      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <label className="font-medium cursor-pointer" htmlFor="gender">
            Gender
          </label>
          {mounted && errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
        </div>
        <select id="gender" {...formRegister("gender")} className="border p-3 rounded-lg">
          <option value="">Select Gender</option>
          <option value="male">male</option>
          <option value="female">female</option>
          <option value="other">other</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-all mt-2 text-xl font-bold"
      >
        Register
      </button>
    </form>
  );
}

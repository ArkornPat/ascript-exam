"use server";
import { RegisterFormData, registerFormSchema } from "@/zod/exam-1";
import { z } from "zod";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "public", "exam-1", "exam-1.json");

export async function register(formData: RegisterFormData) {
    try {
        registerFormSchema.parse(formData);

        let existingData: RegisterFormData[] = [];
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, "utf-8");
            existingData = JSON.parse(fileContent);
        }

        existingData.push(formData);

        fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), "utf-8");

        return "ลงทะเบียนสำเร็จ";
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error(error.errors[0].message);
        }
        throw new Error("เกิดข้อผิดพลาด");
    }
}

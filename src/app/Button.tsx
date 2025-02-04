"use client"
import { useRouter } from "next/navigation";

const Button = () => {
    const router = useRouter();

    return (
        <div className="flex space-x-2">
            <button className="px-4 py-2 bg-blue-400 text-white rounded" onClick={() => router.push('/exam-1')}>
                Go to Exam 1
            </button>
            <button className="px-4 py-2 bg-blue-400 text-white rounded" onClick={() => router.push('/exam-2')}>
                Go to Exam 2
            </button>
            <button className="px-4 py-2 bg-blue-400 text-white rounded" onClick={() => router.push('/exam-3')}>
                Go to Exam 3
            </button>
        </div>
    );
};

export default Button;
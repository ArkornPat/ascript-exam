"use client";
import { useRouter } from "next/navigation";

const SuccessPage = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-lg text-center">
        <h2 className="mb-4 text-2xl text-gray-800">Register Success</h2>
        <button
          onClick={handleGoHome}
          className="px-6 py-2 text-lg bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;

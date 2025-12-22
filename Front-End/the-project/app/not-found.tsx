import Link from "next/link";
import { FaHandHoldingHeart } from "react-icons/fa";
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-white text-gray-800 p-6">
      <div className="absolute top-10 left-20 w-16 h-16">
        <FaHandHoldingHeart className="text-green-600 w-full h-full" />
      </div>
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-lg w-full flex flex-col items-center">
        
        <h1 className="text-7xl md:text-8xl font-extrabold text-[#5A4A42] mb-3">
           404
        </h1>

        <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-3">
          Page Not Found
        </h2>

        <p className="text-gray-600 text-center mb-6 leading-relaxed">
          This page isn’t available anymore.  
          Let’s get you back to a healthier path!
        </p>

        <Link
          href="/"
          className="bg-[#5A4A42] hover:bg-[#4a3b34] transition text-white py-3 px-8 rounded-xl "
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}

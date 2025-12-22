// "use client";
// import { signIn } from "next-auth/react";
// import { useSession } from "next-auth/react";
// import Link from "next/link";
// import { FaArrowLeft, FaGoogle, FaGithub } from "react-icons/fa";
// import SignOut from "../(componants)/signOut";
// import axios from "axios";
// import { useEffect, useState } from "react";

// export default function SignInPage() {
//   const { data, status } = useSession();

//   const handleSignInWithGithub = async () => {
//     await signIn("github");
//   };

//   const handleSignInWithGoogle = async () => {
//     await signIn("google");
//   };

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
// const handleSignInWithCredentials = async (e: React.FormEvent) => {
//   e.preventDefault();
//   setError("");

//   const res = await signIn("credentials", {
//     email,
//     password,
//     redirect: false, // لازم false
//   });

//   if (res?.error) {
//     setError("Invalid email or password");
//     return;
//   }

//   window.location.href = "/dashBoard";
// };    

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
//       {!data && (
//         <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
//           <h1 className="text-4xl text-gray-800 mb-6 font-bold">Sign In</h1>

//           <form onSubmit={handleSignInWithCredentials} className="flex flex-col gap-4 mb-6 text-left">
//             <div>
//               <label className="block text-gray-700 text-lg mb-2">Email</label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full p-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
//                 placeholder="example@email.com"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700 text-lg mb-2">Password</label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full p-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
//                 placeholder="********"
//                 required
//               />
//             </div>
//             {error && <p className="text-red-500 text-lg">{error}</p>}
//             <button
//               type="submit"
//               className="w-full bg-[#5A4A42] text-white py-3 rounded-lg text-2xl hover:bg-[#463930] transition font-bold"
//             >
//               Sign In
//             </button>
//           </form>

//           <div className="flex items-center gap-4 mb-6">
//             <div className="h-px bg-gray-300 flex-1"></div>
//             <span className="text-gray-500 text-lg">Or continue with</span>
//             <div className="h-px bg-gray-300 flex-1"></div>
//           </div>

//           <button
//             onClick={handleSignInWithGithub}
//             className="w-full bg-gray-900 text-white py-3 rounded-lg mb-4 text-2xl hover:bg-gray-800 transition flex items-center justify-center gap-2"
//           >
//             <FaGithub size={25} />
//             Sign in with GitHub
//           </button>

//           <button
//             onClick={handleSignInWithGoogle}
//             className="w-full bg-red-500 text-white py-3 rounded-lg text-2xl hover:bg-red-600 transition flex items-center justify-center gap-2"
//           >
//             <FaGoogle size={25} />
//             Sign in with Google
//           </button>
//         </div>
//       )}

//       {data && (
//         <>
//           <div className="text-3xl mb-4">You are signed in!</div>
//           <Link
//             href="/"
//             className="inline-flex items-center gap-2 px-6 py-3 bg-[#5c4b42] text-white rounded-lg shadow-lg hover:bg-[#463930] transition duration-300 text-2xl"
//           >
//             Go To Home Page <FaArrowLeft />
//           </Link>
//           <div className="text-3xl mt-4">or</div>
//           <SignOut />
//         </>
//       )}
//     </div>
//   );
// }
"use client";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FaArrowLeft, FaGoogle, FaGithub } from "react-icons/fa";
import SignOut from "../(componants)/signOut";
import axios from "axios";
import { useState } from "react";

export default function SignInPage() {
  const { data } = useSession();

  const handleSignInWithGithub = async () => {
    await signIn("github");
  };

  const handleSignInWithGoogle = async () => {
    await signIn("google");
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignInWithCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // 1) افتح الاندبوينت في الباك إند الأول
      const backendRes = await axios.post(
        "http://localhost:8000/api/auth/login",
        { email, password }
      );

      if (!backendRes.data?.user) {
        setError("Invalid email or password");
        return;
      }

      // 2) لو الاندبوينت رجّع البيانات بنجاح → signIn credentials
      const nextAuthRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (nextAuthRes?.error) {
        setError("Authentication failed");
        return;
      }

      // 3) نجاح → روّح الداشبورد
      window.location.href = "/dashBoard";
    } catch (err) {
      console.error(err);
      setError("Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      {!data && (
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
          <h1 className="text-4xl text-gray-800 mb-6 font-bold">Sign In</h1>

          <form
            onSubmit={handleSignInWithCredentials}
            className="flex flex-col gap-4 mb-6 text-left"
          >
            <div>
              <label className="block text-gray-700 text-lg mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="example@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-lg mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="********"
                required
              />
            </div>

            {error && <p className="text-red-500 text-lg">{error}</p>}

            <button
              type="submit"
              className="w-full bg-[#5A4A42] text-white py-3 rounded-lg text-2xl hover:bg-[#463930] transition font-bold"
            >
              Sign In
            </button>
          </form>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-gray-300 flex-1"></div>
            <span className="text-gray-500 text-lg">Or continue with</span>
            <div className="h-px bg-gray-300 flex-1"></div>
          </div>

          <button
            onClick={handleSignInWithGithub}
            className="w-full bg-gray-900 text-white py-3 rounded-lg mb-4 text-2xl hover:bg-gray-800 transition flex items-center justify-center gap-2"
          >
            <FaGithub size={25} />
            Sign in with GitHub
          </button>

          <button
            onClick={handleSignInWithGoogle}
            className="w-full bg-red-500 text-white py-3 rounded-lg text-2xl hover:bg-red-600 transition flex items-center justify-center gap-2"
          >
            <FaGoogle size={25} />
            Sign in with Google
          </button>
        </div>
      )}

      {data && (
        <>
          <div className="text-3xl mb-4">You are signed in!</div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#5c4b42] text-white rounded-lg shadow-lg hover:bg-[#463930] transition duration-300 text-2xl"
          >
            Go To Home Page <FaArrowLeft />
          </Link>

          <div className="text-3xl mt-4">or</div>

          <SignOut />
        </>
      )}
    </div>
  );
}

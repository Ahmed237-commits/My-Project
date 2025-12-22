"use client";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FaArrowLeft, FaGoogle, FaGithub } from "react-icons/fa";
import SignOut from "../(componants)/signOut";
import { useState } from "react";

export default function SignUpPage() {
    const { data } = useSession();

    const handleSignUpWithGithub = async () => {
        await signIn("github", { callbackUrl: "/dashBoard" });
    };

    const handleSignUpWithGoogle = async () => {
        await signIn("google", { callbackUrl: "/dashBoard" });
    };

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("http://localhost:8000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Registration failed");
            }

            // Auto login after register
            const loginRes = await signIn("credentials", {
                email,
                password,
                redirect: true,
                callbackUrl: "/dashBoard",
            });

            if (loginRes?.error) {
                throw new Error(loginRes.error);
            }

        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
            {!data && (
                <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
                    <h1 className="text-4xl text-gray-800 mb-6 font-bold">Create an Account</h1>

                    <form onSubmit={handleRegister} className="flex flex-col gap-4 mb-6 text-left">
                        <div>
                            <label className="block text-gray-700 text-lg mb-2">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                placeholder="Your Name"
                                required
                            />
                        </div>
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
                            <label className="block text-gray-700 text-lg mb-2">Password</label>
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
                            Sign Up
                        </button>
                    </form>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-px bg-gray-300 flex-1"></div>
                        <span className="text-gray-500 text-lg">Or join with</span>
                        <div className="h-px bg-gray-300 flex-1"></div>
                    </div>

                    <button
                        onClick={handleSignUpWithGithub}
                        className="w-full bg-gray-900 text-white py-3 rounded-lg mb-4 text-2xl hover:bg-gray-800 transition flex items-center justify-center gap-2"
                    >
                        <FaGithub size={25} />
                        Sign up with GitHub
                    </button>

                    <button
                        onClick={handleSignUpWithGoogle}
                        className="w-full bg-red-500 text-white py-3 rounded-lg text-2xl hover:bg-red-600 transition flex items-center justify-center gap-2"
                    >
                        <FaGoogle size={25} />
                        Sign up with Google
                    </button>

                    <div className="mt-6 text-xl text-gray-600">
                        Already have an account?{" "}
                        <Link href="/signIn" className="text-blue-600 hover:underline">
                            Sign In
                        </Link>
                    </div>
                </div>
            )}

            {data && (
                <>
                    <div className="text-3xl mb-4">You are already signed in!</div>
                    <Link
                        href="/dashBoard"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#5c4b42] text-white rounded-lg shadow-lg hover:bg-[#463930] transition duration-300 text-2xl"
                    >
                        Go To Dashboard <FaArrowLeft />
                    </Link>
                    <div className="text-3xl mt-4">or</div>
                    <SignOut />
                </>
            )}
        </div>
    );
}

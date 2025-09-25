// 'use client';

// import { useState, useEffect } from "react";
// import { useAuth } from "@/contexts/AuthContext";
// import { useRouter, usePathname } from "next/navigation";
// import Image from "next/image";
// import { FcGoogle } from "react-icons/fc";
// import { v4 as uuidv4 } from "uuid";
// import { signIn } from 'next-auth/react';

// export default function RegisterPage() {
//   const { user, loading } = useAuth();
//   const router = useRouter();
//   const pathname = usePathname();

//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState("");
//   const [redirecting, setRedirecting] = useState(false);

//   useEffect(() => {
//     if (!loading && user && pathname === "/register") {
//       setRedirecting(true);
//       router.replace("/"); // or redirect to chat/dashboard
//     }
//   }, [user, loading, pathname, router]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     if (password !== confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     // try {
//     //   //await register({ firstName, lastName, email, password });
//     //   router.replace("/login");
//     // } catch (err: any) {
//     //   setError(err.message || "Registration failed");
//     // }
//   };

//   if (loading || redirecting) {
//     return (
//       <div className="flex items-center justify-center w-screen h-screen bg-white">
//         <p className="text-lg text-gray-500">Processing…</p>
//       </div>
//     );
//   }

//   if (user) return null;

//   return (
//     <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
//       <div className="w-full max-w-sm p-8 bg-white shadow-lg rounded-2xl">
//         <div className="flex justify-center mb-4">
//           <Image src="/fin_sales_logo.jpg" alt="Logo" width={200} height={90} />
//         </div>

//         <h2 className="text-xl font-bold text-center text-gray-900">Create your account</h2>
//         <p className="mb-6 text-sm text-center text-gray-500">
//           Enter your details to get started.
//         </p>

//         {error && (
//           <p className="py-2 mb-2 text-sm text-center text-red-600 bg-red-100 rounded">
//             {error}
//           </p>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block mb-1 text-sm font-medium text-gray-700">
//               First Name
//             </label>
//             <input
//               type="text"
//               placeholder="John"
//               className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-black focus:outline-none"
//               value={firstName}
//               onChange={(e) => setFirstName(e.target.value)}
//               required
//             />
//           </div>

//           <div>
//             <label className="block mb-1 text-sm font-medium text-gray-700">
//               Last Name
//             </label>
//             <input
//               type="text"
//               placeholder="Doe"
//               className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-black focus:outline-none"
//               value={lastName}
//               onChange={(e) => setLastName(e.target.value)}
//               required
//             />
//           </div>

//           <div>
//             <label className="block mb-1 text-sm font-medium text-gray-700">
//               Email
//             </label>
//             <input
//               type="email"
//               placeholder="you@example.com"
//               className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-black focus:outline-none"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <div>
//             <label className="block mb-1 text-sm font-medium text-gray-700">
//               Password
//             </label>
//             <input
//               type="password"
//               placeholder="••••••••"
//               className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-black focus:outline-none"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>

//           <div>
//             <label className="block mb-1 text-sm font-medium text-gray-700">
//               Confirm Password
//             </label>
//             <input
//               type="password"
//               placeholder="••••••••"
//               className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-black focus:outline-none"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full py-2 text-white bg-gray-900 rounded-lg hover:bg-black"
//           >
//             Register
//           </button>

//           <div className="flex items-center py-2">
//             <div className="flex-grow border-t border-gray-300"></div>
//             <span className="mx-2 text-xs text-gray-400">OR</span>
//             <div className="flex-grow border-t border-gray-300"></div>
//           </div>

//           <button
//             type="button"
//             onClick={() =>
//               signIn("google", { prompt: "select_account", callbackUrl: "/" })
//             }
//             className="flex items-center justify-center w-full py-2 text-sm border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
//           >
//             <FcGoogle className="mr-2 text-lg" />
//             Sign up with Google
//           </button>
//         </form>

//         <p className="mt-6 text-sm text-center text-gray-500">
//           Already have an account?{" "}
//           <a
//             href="/login"
//             className="font-medium text-blue-600 hover:underline"
//           >
//             Login
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }

import React from "react";

const page = () => {
  return <div></div>;
};

export default page;

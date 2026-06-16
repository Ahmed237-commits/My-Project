import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { AuthOptions } from "next-auth";
import jwt from 'jsonwebtoken';

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      id?: string;
      role?: string;
    };
    backendToken?: string;
  }
  interface User {
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    backendToken?: string;
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const BACKEND_JWT_SECRET = process.env.BACKEND_JWT_SECRET;

// ✅ قائمة الإيميلات المسموح لها بالدخول للنظام كله
const ALLOWED_EMAILS = [
  "aethefifthofjuly@gmail.com",
];

const ALLOWED_ADMIN_EMAILS = [
  "aethefifthofjuly@gmail.com",
];

if (!BACKEND_JWT_SECRET) {
  console.error("❌ BACKEND_JWT_SECRET is missing in environment variables!");
}

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.AUTH_GITHUB_CLIENT_ID as string,
      clientSecret: process.env.AUTH_GITHUB_CLIENT_SECRET as string,
    }),

    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET as string,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // ✅ منع تسجيل الدخول بالإيميلات غير المسموح بها
        if (!ALLOWED_EMAILS.includes(credentials.email.toLowerCase().trim())) {
          console.log("❌ Login blocked - email not allowed:", credentials.email);
          return null;
        }

        try {
          const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          });

          const data = await res.json();

          if (!res.ok || !data.user) {
            console.log("❌ Login failed:", data.error);
            return null;
          }

          console.log("✅ Login successful for:", data.user.email);
          console.log("🆔 User ID:", data.user.id);
          
          return data.user;

        } catch (e) {
          console.error("❌ Authorize error:", e);
          return null;
        }
      }
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
callbacks: {
 async signIn({ user, account }) {
    try {
      if (!user?.email) return true;
      if (account?.provider === 'credentials') return true;

      const res = await fetch(`${API_BASE_URL}/api/auth/oauth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          image: user.image,
          provider: account?.provider,
        }),
      });

      const data = await res.json();
      console.log("📡 FULL OAuth data:", JSON.stringify(data));
      console.log("📡 user.role BEFORE:", user.role);
      
      if (data.user) {
        user.id = data.user.id;
        user.role = data.user.role;
      }
      
      console.log("📡 user.role AFTER:", user.role);
      return true;
    } catch (err) {
      console.error("❌ SignIn error:", err);
      return true;
    }
  },
async jwt({ token, user, account }) {
    console.log("🔨 JWT called - user:", user?.email, "role:", user?.role, "account:", account?.provider);
    console.log("🔨 JWT token before:", token.role);
    
    if (user) {
      token.id = user.id;
      token.role = user.role ?? "user";
      token.email = user.email;
      
      console.log("✅ Token role set to:", token.role);
      
      if (BACKEND_JWT_SECRET) {
        token.backendToken = jwt.sign(
          { id: user.id, email: user.email, role: token.role },
          BACKEND_JWT_SECRET,
          { expiresIn: '2d' }
        );
      }
    }
    
    console.log("🔨 JWT token after:", token.role);
    return token;
  },

  async session({ session, token }) {
    if (token && session.user) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.backendToken = token.backendToken;
      console.log("📦 Session role:", token.role);
    }
    return session;
  }
},
  pages: {
    signIn: "/signIn",
    signOut: "/signOut",
    error: "/signIn", // ✅ لو حصل خطأ في تسجيل الدخول، يرجع لصفحة تسجيل الدخول
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};

export default authOptions;
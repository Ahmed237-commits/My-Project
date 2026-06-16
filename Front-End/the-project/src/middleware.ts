// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const ALLOWED_ADMIN_EMAILS = [
  "aethefifthofjuly@gmail.com",
  // أضف إيميلات الأدمنز المسموح بها
];

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
    
    if (isAdminRoute) {
      // ✅ تحقق من الدور الأول
      if (token?.role !== 'admin') {
        console.log(`❌ Blocked by role: ${token?.email} (role: ${token?.role})`);
        return NextResponse.redirect(new URL("/signIn?error=not_admin", req.url));
      }
      
      // ✅ تحقق من الإيميل في القائمة المسموح بها
      if (token?.email && !ALLOWED_ADMIN_EMAILS.includes(token.email)) {
        console.log(`❌ Blocked by email: ${token.email} not in allowed list`);
        return NextResponse.redirect(new URL("/signIn?error=unauthorized_email", req.url));
      }
      
      console.log(`✅ Admin access granted: ${token.email}`);
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // ✅ لازم يكون مسجل دخول الأول
        if (!token) return false;
        
        // ✅ لو رايح لـ /admin، لازم يكون role = admin
        // (التحقق ده بيحصل قبل ما يدخل الصفحة أصلاً)
        return true; // هيتم التحقق الأقوى في الـ middleware function
      },
    },
  }
);

export const config = {
  matcher: ['/admin/:path*'],
};
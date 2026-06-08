'use client';
import React from 'react';
import Header from './Header';
import { usePathname } from 'next/navigation';

const Path = () => {
  const path = usePathname();

  // 1. تجهيز المنطق بعيداً عن الـ JSX (Separation of Concerns)
  const isHome = !path || path === '/';
  
  // تنظيف المسار (مثلاً: /about بيتحول لـ About)
  const cleanPath = path ? path.replace('/', '') : '';

  // 2. تحديد النصوص في متغيرات بسيطة
  const title = isHome 
    ? 'Welcome To Your Healthy Life' 
    : `Welcome In ${cleanPath} Page`;

  const description = isHome 
    ? 'Your Path To Mastering Healthy Living.' 
    : `You are now on the ${cleanPath} Page`;

  // 3. ريندر واحد فقط لكومبوننت واحد
  return (
    <div>
      <Header title={title} description={description} />
    </div>
  );
};

export default Path;
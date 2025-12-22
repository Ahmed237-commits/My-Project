'use client';
import React from 'react'
import Header from './Header'
import { usePathname } from 'next/navigation';
const Path = () => {
  const path = usePathname();
   
  return (
    <div>
      {path ? <Header title={path == '/' ? `Welcome To Your Healthy Life` : `Welcome In ${path.replace('/', '')} Page`} description={path == '/' ? `Your Path To Mastering Healthy Living.` : `You are now on the ${path.replace('/', '')} Page`} /> : <Header title="Welcome To Your Healthy Life" description={undefined}  />}
    </div>
  )
}

export default Path;

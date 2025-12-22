'use client';
import React from 'react'
import { signOut } from 'next-auth/react';
import Link from 'next/link';
const SignOut = () => {
  return (
    <div>
     <button onClick={() => signOut({callbackUrl:'/'})} className='bg-[#5A4A42] text-white p-2 rounded text-4xl cursor-pointer'>Sign Out</button> 
    </div>

)
}

export default SignOut;

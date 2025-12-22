'use client';
import React from 'react'
import { signOut } from 'next-auth/react';
const SignOut = () => {
  return (
    <div>
     <button onClick={() => signOut()} className='bg-[#5A4A42] text-white p-2 rounded text-4xl cursor-pointer'>Sign Out</button> 
    </div>

)
}

export default SignOut;

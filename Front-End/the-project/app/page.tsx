import Body from "./(componants)/Body";
import Footer from "./(componants)/Footer";
import React from "react";
import Scrolling from "./(componants)/Scrolling";
import { Suspense } from "react";
import ChatBot from "./(componants)/chatbot";
export default async function Home() {
  return (
    <>
      <main className="h-full">

        <Suspense fallback={<div className="flex text-4xl items-center justify-center">Loading...</div>}>
          <Body />
        </Suspense>

        <ChatBot /> 

      <Suspense fallback={<div className="flex text-4xl items-center justify-center">Loading...</div>}>
        <Scrolling />
      </Suspense>

      <Suspense fallback={<div className="flex text-4xl items-center justify-center">Loading...</div>}>
        <Footer />
      </Suspense>
      </main>
    </>
  );
}

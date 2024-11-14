"use client";
import Image from "next/image";
import Link from "next/link";

export default function Background() {
  return (
    <div className="relative w-full h-48 flex items-center justify-center overflow-hidden">
      {/* Top Curved Shape */}
      <div
        className="middle-curve absolute top-20 w-full h-24 bg-gray-700"
        style={{ clipPath: "ellipse(90% 100% at 50% 0%)" }}
        // className="top-curve absolute top-0 w-full h-32 bg-gradient-to-r from-blue-900 to-green-600"
        //      style={{ clipPath: 'ellipse(80% 100% at 50% 0%)' }}
      ></div>

      {/* Middle Curved Shape */}
      <div
        className="top-curve absolute flex top-0 w-full h-32 bg-gradient-to-r from-blue-900 to-green-600"
        style={{ clipPath: "ellipse(80% 100% at 50% 0%)" }}
      >
        <Link href="/">
          <h1 className=" max-sm:text-[20px] text-[40px] text-white p-5 font-bold tracking-tight">
            المساعد في متابعة العملية التعليمية
          </h1>
        </Link>
      </div>

      {/* Bottom Curved Shape */}
      {/* <div className="bottom-curve absolute top-40 w-full h-24 bg-gradient-to-r from-blue-900 to-green-600"
           style={{ clipPath: 'ellipse(80% 100% at 50% 0%)' }}></div> */}
      {/* Logo Circle */}
      <Link
        href="/"
        className="logo-circle absolute top-8 left-8 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg"
      >
        <Image
          src="/images/logo.png"
          alt="Ministry of Education Logo"
          fill
          priority={true}
        />
      </Link>
    </div>
  );
}

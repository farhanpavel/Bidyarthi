import React from "react";
import Image from "next/image";

export default function Footer() {
  return (
    <div className="font-bangla container mx-auto">
      <div>
        <Image
          src="/images/logo.png"
          width={200}
          height={100}
          alt="Logo"
          className="mx-auto"
        />
      </div>
      <div className="mt-6 sm:flex sm:flex-wrap sm:justify-center sm:flex-row">
        <ul className="sm:flex text-center gap-x-6 text-[#4a4a4a] font-rubik">
          <li className="hover:text-[#E54981] cursor-pointer hover:transition-colors hover:delay-150">
            যোগাযোগ
          </li>
          <li className="hover:text-[#E54981] cursor-pointer hover:transition-colors hover:delay-150">
            সর্বশেষ
          </li>
          <li className="hover:text-[#E54981] cursor-pointer hover:transition-colors hover:delay-150">
            সহায়তা
          </li>
          <li className="hover:text-[#E54981] cursor-pointer hover:transition-colors hover:delay-150">
            শর্তাবলী
          </li>
          <li className="hover:text-[#E54981] cursor-pointer hover:transition-colors hover:delay-150">
            গোপনীয়তা নীতি
          </li>
        </ul>
      </div>
      <div className="p-7 mt-5">
        <div className="border-t-[0.1px] p-4 mb-7 border-[#e0dede]">
          <div className="sm:flex sm:flex-wrap sm:justify-between font-rubik text-[#4a4a4a]">
            <div className="text-center">
              <p>কপিরাইট © ২০২৫ | Team X-OR, সমস্ত অধিকার সংরক্ষিত।</p>
            </div>
            <div>
              <ul className="sm:flex sm:flex-wrap text-center gap-x-7">
                <li className="hover:text-[#E54981] cursor-pointer hover:transition-colors hover:delay-150">
                  যোগাযোগ
                </li>
                <li className="hover:text-[#E54981] cursor-pointer hover:transition-colors hover:delay-150">
                  শর্তাবলী
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

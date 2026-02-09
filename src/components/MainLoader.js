"use client";

import Image from "next/image";

export default function MainLoader() {
  return (
    <div className="main-loader">
      <div className="main-loader-inner">
        <div className="main-loader-logo-wrapper">
          <div className="main-loader-ring">
            <div className="main-loader-ring-outer"></div>
            <div className="main-loader-ring-middle"></div>
          </div>
          <div className="main-loader-logo-container">
            <Image
              src="/assets/imagess/logo.svg"
              alt="ClickITCo Logo"
              width={80}
              height={80}
              className="main-loader-logo"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}



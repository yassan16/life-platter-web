"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";

export default function Home() {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch("/animations/gibli-tribute.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data));
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white">
      <h1 className="mb-8 text-3xl font-bold text-gray-800">
        Vercelとの連携成功!
      </h1>
      <div className="w-[400px] h-[400px]">
        {animationData && (
          <Lottie animationData={animationData} loop={true} />
        )}
      </div>
    </div>
  );
}

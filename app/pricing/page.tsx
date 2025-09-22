"use client";

import { Button } from "@heroui/react";

const page = () => {
  const handleSubscription = async (priceId: string) => {
    const res = await fetch("api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId }),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    }
  };
  const plans = [
    {
      name: "Starter",
      price: "$1",
      features: ["1 Video"],
      priceId: process.env.NEXT_PUBLIC_PRICE_ONE_DOLLAR!,
    },
    {
      name: "Pro",
      price: "$20",
      features: ["25 Video"],
      popular: true,
      priceId: process.env.NEXT_PUBLIC_PRICE_TWENTY_DOLLAR!,
    },
    {
      name: "Starter",
      price: "$99",
      features: ["150 Video"],
      priceId: process.env.NEXT_PUBLIC_PRICE_NINETYNINE_DOLLAR!,
    },
  ];

  return (
    <div className=" min-h-screen py-12 px-4">
      <div className="max-w-full mx-auto text-center">
        <h2 className=" text-4xl font-bold text-gray-100 mb-4">
          Simple & Transparent Pricing.
        </h2>
        <p className=" text-xl text-gray-600 mb-12">
          Choose the plan which suits you the most.
        </p>

        <div className=" grid grid-cols-3 gap-8">
          {plans.map((item, i) => (
            <div
              key={i}
              className={`bg-white rounded-lg p-6 relative ${
                item.popular ? "ring-2 ring-blue-500" : ""
              }`}
            >
              {item.popular && (
                <div className=" absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-br hover:opacity-80 text-white from-[#3352CC] to-[#1C2D70] px-4 py-1 rounded-full text-sm font-medium">
                  Most popular
                </div>
              )}
              <h3 className=" text-2xl font-bold text-gray-900">{item.name}</h3>
              <div className=" my-4 ">
                <span className=" text-4xl font-bold text-gray-900">
                  {item.price}
                </span>
                <span className=" text-gray-500">/one-time</span>
              </div>
              <ul className=" space-y-3 mb-8 ">
                {item.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <span className="text-blue-500 mr-3  ">✅</span>
                    <span className="text-gray-700 font-bold ">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handleSubscription(item.priceId)}
                className={`w-full ${
                  item.popular
                    ? "bg-gradient-to-br hover:opacity-80 text-white rounded-full from-[#3352CC] to-[#1C2D70] font-medium cursor-pointe"
                    : "bg-gray-800 hover:bg-gray-900 text-white cursor-pointer"
                }`}
              >
                {item.popular ? "Sign Up" : "Get Started"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;

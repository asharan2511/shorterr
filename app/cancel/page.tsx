import { Button } from "@/components/ui/button";
import { ArrowLeft, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const CancelPage = () => {
  return (
    <div className=" mih-h-screen bg-black flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md">
        <div className=" flex justify-center">
          <XCircle
            className="h-16 w-1/6 text-red-500 animate-pulse drop-shadow-lg
          "
          />
        </div>

        <div className="relative ">
          <Image
            src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZmNvOTBxaHFoa2FhbHVxc2V5M3Q5cTNhOWY5bGxxMGtsdHdyN3Q2ayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/G3VJcXs9x9DnlGqREv/giphy.gif"
            alt="Please pay"
            className="w-full rounded-lg border-4 border-gray-600 shadow-2xl"
          />
        </div>
        <div className=" space-y-4">
          <h1 className=" text-3xl font-bold text-white">
            Payment Canceled 💔
          </h1>
          <p className="text-gray-300 text-lg">
            No Worries! you can try again later.
          </p>
        </div>

        <Link href="/dashboard">
          <Button className=" bg-gradient-to-br hover:opacity-80 text-white rounded-full from-[#3352CC] to-[#1C2D70] font-medium flex items-center gap-2 justify-center w-48 mx-auto py-3 cursor-pointer">
            Go To Dashboard
            <ArrowLeft className=" h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CancelPage;

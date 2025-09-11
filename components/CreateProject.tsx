"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import Link from "next/link";
import { Cover } from "./ui/cover";
import { ShineBorder } from "./magicui/shine-border";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import TooltipCredits from "./CreditButton";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useRouter } from "next/navigation";
import { createVideo } from "@/app/actions/create";
interface props {
  user: string | null;
  credits: number;
}

const CreateProject = ({ user, credits }: props) => {
  const placeholders = [
    "What's the first rule of Fight Club",
    "Who is Virat Kohli",
    "How to assemble your own PC",
  ];

  const [prompt, setPrompt] = useState("");
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showCreditDialog, setShowCreditDialog] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setPrompt(e.target.value);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      return setTimeout(() => setShowCreditDialog(true), 700);
    }
    if (credits < 1) {
      return setTimeout(() => setShowCreditDialog(true), 700);
    }

    createVideo(prompt);
  };
  return (
    <div className="w-screen h-screen flex flex-col">
      {!user && (
        <div className="flex justify-end gap-1 mr-7 mt-5">
          <SignInButton>
            <Button className="bg-black border-gray-400 text-white rounded-full mx-2 hover:bg-gray-900 transition-colors duration-150 cursor-pointer">
              Sign In
            </Button>
          </SignInButton>
          <SignUpButton>
            <Button className=" bg-gradient-to-br hover:opacity-80 text-white rounded-full from -[#3352CC] to-[#1C2D70] font-medium cursor-pointer">
              Sign Up
            </Button>
          </SignUpButton>
        </div>
      )}
      {user && (
        <div className="flex  justify-end gap-1 mr-7 mt-5">
          <TooltipCredits credits={credits} />
          <Link href={"/dashbaord"}>
            <Button className=" bg-gradient-to-br hover:opacity-80 text-white rounded-full from -[#3352CC] to-[#1C2D70] font-medium mx-2 cursor-pointer">
              Dashboard
            </Button>
          </Link>
        </div>
      )}

      <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
        Generate Amazing Shorts <br />
        <div className="h-6"></div>
        at <Cover>Shorterr</Cover>
      </h1>
      <div className="flex justify-center mt-auto mb-[400px]">
        <div className="relative rounded-3xl w-[500px] overflow-hidden">
          <ShineBorder
            shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
            className="z-10"
          />
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={handleChange}
            onSubmit={onSubmit}
          />
        </div>
      </div>
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hello Therer!</DialogTitle>
            <DialogDescription>
              Please Sign In to create videos
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
        <DialogFooter>
          <SignInButton>
            <Button className="bg-black border-gray-400 text-white rounded-full mx-2 hover:bg-gray-900 transition-colors duration-150 cursor-pointer">
              Sign In
            </Button>
          </SignInButton>
          <SignUpButton>
            <Button className=" bg-gradient-to-br hover:opacity-80 text-white rounded-full from -[#3352CC] to-[#1C2D70] font-medium cursor-pointer">
              Sign Up
            </Button>
          </SignUpButton>
        </DialogFooter>
      </Dialog>
      <Dialog open={showCreditDialog} onOpenChange={setShowCreditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              <div className=" text-red-500">Out of credits</div>
            </DialogTitle>
            <DialogDescription>
              Please add some credits to create videos
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              className=" bg-gradient-to-br hover:opacity-80 text-white rounded-full from -[#3352CC] to-[#1C2D70] font-medium cursor-pointer"
              onClick={() => {
                router.push("/pricing");
                setShowCreditDialog(false);
              }}
            >
              Go to pricing
            </Button>
            <Button
              variant="outline"
              className="rounded-full cursor-pointer"
              onClick={() => setShowCreditDialog(false)}
            >
              close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateProject;

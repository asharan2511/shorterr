import React from "react";
import checkUser from "./lib/checkuser";
import CreateProject from "@/components/CreateProject";

import { userCredits } from "./lib/userCredit";

const page = async () => {
  const user = await checkUser();
  const credits = await userCredits();
  return (
    <div>
      <CreateProject user={user ?? null} credits={credits} />
    </div>
  );
};

export default page;

import { stripe } from "@/app/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user)
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const { priceId } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
      metadata: {
        userId: user.id,
        priceId: priceId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("error creating stripe sesssion/checkout!", error);
  }
}

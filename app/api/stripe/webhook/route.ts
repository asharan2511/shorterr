import { stripe } from "@/app/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/app/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;
  const webHookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webHookSecret)
    return new Response("Webhook Secret not present!", { status: 400 });

  const event = stripe.webhooks.constructEvent(body, signature, webHookSecret);

  console.log(event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const priceId = session.metadata?.priceId;

    const creditMap: Record<string, number> = {
      [process.env.NEXT_PUBLIC_PRICE_ONE_DOLLAR!]: 2,
      [process.env.NEXT_PUBLIC_PRICE_TWENTY_DOLLAR!]: 50,
      [process.env.NEXT_PUBLIC_PRICE_NINETYNINE_DOLLAR!]: 100,
    };

    const creditsToAdd = creditMap[priceId || ""] || 0;
    console.log(creditsToAdd);

    if (userId && creditsToAdd > 0) {
      await prisma.user.update({
        where: {
          userId: userId,
        },
        data: {
          credits: {
            increment: creditsToAdd,
          },
        },
      });
    }
  }

  return new Response("OK", { status: 200 });
}

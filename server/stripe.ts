import 'server-only'

import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export const isStripeConfigured = Boolean(stripeSecretKey);

let stripeClient: Stripe | null = null;
if (isStripeConfigured) {
  stripeClient = new Stripe(stripeSecretKey as string, {
    // https://github.com/stripe/stripe-node#configuration
    apiVersion: "2025-10-29.clover",
  });
} else {
  console.warn("[Stripe] STRIPE_SECRET_KEY is not configured. Billing features are disabled.");
}

// Keep `stripe` API surface for existing imports, but fail lazily when billing is used.
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    if (!stripeClient) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }

    const value = (stripeClient as any)[prop];
    return typeof value === "function" ? value.bind(stripeClient) : value;
  },
});

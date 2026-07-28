import Stripe from "stripe";

/** Server-side Stripe client, or null when no key is configured
 * (so the app still works without Stripe — falls back to direct booking). */
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

/** Price per session in the smallest currency unit (USD cents). */
export const SESSION_PRICE_CENTS = 12000;

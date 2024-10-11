const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { Clerk } = require("@clerk/clerk-sdk-node");
const clerk = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });
require("dotenv").config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.post("/create-checkout-session", async (req, res) => {
  const { priceId, userId } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/canceled`,
      client_reference_id: userId,
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.sendStatus(400);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.client_reference_id;

      try {
        await clerk.users.updateUser(userId, {
          publicMetadata: { isSubscribed: true },
        });
        console.log(`Updated user ${userId} subscription status`);
      } catch (error) {
        console.error("Error updating user metadata:", error);
      }
    }

    res.sendStatus(200);
  }
);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

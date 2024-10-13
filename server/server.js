require("dotenv").config();
const express = require("express");
const Stripe = require("stripe");
const { ClerkExpressWithAuth } = require("@clerk/clerk-sdk-node");
const cors = require("cors");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

// const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://your-production-frontend-url.com",
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Initialize Clerk middleware
const clerkAuth = ClerkExpressWithAuth({
  onError: (err, req, res) => {
    console.error("Clerk authentication error:", err);
    res
      .status(401)
      .json({ error: "Authentication failed", details: err.message });
  },
});

const PORT = process.env.PORT || 3001;

app.post("/create-checkout-session", clerkAuth, async (req, res) => {
  console.log("Received headers:", req.headers);
  const { priceId } = req.body;
  const userId = req.auth.userId;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  console.log("Received request:", { priceId, userId });

  stripe.checkout.sessions
    .create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/canceled`,
      client_reference_id: userId,
    })
    .then((session) => {
      console.log("Checkout session created:", session.id);
      res.json({ sessionId: session.id });
    })
    .catch((error) => {
      console.error("Error creating checkout session:", error.message);
      console.error("Error details:", error);
      res.status(500).json({
        error: "Failed to create checkout session",
        details: error.message,
      });
    });
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

app.get("/", async (req, res) => {
  res.send("Welcome to TrackFlix! Take back control over your subscriptions.");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

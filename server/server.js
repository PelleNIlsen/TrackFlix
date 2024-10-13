require("dotenv").config();
const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: "https://budget.pellenilsen.no", // Replace with your frontend URL
  optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));

app.get("/api/verify-session", async (req, res) => {
  const { session_id } = req.query;

  if (!session_id) {
    return res
      .status(400)
      .json({ success: false, message: "No session ID provided" });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      return res.json({
        success: true,
        message: "Payment successful",
        data: {
          amount: session.amount_total,
          currency: session.currency,
          customer: session.customer,
          paymentStatus: session.payment_status,
        },
      });
    } else {
      return res.json({
        success: false,
        message: "Payment not completed",
        data: {
          paymentStatus: session.payment_status,
        },
      });
    }
  } catch (error) {
    console.error("Error verifying Stripe session:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error verifying session" });
  }
});

app.get("/", (req, res) => {
  res.send("Welcome to TrackFlix - Take back control over your subscriptions.");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

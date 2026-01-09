import axios from "axios";

declare global {
  interface Window {
    Razorpay: any;
  }
}

// Load Razorpay script
export const loadRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Main payment handler
export const handlePayment = async (
  amount: number,
  cartItems: any[]
) => {
  try {
    // 1️⃣ Load Razorpay
    const isLoaded = await loadRazorpay();
    if (!isLoaded) {
      alert("Razorpay SDK failed to load");
      return;
    }

    // 2️⃣ Create order from backend
    const { data: order } = await axios.post(
      "http://localhost:5000/api/payment/create-order",
      { amount },
      { withCredentials: true }
    );

    console.log("BACKEND ORDER:", order);

    if (!order?.id) {
      alert("Failed to create Razorpay order");
      return;
    }

    // 3️⃣ Razorpay checkout options
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount, // amount in paise
      currency: "INR",
      name: "My Store",
      description: "Cart Checkout",
      order_id: order.id,

      handler: async (response: any) => {
        console.log("RAZORPAY RESPONSE:", response);

        const payload = {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          amount,
          cartItems,
        };

        try {
          const verifyRes = await axios.post(
            "http://localhost:5000/api/payment/verify-payment",
            payload,
            { withCredentials: true }
          );

          console.log("VERIFY RESPONSE:", verifyRes.data);
          alert("Payment Successful 🎉");

          // OPTIONAL: redirect / clear cart here
          // window.location.href = "/orders";

        } catch (err: any) {
         console.error("VERIFY ERROR FULL:", {
  status: err.response?.status,
  message: err.response?.data?.message,
  raw: err.response?.data,
});

          alert(err.response?.data?.message || "Order save failed");

        }
      },

      modal: {
        ondismiss: () => {
          console.log("Payment popup closed");
        },
      },

      theme: {
        color: "#000000",
      },
    };

    // 4️⃣ Open Razorpay popup
    const razorpay = new window.Razorpay(options);
    razorpay.open();

  } catch (error) {
    console.error("PAYMENT ERROR:", error);
    alert("Payment failed");
  }
};

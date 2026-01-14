import { loadRazorpay } from "@/components/Razorpay/LoadRazorpay"

export async function openRazorpayCheckout({
  orderId,
  amount,
  currency,
  collabId,
}: {
  orderId: string;
  amount: number;
  currency: string;
  collabId: string;
}) {
  const res = await loadRazorpay();
  if (!res) {
    alert("Razorpay SDK failed to load");
    return;
  }

  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    amount, // in paise
    currency,
    name: "BrandOrbit",
    description: "Creator Collaboration Payment",
    method: {
    upi: true,
    card: true,
    netbanking: true,
    wallet: true,
  },
    order_id: orderId,

    handler: async function (response: any) {
      // 🔐 STEP 3 — VERIFY PAYMENT
      const verifyRes = await fetch("/api/razorpay/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          collabId,
        }),
      });

      if (!verifyRes.ok) {
        alert("Payment verification failed");
        return;
      }

      alert("Payment successful 🎉");
      // 🔁 Refresh page / refetch collaboration
    },

    modal: {
      ondismiss: function () {
        console.log("Checkout closed");
      },
    },

    theme: {
      color: "#7b52d3",
    },
  };

  const rzp = new (window as any).Razorpay(options);
  rzp.open();
}

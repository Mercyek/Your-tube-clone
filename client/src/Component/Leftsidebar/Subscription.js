// Subscription.js
import React, { useState } from "react";
import axios from "axios";

const Subscription = ({ userId }) => {
  const [plan, setPlan] = useState(null);
  const [paymentClientSecret, setPaymentClientSecret] = useState("");

  const handlePlanSelect = async (selectedPlan) => {
    setPlan(selectedPlan);
    const response = await axios.post("/api/subscribe", { userId, plan: selectedPlan });
    setPaymentClientSecret(response.data.clientSecret);
  };

  const confirmPayment = async () => {
    await axios.post("/api/confirm-subscription", { userId, plan });
    alert("Subscription successful! Please check your email for the invoice.");
  };

  return (
    <div>
      <h2>Upgrade Your Plan</h2>
      <button onClick={() => handlePlanSelect("bronze")}>Bronze - ₹10 (7 min)</button>
      <button onClick={() => handlePlanSelect("silver")}>Silver - ₹50 (10 min)</button>
      <button onClick={() => handlePlanSelect("gold")}>Gold - ₹100 (Unlimited)</button>
      {paymentClientSecret && (
        <button onClick={confirmPayment}>Confirm Payment</button>
      )}
    </div>
  );
};

export default Subscription;

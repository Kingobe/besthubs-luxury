import { useState } from "react";
import { useSession } from "next-auth/react";

export default function Checkout() {
  const { data: session } = useSession();
  const [amount, setAmount] = useState("");
  const [itemName, setItemName] = useState("Shisha Bowl");
  const [rentalDays, setRentalDays] = useState("7");
  const [message, setMessage] = useState("");

  if (!session) return <div>Please sign in</div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Processing...");
    try {
      const res = await fetch("/api/payfast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          item_name: itemName,
          user_email: session.user.email,
          rental_days: rentalDays,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "https://www.payfast.co.za/eng/process";
        Object.keys(data).forEach((key) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = data[key];
          form.appendChild(input);
        });
        document.body.appendChild(form);
        form.submit();
      } else {
        setMessage("Error: " + data.error);
      }
    } catch (error) {
      setMessage("Error: Failed to process payment");
    }
  };

  return (
    <div className='max-w-md mx-auto p-6 bg-[#1a1a1a] text-[#d4af37]'>
      <h1 className='text-2xl mb-4'>Checkout</h1>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label className='block mb-1'>Amount (ZAR)</label>
          <input
            type='number'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className='w-full p-2 bg-[#2a2a2a] text-[#d4af37]'
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-1'>Item</label>
          <input
            type='text'
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className='w-full p-2 bg-[#2a2a2a] text-[#d4af37]'
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-1'>Rental Days</label>
          <input
            type='number'
            value={rentalDays}
            onChange={(e) => setRentalDays(e.target.value)}
            className='w-full p-2 bg-[#2a2a2a] text-[#d4af37]'
            required
          />
        </div>
        <button
          type='submit'
          className='w-full p-2 bg-[#d4af37] text-[#1a1a1a]'
        >
          Pay with Payfast
        </button>
      </form>
      {message && <p className='mt-4'>{message}</p>}
    </div>
  );
}

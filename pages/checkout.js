import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function Checkout() {
  const { data: session } = useSession();
  const [amount, setAmount] = useState('100');
  const [itemName, setItemName] = useState('Shisha Bowl');
  const [days, setDays] = useState('7');

  if (!session) {
    return <p>Please sign in to proceed with checkout.</p>;
  }

  const handlePayment = async () => {
    const response = await fetch('/api/payfast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, item_name: itemName, days }),
    });
    const { redirectUrl } = await response.json();
    window.location.href = redirectUrl;
  };

  return (
    <div>
      <h1>Checkout</h1>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
      />
      <input
        type="text"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        placeholder="Item Name"
      />
      <input
        type="number"
        value={days}
        onChange={(e) => setDays(e.target.value)}
        placeholder="Rental Days"
      />
      <button onClick={handlePayment}>Pay with Payfast</button>
    </div>
  );
}

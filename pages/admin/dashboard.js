import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);

  if (!session || !session.user.isAdmin) return <div>Access denied</div>;

  useEffect(() => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch(() => setOrders([]));
  }, []);

  return (
    <div className='max-w-4xl mx-auto p-6 bg-[#1a1a1a] text-[#d4af37]'>
      <h1 className='text-3xl mb-4'>Admin Dashboard</h1>
      <h2 className='text-2xl mb-2'>Recent Orders</h2>
      <table className='w-full mt-4 border-collapse'>
        <thead>
          <tr className='bg-[#2a2a2a]'>
            <th className='p-2'>Order ID</th>
            <th className='p-2'>Email</th>
            <th className='p-2'>Item</th>
            <th className='p-2'>Amount</th>
            <th className='p-2'>Status</th>
            <th className='p-2'>End Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.orderId} className='border-b border-[#d4af37]/20'>
              <td className='p-2'>{order.orderId}</td>
              <td className='p-2'>{order.email}</td>
              <td className='p-2'>{order.item}</td>
              <td className='p-2'>{order.amount}</td>
              <td className='p-2'>{order.status}</td>
              <td className='p-2'>{order.endDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

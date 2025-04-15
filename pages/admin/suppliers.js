import { useSession } from 'next-auth/react';

export default function Suppliers() {
  const { data: session } = useSession();
  if (!session || !session.user.isAdmin) return <div>Access denied</div>;

  const suppliers = [
    { name: 'Al Fakher', status: 'Active', lastOrder: '2025-04-10', contact: 'supply@alfakher.com' },
    { name: 'Starbuzz', status: 'Pending', lastOrder: '2025-04-05', contact: 'info@starbuzz.com' },
    { name: 'Fumari', status: 'Active', lastOrder: '2025-04-12', contact: 'sales@fumari.com' },
  ];

  return (
    <div className='max-w-4xl mx-auto p-6 bg-[#1a1a1a] text-[#d4af37]'>
      <h1 className='text-3xl mb-4'>Manage Suppliers</h1>
      <table className='w-full mt-4 border-collapse'>
        <thead>
          <tr className='bg-[#2a2a2a]'>
            <th className='p-2'>Name</th>
            <th className='p-2'>Status</th>
            <th className='p-2'>Last Order</th>
            <th className='p-2'>Contact</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((s) => (
            <tr key={s.name} className='border-b border-[#d4af37]/20'>
              <td className='p-2'>{s.name}</td>
              <td className='p-2'>{s.status}</td>
              <td className='p-2'>{s.lastOrder}</td>
              <td className='p-2'>{s.contact}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

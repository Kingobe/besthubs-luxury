import { useSession } from 'next-auth/react';

export default function Admin() {
  const { data: session } = useSession();

  if (!session || !session.user.isAdmin) {
    return <p>Access Denied</p>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {session.user.email}</p>
      <ul>
        <li><a href="/admin/upload-stock">Upload Stock</a></li>
        <li>Manage Orders</li>
      </ul>
    </div>
  );
}

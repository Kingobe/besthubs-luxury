import { useState } from 'react';
import { useRouter } from 'next/router';
import clientPromise from '../../lib/mongodb';
import bcrypt from 'bcryptjs';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const client = await clientPromise;
      const db = client.db();
      const existingUser = await db.collection('users').findOne({ email });
      if (existingUser) {
        setError('User already exists');
        return;
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.collection('users').insertOne({
        email,
        password: hashedPassword,
        isAdmin: email === 'obe.dube@digisphere.co.za' ? true : false,
      });
      router.push('/auth/signin');
    } catch (err) {
      setError('Sign-up failed');
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSignUp}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      {error && <p>{error}</p>}
      <p>
        Already have an account? <a href="/auth/signin">Sign In</a>
      </p>
    </div>
  );
}

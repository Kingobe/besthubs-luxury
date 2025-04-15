import Link from "next/link";

export default function Error({ message = "An error occurred during authentication" }) {
  return (
    <div>
      <h1>Authentication Error</h1>
      <p>{message}</p>
      <p>
        <Link href="/">Go to Home</Link>
      </p>
      <p>
        <Link href="/auth/signin/">Try Signing In Again</Link>
      </p>
    </div>
  );
}

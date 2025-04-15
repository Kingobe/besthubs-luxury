import { useRouter } from "next/router";
import { useEffect } from "react";

export default function SigninRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.push("/auth/signin");
  }, [router]);
  return <div>Redirecting to sign-in...</div>;
}

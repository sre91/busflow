import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LockKeyhole, Mail } from "lucide-react";

import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Label from "../components/ui/Label";

import { loginUser } from "../api/authApi";
import { useAppDispatch } from "../app/hooks";
import { setCredentials } from "../features/auth/authSlice";

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Email and password are required.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const result = await loginUser({
        email,
        password,
      });

      dispatch(
        setCredentials({
          user: result.user,
          token: result.token,
        }),
      );

      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);

      setErrorMessage("Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex max-w-7xl justify-center px-6 py-16">
        <Card className="w-full max-w-md">
          <div className="text-center">
            <Badge variant="primary">Welcome back</Badge>

            <h1 className="mt-4 text-3xl font-bold text-primary-dark">
              Login to BusFlow 🚌
            </h1>

            <p className="mt-2 text-muted">Sign in to manage your bookings.</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <Label htmlFor="email">Email address</Label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                />

                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email"
                  className="pl-11"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                />

                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="pl-11"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
                {errorMessage}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || !email.trim() || !password.trim()}
            >
              {isLoading ? "Signing in..." : "Login"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-primary hover:text-primary-dark"
            >
              Create one
            </Link>
          </div>
        </Card>
      </section>
    </main>
  );
}

export default LoginPage;

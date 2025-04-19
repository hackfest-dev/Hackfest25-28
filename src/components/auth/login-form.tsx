"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Store, Truck } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("shopkeeper");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication delay
    setTimeout(() => {
      setIsLoading(false);
      // Redirect to the appropriate dashboard based on role
      router.push(`/dashboard/${role}`);
    }, 1500);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Sign in</CardTitle>
        <CardDescription>
          Enter your credentials to access your dashboard
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="text-muted-foreground h-4 w-4" />
                ) : (
                  <Eye className="text-muted-foreground h-4 w-4" />
                )}
                <span className="sr-only">
                  {showPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Account Type</Label>
            <RadioGroup
              defaultValue="shopkeeper"
              className="grid grid-cols-2 gap-4"
              onValueChange={setRole}
            >
              <div>
                <RadioGroupItem
                  value="shopkeeper"
                  id="shopkeeper"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="shopkeeper"
                  className="border-muted bg-popover hover:bg-accent hover:text-accent-foreground flex flex-col items-center justify-between rounded-md border-2 p-4 peer-data-[state=checked]:border-emerald-500 [&:has([data-state=checked])]:border-emerald-500"
                >
                  <Store className="mb-3 h-6 w-6" />
                  Shopkeeper
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="manufacturer"
                  id="manufacturer"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="manufacturer"
                  className="border-muted bg-popover hover:bg-accent hover:text-accent-foreground flex flex-col items-center justify-between rounded-md border-2 p-4 peer-data-[state=checked]:border-emerald-500 [&:has([data-state=checked])]:border-emerald-500"
                >
                  <Truck className="mb-3 h-6 w-6" />
                  Manufacturer
                </Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
          <div className="text-muted-foreground text-center text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="text-emerald-600 hover:underline">
              Register here
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}

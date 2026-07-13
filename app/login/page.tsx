"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [current, setCurrent] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setCurrent(localStorage.getItem("boxbox-user"));
  }, []);

  function login() {
    const trimmed = name.trim();
    if (!trimmed) return;
    localStorage.setItem("boxbox-user", trimmed);
    router.push("/");
    router.refresh();
  }

  function logout() {
    localStorage.removeItem("boxbox-user");
    setCurrent(null);
  }

  return (
    <div className="container mx-auto max-w-sm px-4 pb-12 pt-32 md:pt-40">
      <h1 className="mb-1 text-3xl font-black uppercase tracking-tight">
        {current ? `Hey, ${current}` : "Login"}
      </h1>
      <p className="mb-6 text-sm text-muted-foreground">
        {current
          ? "Your ratings and reviews are saved on this device."
          : "Local demo account — pick a username. Ratings are stored in your browser."}
      </p>
      {current ? (
        <Button variant="outline" onClick={logout}>
          Log out
        </Button>
      ) : (
        <div className="space-y-3 rounded-xl bg-card p-5 ring-1 ring-border/50">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            placeholder="Username"
            className="w-full rounded-lg border bg-background p-3 text-sm outline-none transition-colors focus:border-ring"
          />
          <Button className="w-full" onClick={login} disabled={!name.trim()}>
            Start rating races
          </Button>
        </div>
      )}
    </div>
  );
}

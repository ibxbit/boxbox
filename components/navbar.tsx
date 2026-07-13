"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StreakFlame } from "@/components/streak-flame";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [user, setUser] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setUser(localStorage.getItem("boxbox-user"));
  }, [pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="fixed inset-x-0 top-0 z-40 pointer-events-none pt-4 md:pt-6">
      <div className="container mx-auto px-4 xl:max-w-5xl">
        <div className="pointer-events-auto relative flex h-12 w-full items-center justify-between rounded-xl border border-black/5 dark:border-white/10 bg-background dark:bg-background/55 px-3 shadow-2xl dark:backdrop-blur-2xl transition-all duration-300 md:h-14 md:px-6">
          <div className="mr-auto flex items-center gap-6 md:gap-8">
            <NavbarLogo />
            <div className="hidden items-center gap-6 sm:flex">
              <NavbarLinks />
            </div>
          </div>

          {/* Right Side: Streak, Auth & Theme */}
          <div className="flex items-center gap-2">
            <StreakFlame />
            <div className="hidden items-center gap-2 sm:flex">
              <NavbarAuth user={user} />
              <div className="mx-1 h-4 w-[1px] bg-border" />
              <ThemeToggle />
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden text-muted-foreground hover:!bg-transparent hover:text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="pointer-events-auto absolute left-4 right-4 top-[calc(100%+0.5rem)] rounded-xl border border-black/5 dark:border-white/10 bg-background/95 p-3 shadow-2xl backdrop-blur-2xl dark:bg-background/80 sm:hidden">
            <div className="flex flex-col gap-1">
              <NavbarLinks isMobile />
              <div className="my-2 h-px w-full bg-border" />
              <div className="flex items-center justify-between px-1">
                <NavbarAuth user={user} isMobile />
                <div className="pr-2">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function NavbarLogo() {
  return (
    <Link href="/" className="group flex items-center gap-2">
      <div className="h-1.5 w-1.5 rounded-full bg-foreground transition-all duration-300 group-hover:scale-[1.5]" />
      <span className="text-base font-black uppercase tracking-tighter md:text-lg">BOXBOX</span>
    </Link>
  );
}

function NavLink({
  href,
  isActive,
  children,
}: {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group/link inline-flex items-center py-2 text-xs font-black uppercase tracking-widest transition-all duration-300 hover:text-foreground",
        isActive ? "text-foreground" : "text-muted-foreground",
      )}
    >
      <span className="relative">
        {children}
        <span
          className={cn(
            "absolute -bottom-1 left-0 h-px bg-foreground transition-all duration-300",
            isActive ? "w-full" : "w-0 group-hover/link:w-full",
          )}
        />
      </span>
    </Link>
  );
}

function MobileNavLink({
  href,
  isActive,
  children,
}: {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex w-full items-center rounded-lg px-3 py-3 text-xs font-black uppercase tracking-widest transition-all duration-300",
        isActive
          ? "bg-foreground/5 text-foreground"
          : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}

function NavbarLinks({ isMobile }: { isMobile?: boolean }) {
  const pathname = usePathname();
  const LinkComponent = isMobile ? MobileNavLink : NavLink;

  return (
    <>
      <LinkComponent href="/" isActive={pathname === "/" || pathname.startsWith("/race")}>
        Home
      </LinkComponent>
      <LinkComponent
        href="/discover"
        isActive={pathname.startsWith("/discover") || pathname.startsWith("/season")}
      >
        Discover
      </LinkComponent>
      <LinkComponent href="/garage" isActive={pathname.startsWith("/garage")}>
        Garage
      </LinkComponent>
      <LinkComponent href="/rules" isActive={pathname.startsWith("/rules")}>
        Rules
      </LinkComponent>
      <LinkComponent href="/profile" isActive={pathname.startsWith("/profile")}>
        Profile
      </LinkComponent>
    </>
  );
}

function NavbarAuth({ user, isMobile }: { user: string | null; isMobile?: boolean }) {
  const pathname = usePathname();
  const LinkComponent = isMobile ? MobileNavLink : NavLink;

  return (
    <LinkComponent href="/login" isActive={pathname === "/login"}>
      {user ?? "Login"}
    </LinkComponent>
  );
}

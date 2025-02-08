'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, ChevronDown, UserCircle } from 'lucide-react';
import Image from 'next/image';

export default function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST'
      });
      
      if (res.ok) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className=" top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image 
            src="/favicon.ico" 
            alt="Hamy" 
            width={32} 
            height={32} 
            className="rounded-sm"
          />
          <span className="font-semibold text-2xl bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
            Hamy
          </span>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <User className="h-4 w-4" />
              Account
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem asChild>
              <Link href="/my-profile" className="cursor-pointer flex items-center">
                <UserCircle className="mr-2 h-4 w-4" />
                View Profile
              </Link>
            </DropdownMenuItem>
            {/* edit profile */}
            <DropdownMenuItem asChild>
              <Link href="/profile/edit" className="cursor-pointer flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
            </DropdownMenuItem>
            {/* <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem> */}
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
} 
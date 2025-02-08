import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Home,
  Heart,
  MessageCircle,
  Search,
  User,
} from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  const navigation = [
    {
      name: 'Home',
      href: '/dashboard',
      icon: Home,
      active: pathname === '/dashboard'
    },
    // {
    //   name: 'Discover',
    //   href: '/discover',
    //   icon: Search,
    //   active: pathname === '/discover'
    // },
    {
      name: 'Messages',
      href: '/messages',
      icon: MessageCircle,
      active: pathname.startsWith('/messages')
    },
    // {
    //   name: 'Matches',
    //   href: '/matches',
    //   icon: Heart,
    //   active: pathname === '/matches'
    // },
    {
      name: 'Profile',
      href: '/my-profile',
      icon: User,
      active: pathname === '/my-profile'
    }
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center px-4">
        <ul className="flex w-full justify-around">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link href={item.href} passHref>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "flex flex-col h-auto px-3 py-2 hover:bg-transparent",
                    item.active ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5 mb-1 transition-colors",
                    item.active && "animate-pulse"
                  )} />
                  <span className="text-xs font-medium">{item.name}</span>
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  );
} 
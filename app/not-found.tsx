'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-4">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold tracking-tighter sm:text-8xl">
            404
          </h1>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Page not found
          </h2>
          <p className="text-base text-muted-foreground mb-8">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. The page might have been removed or the link might be broken.
          </p>
          <p className="text-muted-foreground">
            We can&apos;t find the page you&apos;re looking for.
          </p>
        </div>
        <div className="flex flex-col gap-2 min-[400px]:flex-row">
          <Button 
            variant="default" 
            size="lg" 
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            asChild
          >
            <Link href="/dashboard">
              Return to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 
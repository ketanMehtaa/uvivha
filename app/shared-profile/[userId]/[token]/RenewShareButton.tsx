"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface RenewShareButtonProps {
  userId: string;
  token: string;
}

export function RenewShareButton({ userId, token }: RenewShareButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRenew = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/profile/share/${userId}/${token}/renew`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to renew share link");
      }

      toast.success("Share link renewed successfully!");
      router.refresh(); // Refresh the page to show updated content

    } catch (error) {
      toast.error("Failed to renew share link");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleRenew} disabled={isLoading}>
      Renew Share Link
    </Button>
  );
} 
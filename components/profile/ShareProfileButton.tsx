import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Share2, RefreshCw } from "lucide-react";
import { format } from "date-fns";

interface ShareStatus {
  token: string;
  userId: string;
  expiresAt: string;
  viewCount: number;
}

export function ShareProfileButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shareStatus, setShareStatus] = useState<ShareStatus | null>(null);

  // Fetch current share status
  useEffect(() => {
    const fetchShareStatus = async () => {
      try {
        const response = await fetch("/api/profile/share", {
          method: "GET",
        });
        if (response.ok) {
          const data = await response.json();
          setShareStatus(data);
          if (data.token) {
            setShareUrl(`${window.location.origin}/shared-profile/${data.userId}/${data.token}`);
          }
        }
      } catch (error) {
        console.error("Failed to fetch share status:", error);
      }
    };

    fetchShareStatus();
  }, []);

  const generateShareLink = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/profile/share", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to generate share link");
      }

      const data = await response.json();
      const shareLink = `${window.location.origin}/shared-profile/${data.userId}/${data.token}`;
      setShareUrl(shareLink);
      setShareStatus(data);
      setIsOpen(true);
    } catch (error) {
      toast.error("Failed to generate share link");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renewShareLink = async () => {
    if (!shareStatus?.token) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/profile/share/${shareStatus.userId}/${shareStatus.token}/renew`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to renew share link");
      }

      const data = await response.json();
      setShareStatus(data);
      toast.success("Share link renewed successfully!");
    } catch (error) {
      toast.error("Failed to renew share link");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link");
      console.error(error);
    }
  };

  const isExpired = shareStatus?.expiresAt ? new Date(shareStatus.expiresAt) < new Date() : false;

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => setIsOpen(true)}
        disabled={isLoading}
        variant="outline"
        className="gap-2"
      >
        <Share2 className="h-4 w-4" />
        Share Profile
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Your Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {shareStatus ? (
              <>
                <div className="text-sm space-y-2">
                  <p className="text-muted-foreground">
                    Your profile has been viewed {shareStatus.viewCount} times
                  </p>
                  <p className={isExpired ? "text-destructive" : "text-muted-foreground"}>
                    Link {isExpired ? "expired" : "expires"} on {format(new Date(shareStatus.expiresAt), "PPP")}
                  </p>
                </div>
                {isExpired && (
                  <Button 
                    onClick={renewShareLink} 
                    disabled={isLoading}
                    variant="secondary"
                    className="w-full gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Renew Link for 30 Days
                  </Button>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Generate a link to share your profile. The link will be valid for 30 days.
              </p>
            )}
            
            <div className="flex gap-2">
              <Input
                value={shareUrl}
                readOnly
                placeholder={shareStatus ? "Loading..." : "Click Generate to create share link"}
                className="flex-1"
                onClick={(e) => e.currentTarget.select()}
              />
              {shareUrl ? (
                <Button onClick={copyToClipboard} variant="secondary">
                  Copy
                </Button>
              ) : (
                <Button onClick={generateShareLink} disabled={isLoading}>
                  Generate
                </Button>
              )}
            </div>
            
            <p className="text-xs text-muted-foreground">
              Anyone with this link can view your profile information for the next 30 days.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
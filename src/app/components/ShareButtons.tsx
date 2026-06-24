"use client";
import { Share2, ExternalLink, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ShareButtonsProps {
  title: string;
}

export const ShareButtons = ({ title }: ShareButtonsProps) => {
  const [copyMessage, setCopyMessage] = useState<string>("");

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(currentUrl);
    setCopyMessage("Link copied!");
    window.setTimeout(() => setCopyMessage(""), 2000);
  };

  const openWindow = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Button type="button" variant="secondary" className="justify-center gap-2" onClick={() => openWindow(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}`)}>
        <Share2 className="h-4 w-4" />
        Twitter
      </Button>
      <Button type="button" variant="secondary" className="justify-center gap-2" onClick={() => openWindow(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`)}>
        <ExternalLink className="h-4 w-4" />
        LinkedIn
      </Button>
      <Button type="button" variant="secondary" className="justify-center gap-2" onClick={() => openWindow(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`)}>
        <ExternalLink className="h-4 w-4" />
        Facebook
      </Button>
      <Button type="button" variant="secondary" className="justify-center gap-2" onClick={handleCopyLink}>
        <LinkIcon className="h-4 w-4" />
        Copy link
      </Button>
      {copyMessage ? <p className="col-span-full text-sm text-green-300">{copyMessage}</p> : null}
    </div>
  );
};

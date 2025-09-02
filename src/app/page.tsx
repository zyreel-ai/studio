"use client";

import { useState } from 'react';
import { QrCode, Share2, Copy, Check } from 'lucide-react';
import Image from 'next/image';

import { userProfile } from '@/lib/data';
import DigitalCard from '@/components/digital-card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  const { toast } = useToast();
  const [hasCopied, setHasCopied] = useState(false);
  const shareableLink = typeof window !== 'undefined' ? `${window.location.origin}/c/${userProfile.id}` : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(shareableLink).then(() => {
      setHasCopied(true);
      toast({
        title: 'Link Copied!',
        description: 'Your business card link is copied to your clipboard.',
      });
      setTimeout(() => setHasCopied(false), 2000);
    });
  };
  
  return (
    <div className="flex flex-col items-center gap-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Your Digital Card</h1>
      
      <Card className="w-full max-w-md overflow-hidden border-2 shadow-lg">
        <CardContent className="p-0">
          <DigitalCard user={userProfile} />
        </CardContent>
      </Card>

      <div className="flex w-full max-w-md flex-col gap-4 sm:flex-row">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <QrCode className="mr-2 h-4 w-4" />
              Show QR Code
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Scan to Connect</DialogTitle>
              <DialogDescription>
                Others can scan this code to save your contact details instantly.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-center rounded-lg bg-background p-4">
              <Image
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(shareableLink)}&bgcolor=F4F6F8`}
                width={250}
                height={250}
                alt="QR Code"
                className="rounded-lg"
                data-ai-hint="qr code"
              />
            </div>
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Input
                  id="link"
                  defaultValue={shareableLink}
                  readOnly
                  className="bg-muted"
                />
              </div>
              <Button type="button" size="icon" onClick={handleCopy}>
                <span className="sr-only">Copy</span>
                {hasCopied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <Button onClick={handleCopy} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
          <Share2 className="mr-2 h-4 w-4" />
          Share Card
        </Button>
      </div>
    </div>
  );
}

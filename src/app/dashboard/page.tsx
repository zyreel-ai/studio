
"use client";

import { useState, useEffect } from 'react';
import { QrCode, Share2, Copy, Check, BarChart3, Users, Eye } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';
import DigitalCard from '@/components/digital-card';
import { Skeleton } from '@/components/ui/skeleton';
import { analyticsService } from '@/lib/firebase/analytics';
import { authService } from '@/lib/firebase/auth';

export default function DashboardPage() {
  const { toast } = useToast();
  const [hasCopied, setHasCopied] = useState(false);
  const { user, userProfile } = useAuth();
  const [contactCount, setContactCount] = useState(0);

  useEffect(() => {
    if (user) {
      const fetchContacts = async () => {
        const userContacts = await authService.getContacts(user.uid);
        setContactCount(userContacts.length);
      };
      fetchContacts();
    }
  }, [user]);
  
  if (!userProfile) {
    return <DashboardSkeleton />;
  }

  const shareableLink = typeof window !== 'undefined' ? `${window.location.origin}/c/${userProfile.id}` : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(shareableLink).then(() => {
      setHasCopied(true);
      analyticsService.logEvent('share', { method: 'copy_link', content_type: 'business_card' });
      toast({
        title: 'Link Copied!',
        description: 'Your business card link is copied to your clipboard.',
      });
      setTimeout(() => setHasCopied(false), 2000);
    });
  };
  
  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {userProfile.name}. Here's a summary of your activity.</p>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Contacts
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contactCount}</div>
            <p className="text-xs text-muted-foreground">
              connections made
            </p>
          </CardContent>
        </Card>
        <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Card Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
             <p className="text-xs text-muted-foreground">
              times your card has been viewed
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Your Digital Card</h2>
             <Card className="overflow-hidden border-2 shadow-lg">
                <CardContent className="p-0">
                <DigitalCard user={userProfile} />
                </CardContent>
            </Card>
        </div>

        <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Sharing Options</h2>
             <Card>
                <CardHeader>
                    <CardTitle>Share Your Card</CardTitle>
                    <CardDescription>Let others scan your QR code or use your link to connect.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-full justify-start">
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
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(shareableLink)}&bgcolor=E1EDF7`}
                                width={250}
                                height={250}
                                alt="QR Code"
                                className="rounded-lg"
                                data-ai-hint="qr code"
                            />
                            </div>
                        </DialogContent>
                    </Dialog>

                    <div className="flex items-center space-x-2">
                        <Input
                            id="link"
                            defaultValue={shareableLink}
                            readOnly
                            className="bg-muted flex-1"
                        />
                        <Button type="button" size="icon" onClick={handleCopy} className="shrink-0">
                            <span className="sr-only">Copy</span>
                            {hasCopied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-8 animate-pulse">
        <div className="space-y-2">
            <Skeleton className="h-10 w-1/2 rounded-md" />
            <Skeleton className="h-5 w-3/4 rounded-md" />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-28 w-full rounded-lg" />
            <Skeleton className="h-28 w-full rounded-lg" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
                <Skeleton className="h-8 w-1/3 rounded-md" />
                <Skeleton className="aspect-[16/9] w-full rounded-xl" />
            </div>
             <div className="space-y-4">
                <Skeleton className="h-8 w-1/3 rounded-md" />
                <Skeleton className="h-40 w-full rounded-lg" />
            </div>
        </div>
    </div>
  );
}

'use client';

import { Camera, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ScanPage() {
  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Scan QR Code</h1>
        <p className="text-muted-foreground max-w-md">Point your camera at a ConvoTag QR code to instantly add a new connection.</p>
      </div>

      <Card className="w-full max-w-md">
        <CardContent className="p-6">
            <div className="aspect-square w-full rounded-lg bg-slate-900 flex items-center justify-center relative overflow-hidden">
                <Camera className="h-24 w-24 text-slate-700" />
                <div className="absolute inset-0 border-8 border-white/20 rounded-lg animate-pulse" />
                <div className="absolute w-2/3 h-2/3 border-4 border-dashed border-primary rounded-2xl flex items-center justify-center">
                    <QrCode className="h-16 w-16 text-primary/70"/>
                </div>
            </div>
        </CardContent>
        <CardContent className="p-6 pt-0">
          <Button className="w-full" size="lg" disabled>
            <Camera className="mr-2 h-5 w-5" />
            Enable Camera
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Camera access is required to scan QR codes. This is a demo and scanning is not implemented.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

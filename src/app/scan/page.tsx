'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, QrCode, CheckCircle, XCircle } from 'lucide-react';
import { QrReader } from 'react-qr-reader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';

export default function ScanPage() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        setHasCameraPermission(true);
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
      }
    };
    getCameraPermission();
  }, []);

  const handleScan = (result: any, error: any) => {
    if (!!result) {
      const url = result?.text;
      if (url && (url.includes('/c/'))) {
          setScanResult(url);
          toast({
            title: 'QR Code Scanned!',
            description: `Redirecting to user profile...`,
          });
          router.push(url);
      } else {
          toast({
              title: 'Invalid QR Code',
              description: 'This does not appear to be a valid ConvoTag card.',
              variant: 'destructive'
          })
      }
    }

    if (!!error) {
       if (error.name !== 'NotAllowedError' && error.name !== 'NotFoundError' && error.name !== 'NoVideoInputDevicesError') {
        console.info(error);
      }
    }
  };
  
  const resetScanner = () => {
      setScanResult(null);
  }

  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Scan QR Code</h1>
        <p className="text-muted-foreground max-w-md">Point your camera at a ConvoTag QR code to instantly add a new connection.</p>
      </div>

      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="aspect-square w-full rounded-lg bg-slate-900 flex items-center justify-center relative overflow-hidden">
            {hasCameraPermission === false ? (
                 <div className="flex flex-col items-center text-white p-4">
                    <Camera className="h-24 w-24 text-slate-700" />
                    <p className="mt-4 text-center">Camera access is required to scan QR codes.</p>
                 </div>
            ) : hasCameraPermission === true && !scanResult ? (
              <QrReader
                onResult={handleScan}
                constraints={{ facingMode: 'environment' }}
                containerStyle={{ width: '100%', height: '100%' }}
                videoContainerStyle={{ width: '100%', height: '100%', paddingTop: 0}}
                videoStyle={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : scanResult ? (
                <div className="flex flex-col items-center text-white p-4 text-center">
                    <CheckCircle className="h-24 w-24 text-green-500" />
                    <p className="mt-4 font-semibold">Scan Successful!</p>
                    <p className="text-sm break-all mt-2">{scanResult}</p>
                </div>
            ) : (
                 <div className="flex flex-col items-center text-white p-4 animate-pulse">
                    <Camera className="h-24 w-24 text-slate-700" />
                    <p className="mt-4">Requesting camera permission...</p>
                 </div>
            )}
             {!scanResult && hasCameraPermission && <div className="absolute w-2/3 h-2/3 border-4 border-dashed border-primary/70 rounded-2xl" />}
          </div>
        </CardContent>
        {hasCameraPermission === false && (
            <CardContent className="p-6 pt-0">
                 <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>Camera Access Denied</AlertTitle>
                    <AlertDescription>
                        Please enable camera permissions in your browser settings to use this feature.
                    </AlertDescription>
                </Alert>
            </CardContent>
        )}
        {scanResult && (
            <CardContent className="p-6 pt-0">
                <Button onClick={resetScanner} className="w-full">
                    <QrCode className="mr-2 h-5 w-5" />
                    Scan Another Code
                </Button>
            </CardContent>
        )}
      </Card>
    </div>
  );
}

'use client';

import { useState } from 'react';
import type { UserProfile } from '@/lib/types';
import { generateCardBackgroundFromWebsite } from '@/ai/flows/generate-card-background-from-website';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import DigitalCard from './digital-card';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Terminal } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

interface BackgroundGeneratorProps {
  userProfile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
}

export default function BackgroundGenerator({ userProfile, onProfileUpdate }: BackgroundGeneratorProps) {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedBg, setGeneratedBg] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!websiteUrl) {
      setError('Please enter a website URL.');
      return;
    }
    setLoading(true);
    setError(null);
    setGeneratedBg(null);

    try {
      const result = await generateCardBackgroundFromWebsite({ websiteUrl: `https://${websiteUrl}` });
      if (result.backgroundDataUri) {
        setGeneratedBg(result.backgroundDataUri);
      } else {
        throw new Error('Failed to generate background. The result was empty.');
      }
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to generate background. ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (generatedBg) {
      onProfileUpdate({ ...userProfile, cardBackgroundUrl: generatedBg });
      toast({
        title: 'Background Applied!',
        description: 'Your new card background has been saved.',
      });
      setGeneratedBg(null);
      setWebsiteUrl('');
    }
  };

  const cardWithGeneratedBg: UserProfile = { ...userProfile, cardBackgroundUrl: generatedBg || userProfile.cardBackgroundUrl };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Background Generator</CardTitle>
        <CardDescription>
          Generate a unique background for your card based on your company's website.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <label htmlFor="website-url" className="text-sm font-medium">Company Website URL</label>
            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground p-2 bg-muted rounded-l-md">https://</span>
                <Input
                    id="website-url"
                    placeholder="yourcompany.com"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    disabled={loading}
                    className="rounded-l-none"
                />
                <Button onClick={handleGenerate} disabled={loading}>
                    {loading ? 'Generating...' : 'Generate'}
                </Button>
            </div>
        </div>

        {error && (
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Generation Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-2">
            <h3 className="font-semibold text-center">Current Card</h3>
            <DigitalCard user={userProfile} />
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-center">
              {generatedBg ? 'New Generation' : loading ? 'Generating Preview...' : 'Preview'}
            </h3>
            {loading ? (
              <Skeleton className="aspect-[16/9] w-full rounded-xl" />
            ) : (
              <DigitalCard user={cardWithGeneratedBg} />
            )}
          </div>
        </div>

      </CardContent>
      <CardFooter>
        <Button onClick={handleApply} disabled={!generatedBg || loading} className="bg-accent text-accent-foreground hover:bg-accent/90">
            Apply New Background
        </Button>
      </CardFooter>
    </Card>
  );
}

'use client';

import { useState } from 'react';
import type { UserProfile } from '@/lib/types';
import { generateCardBackgroundFromWebsite } from '@/ai/flows/generate-card-background-from-website';
import { generateBusinessCardBackground } from '@/ai/flows/generate-business-card-background';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import DigitalCard from './digital-card';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Sparkles, Terminal } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { authService } from '@/lib/firebase/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface BackgroundGeneratorProps {
  userProfile: UserProfile;
  onProfileUpdate: () => void;
}

export default function BackgroundGenerator({ userProfile, onProfileUpdate }: BackgroundGeneratorProps) {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedBg, setGeneratedBg] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateFromWebsite = async () => {
    if (!websiteUrl) {
      setError('Please enter a website URL.');
      return;
    }
    setLoading(true);
    setError(null);
    setGeneratedBg(null);

    try {
      const result = await generateCardBackgroundFromWebsite({ websiteUrl: `https://${websiteUrl.replace(/^https?:\/\//, '')}` });
      if (result.backgroundDataUri) {
        setGeneratedBg(result.backgroundDataUri);
      } else {
        throw new Error('Failed to generate background. The result was empty.');
      }
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to generate background from website. ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleGenerateFromPrompt = async () => {
    if (!customPrompt) {
        setError('Please enter a prompt.');
        return;
    }
    setLoading(true);
    setError(null);
    setGeneratedBg(null);
    try {
        const result = await generateBusinessCardBackground({prompt: customPrompt});
         if (result.backgroundDataUri) {
            setGeneratedBg(result.backgroundDataUri);
        } else {
            throw new Error('Failed to generate background. The result was empty.');
        }
    } catch(e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        setError(`Failed to generate background from prompt. ${errorMessage}`);
    } finally {
        setLoading(false);
    }
  };

  const handleApply = async () => {
    if (generatedBg && userProfile.uid) {
      await authService.updateUserProfile(userProfile.uid, { cardBackgroundUrl: generatedBg });
      onProfileUpdate();
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
          Generate a unique background for your card using AI.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="website">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="website">From Website</TabsTrigger>
                <TabsTrigger value="prompt">From Prompt</TabsTrigger>
            </TabsList>
            <TabsContent value="website" className="pt-4">
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
                        <Button onClick={handleGenerateFromWebsite} disabled={loading}>
                            <Sparkles className="mr-2 h-4 w-4" />
                            {loading ? 'Generating...' : 'Generate'}
                        </Button>
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="prompt" className="pt-4">
                 <div className="space-y-2">
                    <label htmlFor="custom-prompt" className="text-sm font-medium">Describe your desired background</label>
                    <div className="flex items-center gap-2">
                        <Input
                            id="custom-prompt"
                            placeholder="e.g. blue and gold abstract waves"
                            value={customPrompt}
                            onChange={(e) => setCustomPrompt(e.target.value)}
                            disabled={loading}
                        />
                        <Button onClick={handleGenerateFromPrompt} disabled={loading}>
                            <Sparkles className="mr-2 h-4 w-4" />
                            {loading ? 'Generating...' : 'Generate'}
                        </Button>
                    </div>
                </div>
            </TabsContent>
        </Tabs>

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

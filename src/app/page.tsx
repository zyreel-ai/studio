
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import DigitalCard from '@/components/digital-card';
import { userProfile as demoProfile } from '@/lib/data';
import { ArrowRight, QrCode, Share2, Star } from 'lucide-react';
import Link from 'next/link';

export default function WelcomePage() {
  const features = [
    {
      icon: <QrCode className="h-8 w-8" />,
      title: 'QR Code Sharing',
      description: 'Share your card instantly with a personal QR code.'
    },
    {
      icon: <Share2 className="h-8 w-8" />,
      title: 'Seamless Connections',
      description: 'Build your professional network with a single tap.'
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: 'AI-Powered Design',
      description: 'Generate stunning card backgrounds with AI.'
    }
  ]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-4 py-16 flex-1">
        <section className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
            The Future of Business Cards is Here.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Create, customize, and share your digital business card in seconds. Never get caught without a card again.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/signup">
                Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </section>

        <section className="my-24">
            <div className="relative flex justify-center">
                <div className="w-full max-w-lg">
                    <DigitalCard user={{...demoProfile, name: 'Your Name', company: 'Your Company'}} />
                </div>
            </div>
        </section>
        
        <section className="my-24">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight">Why Go Digital?</h2>
                <p className="text-muted-foreground mt-2">Everything you need to make a great first impression.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <Card key={index} className="text-center p-8 border-2 hover:border-primary transition-colors">
                        <CardContent className="flex flex-col items-center gap-4">
                            <div className="p-4 bg-primary/10 text-primary rounded-full">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
      </main>

      <footer className="w-full border-t py-6">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ConvoTag Lite. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

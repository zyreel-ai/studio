'use client';

import type { UserProfile } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { CheckCircle, Gem, Shield, Star } from 'lucide-react';
import DigitalCard from './digital-card';
import { cn } from '@/lib/utils';

interface CardTierManagerProps {
    userProfile: UserProfile;
}

const tiers = [
    { 
        name: 'Bronze' as const, 
        icon: <Shield className="h-8 w-8 text-yellow-700" />,
        price: 'Free',
        features: ['Standard Card Design', 'QR Code Sharing', 'Contact Management'],
        cta: 'Your Current Plan',
        current: true,
    },
    { 
        name: 'Silver' as const,
        icon: <Shield className="h-8 w-8 text-slate-400" />,
        price: '₹499/yr', 
        features: ['All Bronze Features', 'Advanced Card Styles', 'Basic Analytics'],
        cta: 'Upgrade to Silver'
    },
    { 
        name: 'Gold' as const, 
        icon: <Star className="h-8 w-8 text-amber-400" />,
        price: '₹999/yr',
        features: ['All Silver Features', 'Premium Card Designs', 'AI Background Generator'],
        cta: 'Upgrade to Gold'
    },
    { 
        name: 'Diamond' as const, 
        icon: <Gem className="h-8 w-8 text-cyan-400" />,
        price: '₹1999/yr',
        features: ['All Gold Features', 'Priority Support', 'Detailed Analytics Dashboard'],
        cta: 'Upgrade to Diamond'
    }
];

export default function CardTierManager({ userProfile }: CardTierManagerProps) {
    const currentTier = userProfile.cardTier || 'bronze';

    return (
        <Card>
            <CardHeader>
                <CardTitle>Card Tier</CardTitle>
                <CardDescription>Upgrade your plan to unlock more features and designs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="flex justify-center">
                   <div className="w-full max-w-lg">
                     <DigitalCard user={userProfile} />
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {tiers.map((tier) => (
                        <Card key={tier.name} className={cn(
                            "flex flex-col",
                            currentTier === tier.name.toLowerCase() && "border-primary border-2"
                        )}>
                            <CardHeader className="items-center text-center">
                                {tier.icon}
                                <CardTitle>{tier.name}</CardTitle>
                                <CardDescription className="font-bold text-xl">{tier.price}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 space-y-4">
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    {tier.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardContent className="mt-auto">
                                <Button className="w-full" disabled={currentTier === tier.name.toLowerCase()}>
                                    {currentTier === tier.name.toLowerCase() ? 'Your Current Plan' : tier.cta}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

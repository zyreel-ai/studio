"use client";

import type { UserProfile } from '@/lib/types';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Globe, Mail, Phone, Gem, Star, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

interface DigitalCardProps {
  user: UserProfile;
}

const tierStyles = {
  bronze: {
    badge: 'Bronze',
    badgeClass: 'bg-yellow-700/80 border-yellow-600/50 text-white',
    borderClass: 'border-yellow-700/60',
    icon: <Shield size={14} />
  },
  silver: {
    badge: 'Silver',
    badgeClass: 'bg-slate-400/80 border-slate-300/50 text-white',
    borderClass: 'border-slate-300/60',
    icon: <Shield size={14} />
  },
  gold: {
    badge: 'Gold',
    badgeClass: 'bg-amber-400/80 border-amber-300/50 text-white',
    borderClass: 'border-amber-400/60',
    icon: <Star size={14} />
  },
  diamond: {
    badge: 'Diamond',
    badgeClass: 'bg-cyan-400/80 border-cyan-300/50 text-white',
    borderClass: 'border-cyan-400/60',
    icon: <Gem size={14} />
  }
};


const DigitalCard = ({ user }: DigitalCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('');
  };

  const isDefaultBg = user.cardBackgroundUrl === '/card-bg-default.svg';
  const tier = user.cardTier || 'bronze';
  const styles = tierStyles[tier];

  return (
    <div className={cn(
        "relative aspect-[16/9] w-full overflow-hidden rounded-xl shadow-lg text-white border-2",
        styles.borderClass
    )}>
      {isDefaultBg ? (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-charcoal-900 to-gray-900" />
      ) : (
        user.cardBackgroundUrl && (
          <Image
            src={user.cardBackgroundUrl}
            alt="Card Background"
            fill
            className="object-cover"
            data-ai-hint="abstract background"
          />
        )
      )}
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 flex h-full flex-col justify-between p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="font-light">{user.role}</p>
          </div>
          <Avatar className="h-16 w-16 border-2 border-white/50">
            <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person portrait" />
            <AvatarFallback className="bg-primary text-primary-foreground font-bold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex items-end justify-between">
            <Badge className={cn("flex items-center gap-1.5", styles.badgeClass)}>
                {styles.icon}
                <span>{styles.badge}</span>
            </Badge>
            <div className="text-right">
                <p className="text-lg font-semibold">{user.company}</p>
                <div className="mt-2 flex items-center justify-end gap-4 text-sm">
                    <a href={`mailto:${user.email}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                    <Mail size={16} />
                    <span>{user.email}</span>
                    </a>
                    <a href={`tel:${user.phone}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                    <Phone size={16} />
                    <span>{user.phone}</span>
                    </a>
                    <a href={`https://${user.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                    <Globe size={16} />
                    <span>{user.website}</span>
                    </a>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalCard;

'use client';

import type { Contact } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Briefcase, User } from 'lucide-react';

interface ContactListItemProps {
  contact: Contact;
  onViewCard: () => void;
}

export default function ContactListItem({ contact, onViewCard }: ContactListItemProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('');
  };

  return (
    <Card className="flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarImage src={contact.avatarUrl} alt={contact.name} data-ai-hint="person portrait" />
            <AvatarFallback className="bg-secondary text-secondary-foreground font-bold">
              {getInitials(contact.name)}
            </AvatarFallback>
          </Avatar>
          <div className="truncate">
            <h3 className="text-lg font-bold truncate">{contact.name}</h3>
            <p className="text-sm text-muted-foreground truncate">{contact.company}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Briefcase size={16} className="text-accent"/>
            <span>{contact.role}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onViewCard} variant="outline" className="w-full">
          View Card
        </Button>
      </CardFooter>
    </Card>
  );
}

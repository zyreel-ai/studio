'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { authService } from '@/lib/firebase/auth';
import type { UserProfile } from '@/lib/types';
import DigitalCard from '@/components/digital-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';

export default function SharedCardPage() {
  const params = useParams();
  const { userId } = params;
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (typeof userId === 'string') {
      const fetchProfile = async () => {
        setLoading(true);
        const fetchedProfile = await authService.getUserProfile(userId);
        setProfile(fetchedProfile);
        setLoading(false);
      };
      fetchProfile();
    }
  }, [userId]);
  
  const handleAddContact = async () => {
    if (!user || !profile) return;
    setIsAdding(true);
    try {
      await authService.addContact(user.uid, profile);
      toast({
        title: 'Contact Added!',
        description: `${profile.name} has been added to your connections.`
      })
    } catch(e) {
      toast({
        title: "Error",
        description: "Failed to add contact.",
        variant: "destructive"
      });
    } finally {
      setIsAdding(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-lg p-4">
          <Skeleton className="w-full aspect-[16/9] rounded-xl" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>User profile not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/50 p-4">
        <div className="w-full max-w-lg space-y-4">
             <DigitalCard user={profile} />
            {user && user.uid !== userId && (
                <Button className="w-full" onClick={handleAddContact} disabled={isAdding}>
                    <UserPlus />
                    {isAdding ? 'Adding...' : 'Add to My Contacts'}
                </Button>
            )}
        </div>
    </div>
  );
}

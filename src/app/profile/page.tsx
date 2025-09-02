'use client';

import { useState } from 'react';
import { userProfile as initialUserProfile } from '@/lib/data';
import type { UserProfile } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileForm from '@/components/profile-form';
import BackgroundGenerator from '@/components/background-generator';

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
  };
  
  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Your Profile</h1>
        <p className="text-muted-foreground">Update your personal details and customize your card.</p>
      </div>

      <Tabs defaultValue="edit-profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit-profile">Edit Profile</TabsTrigger>
          <TabsTrigger value="card-appearance">Card Appearance</TabsTrigger>
        </TabsList>
        <TabsContent value="edit-profile">
          <ProfileForm userProfile={userProfile} onProfileUpdate={handleProfileUpdate} />
        </TabsContent>
        <TabsContent value="card-appearance">
          <BackgroundGenerator userProfile={userProfile} onProfileUpdate={handleProfileUpdate} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

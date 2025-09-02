'use client';

import { useAuth } from '@/contexts/auth-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileForm from '@/components/profile-form';
import BackgroundGenerator from '@/components/background-generator';
import { Skeleton } from '@/components/ui/skeleton';
import CardTierManager from '@/components/card-tier-manager';

export default function ProfilePage() {
  const { userProfile, reloadUserProfile } = useAuth();
  
  if (!userProfile) {
    return <ProfilePageSkeleton />;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Your Profile</h1>
        <p className="text-muted-foreground">Update your personal details and customize your card.</p>
      </div>

      <Tabs defaultValue="edit-profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="edit-profile">Edit Profile</TabsTrigger>
          <TabsTrigger value="card-appearance">Card Appearance</TabsTrigger>
          <TabsTrigger value="card-tier">Card Tier</TabsTrigger>
        </TabsList>
        <TabsContent value="edit-profile">
          <ProfileForm userProfile={userProfile} onProfileUpdate={reloadUserProfile} />
        </TabsContent>
        <TabsContent value="card-appearance">
          <BackgroundGenerator userProfile={userProfile} onProfileUpdate={reloadUserProfile} />
        </TabsContent>
         <TabsContent value="card-tier">
          <CardTierManager userProfile={userProfile} />
        </TabsContent>
      </Tabs>
    </div>
  );
}


function ProfilePageSkeleton() {
    return (
        <div className="flex flex-col gap-8">
            <div className="space-y-2">
                <Skeleton className="h-10 w-1/2 rounded-md" />
                <Skeleton className="h-5 w-3/4 rounded-md" />
            </div>

            <Skeleton className="h-10 w-full rounded-md" />
            
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-1/4 rounded-md" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-1/4 rounded-md" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                     <div className="space-y-2">
                        <Skeleton className="h-5 w-1/4 rounded-md" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-5 w-1/4 rounded-md" />
                    <Skeleton className="h-10 w-full rounded-md" />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-1/4 rounded-md" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                     <div className="space-y_2">
                        <Skeleton className="h-5 w-1/4 rounded-md" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                </div>
                 <div className="space-y_2">
                    <Skeleton className="h-5 w-1/4 rounded-md" />
                    <Skeleton className="h-10 w-full rounded-md" />
                </div>

                <Skeleton className="h-10 w-32 rounded-md" />
            </div>
        </div>
    )
}

'use client';

import type { UserProfile } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { authService } from '@/lib/firebase/auth';
import { analyticsService } from '@/lib/firebase/analytics';

interface ProfileFormProps {
  userProfile: UserProfile;
  onProfileUpdate: () => void;
}

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  role: z.string().min(2, 'Role must be at least 2 characters.').optional().or(z.literal('')),
  company: z.string().min(2, 'Company must be at least 2 characters.').optional().or(z.literal('')),
  email: z.string().email('Please enter a valid email.'),
  phone: z.string().min(10, 'Phone number seems too short.').optional().or(z.literal('')),
  website: z.string().min(3, 'Website URL seems too short.').optional().or(z.literal('')),
  avatarUrl: z.string().url('Please enter a valid URL for your avatar.').optional().or(z.literal('')),
});

export default function ProfileForm({ userProfile, onProfileUpdate }: ProfileFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: userProfile.name || '',
      role: userProfile.role || '',
      company: userProfile.company || '',
      email: userProfile.email || '',
      phone: userProfile.phone || '',
      website: userProfile.website || '',
      avatarUrl: userProfile.avatarUrl || '',
    },
  });

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    if (!userProfile.uid) {
        toast({ title: "Error", description: "User not authenticated", variant: "destructive" });
        return;
    }
    try {
        await authService.updateUserProfile(userProfile.uid, values);
        analyticsService.logEvent('update_profile');
        onProfileUpdate();
        toast({
          title: 'Profile Updated',
          description: 'Your changes have been saved successfully.',
        });
    } catch (error: any) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  }
  
  const getInitials = (name: string) => name ? name.split(' ').map((n) => n[0]).join('') : '';

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Make changes to your profile here. Click save when you're done.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={form.watch('avatarUrl')} alt={form.watch('name')} />
                <AvatarFallback className="text-2xl bg-secondary text-secondary-foreground">
                    {getInitials(form.watch('name') || '')}
                </AvatarFallback>
              </Avatar>
              <FormField
                control={form.control}
                name="avatarUrl"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Avatar URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://your-image-url.com/avatar.png" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Alex Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role / Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Lead Designer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder="PixelPerfect Inc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="alex.doe@pixelperfect.inc" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="pixelperfect.inc" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

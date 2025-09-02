export interface UserProfile {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  avatarUrl: string;
  cardBackgroundUrl?: string;
}

export interface Contact extends UserProfile {}

export interface Gift {
  id: number;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  included: string[];
  credits: number;
  claimed: boolean;
  locked: boolean;
}
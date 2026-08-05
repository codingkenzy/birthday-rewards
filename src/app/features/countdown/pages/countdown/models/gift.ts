export interface Gift {
  id: number;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  credits: number;
  claimed: boolean;
  locked: boolean;
}
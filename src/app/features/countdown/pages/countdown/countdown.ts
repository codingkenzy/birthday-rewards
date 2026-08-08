import { Component, OnInit, signal } from '@angular/core';
import { Gift } from './models/gift';

@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [],
  templateUrl: './countdown.html',
  styleUrl: './countdown.scss',
})
export class Countdown implements OnInit {
  days = signal(0);
  hours = signal(0);
  minutes = signal(0);
  seconds = signal(0);

  isBirthday = signal(false);

  //birthdayDate = new Date('2026-08-11T00:00:00');
  birthdayDate = new Date();

  experienceStage = signal<
    'countdown'
    | 'greeting'
    | 'envelope'
    | 'letter'
    | 'gift-vault'
    | 'gift-detail'
    | 'redeem-confirmation'
    | 'processing'
    | 'redemption-code'
  >('countdown');

  gifts = signal<Gift[]>([
    {
      id: 1,
      icon: '🏨',
      title: 'Luxury Staycation',
      subtitle: 'One unforgettable night',
      description: 'Enjoy a relaxing overnight stay at a beautiful hotel. Breakfast included.',
      included: [
        'Overnight stay',
        'Breakfast for two',
        'Late checkout',
        'Free parking'
      ],
      credits: 1,
      claimed: false,
      locked: false
    },
    {
      id: 2,
      icon: '💆',
      title: 'Relaxing Massage',
      subtitle: 'Time to unwind',
      description: 'Take a well-deserved break with a full-body massage.',
      included: [
        '90-minute massage',
        'Aromatherapy oil',
        'Complimentary tea'
      ],
      credits: 1,
      claimed: false,
      locked: false
    },
    {
      id: 3,
      icon: '💇',
      title: 'Salon Experience',
      subtitle: 'A fresh new look',
      description: 'Hair treatment, styling, or makeover at your favorite salon.',
      included: [
        'Haircut',
        'Hair treatment',
        'Professional styling'
      ],
      credits: 1,
      claimed: false,
      locked: false
    },
    {
      id: 4,
      icon: '🎁',
      title: 'Shopping Voucher',
      subtitle: 'Buy something you love',
      description: 'Use this voucher on anything you want.',
      included: [
        'Use at participating stores',
        'No expiry date',
        'Transferable'
      ],
      credits: 1,
      claimed: false,
      locked: false
    },
    {
      id: 5,
      icon: '📱',
      title: 'Smartphone',
      subtitle: 'Grand Prize',
      description: 'This special reward has already been claimed.',
      included: [
        'Already received',
        'Birthday surprise'
      ],
      credits: 3,
      claimed: true,
      locked: true
    }
  ]);

  birthdayCredits = signal(3);
  selectedGift = signal<Gift | null>(null);

  redemptionCode = signal('');

  ngOnInit() {
    this.updateCountdown();

    setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  updateCountdown() {
    const now = new Date();

    const difference = this.birthdayDate.getTime() - now.getTime();

    if (difference <= 0) {
      this.days.set(0);
      this.hours.set(0);
      this.minutes.set(0);
      this.seconds.set(0);

      if (this.experienceStage() === 'countdown') {
        this.experienceStage.set('greeting');
      }

      return;
    }

    const totalSeconds = Math.floor(difference / 1000);
    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;

    this.days.set(days);
    this.hours.set(hours);
    this.minutes.set(minutes);
    this.seconds.set(seconds);
  }

  formatNumber(value: number): string {
    return value.toString().padStart(2, '0');
  }

  showEnvelope(): void {
    this.experienceStage.set('envelope');
  }

  showLetter(): void {
    this.experienceStage.set('letter');
  }

  showGiftVault(): void {
    this.experienceStage.set('gift-vault');
  }

  viewGift(gift: Gift): void {
    this.selectedGift.set(gift);
    this.experienceStage.set('gift-detail');
  }

  goBackToGiftVault(): void {
    this.experienceStage.set('gift-vault');
  }

  redeemSelectedGift():void {
    const gift = this.selectedGift();

    if (!gift) {
      return;
    }

    if (gift.claimed || gift.locked) {
      return;
    }

    if (this.birthdayCredits() < gift.credits) {
      return;
    }

    this.processRedemption();
  }

  showRedeemConfirmation(): void {
    this.experienceStage.set('redeem-confirmation');
  }

  processRedemption(): void {
    this.experienceStage.set('processing');

    setTimeout(() => {
      this.completeRedemption();
    }, 2500);
  }

  completeRedemption(): void {
    const gift = this.selectedGift();

    if (!gift) {
      return;
    }

    this.birthdayCredits.update(c => c - gift.credits);

    this.gifts.update(
      gifts => gifts.map(
        g => g.id === gift.id
        ? {
          ...g,
          claimed: true
        }
        : g
      )
    );

    if (this.birthdayCredits() === 0) {
      this.gifts.update(
        gifts => gifts.map(
          g => g.claimed
          ? g
          : {
            ...g,
            locked: true
          }
        )
      );
    }

    this.redemptionCode.set(
      this.generateRedemptionCode()
    );

    this.experienceStage.set('redemption-code');
  }

  generateRedemptionCode(): string {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

    let random = '';

    for (let i = 0; i < 6; i++) {
      random += characters[Math.floor(Math.random() * characters.length)];
    }

    return `BR-2026-${random}`;
  }
}

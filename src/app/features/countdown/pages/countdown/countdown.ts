import { Component, OnInit, signal } from '@angular/core';
import { Gift } from './models/gift';
import confetti from 'canvas-confetti';

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

  birthdayDate = new Date('2026-08-11T00:00:00');
  
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
      title: 'G1 Lodge Design Hotel',
      subtitle: '3 Days & 2 Nights at Baguio City',
      description: 'Enjoy a relaxing stay at G1 Lodge Design Hotel located at Baguio City from September 30 to October 1, 2026.',
      included: [
        'Breakfast for two',
        'Balcony',
        'Free parking'
      ],
      credits: 2,
      claimed: true,
      locked: true
    },
    {
      id: 2,
      icon: '💆',
      title: 'Massage Voucher',
      subtitle: 'Time to relax and unwind',
      description: 'Take a well-deserved break with a full-body massage.',
      included: [
        'Massage voucher',
        'Aromatherapy oil',
        'Complimentary tea'
      ],
      credits: 1,
      claimed: false,
      locked: false
    },
    {
      id: 3,
      icon: '🎁',
      title: 'Shopping Voucher',
      subtitle: 'Buy something you love',
      description: 'Use this voucher on anything you want.',
      included: [
        'Use to redeem GCash voucher',
        'Use in any participating stores',
        'Transferable'
      ],
      credits: 1,
      claimed: true,
      locked: true
    },
    {
      id: 4,
      icon: '📱',
      title: 'Smartphone',
      subtitle: 'iPhone 16',
      description: 'This special reward has already been claimed.',
      included: [
        'Already received',
        'Birthday surprise'
      ],
      credits: 3,
      claimed: true,
      locked: true
    },
    {
      id: 5,
      icon: '🍽️',
      title: 'Food Voucher',
      subtitle: 'A Delicious Treat',
      description: 'Enjoy a special meal or your favorite food with this birthday voucher.',
      included: [
        'Food of your choice',
        'Food voucher'
      ],
      credits: 1,
      claimed: true,
      locked: true
    }
  ]);

  birthdayCredits = signal(0);
  selectedGift = signal<Gift | null>(null);
  redemptionCode = signal('');
  envelopeOpening = signal(false);

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
        this.launchConfetti();
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

  returnToGiftVault(): void {
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

    setTimeout(() => {
      this.launchConfetti();
    }, 300);
  }

  generateRedemptionCode(): string {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

    let random = '';

    for (let i = 0; i < 6; i++) {
      random += characters[Math.floor(Math.random() * characters.length)];
    }

    const gift = this.selectedGift();

    if (!gift) {
      return `BR-2026-${random}`;
    }

    let code = '';

    if (gift.id === 1) {
      code = `BR-2026-${random}`;
    } else if (gift.id === 2) {
      code = 'G6NA-CA7N';
    } else if (gift.id === 3) {
      code = 'QCE8-DYD4';
    } else if (gift.id === 5) {
      code = 'G6NA-CA7N';
    }

    return code;
  }

  async copyRedemptionCode(): Promise<void> {
    const code = this.redemptionCode();

    if (!code) {
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
    } catch (error) {
      console.error(
        'Failed to copy redemption code:',
        error
      );
    }
  }

  openEnvelope(): void {
    if (this.envelopeOpening()) {
      return;
    }

    this.envelopeOpening.set(true);

    setTimeout(() => {
      this.showLetter();
    }, 900);
  }

  private launchConfetti(): void {
    // Left burst
    confetti({
      particleCount: 80,
      angle: 65,
      spread: 55,
      startVelocity: 55,
      gravity: 1.1,
      decay: 0.92,
      scalar: 1,
      ticks: 220,
      origin: {
        x: 0.15,
        y: 0.72
      }
    });

    // Right burst
    confetti({
      particleCount: 80,
      angle: 115,
      spread: 55,
      startVelocity: 55,
      gravity: 1.1,
      decay: 0.92,
      scalar: 1,
      ticks: 220,
      origin: {
        x: 0.85,
        y: 0.72
      }
    });
  }


}

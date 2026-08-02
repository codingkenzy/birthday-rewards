import { Component, OnInit, signal } from '@angular/core';

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

  birthdayDate = new Date('2026-08-11T00:00:00');

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
}

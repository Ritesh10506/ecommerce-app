import { Component, input, signal } from '@angular/core';

/** Shows a product image, or a coloured letter tile if the URL is empty or broken. */
@Component({
  selector: 'app-product-image',
  standalone: true,
  template: `
    @if (src() && !failed()) {
      <img [src]="src()" [alt]="name()" (error)="failed.set(true)" loading="lazy" />
    } @else {
      <div class="img-fallback" [style.background]="bg()">{{ name().charAt(0).toUpperCase() }}</div>
    }
  `,
  styles: [`
    :host { display: block; width: 100%; height: 100%; }
    img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .img-fallback {
      width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
      font-size: 2.4rem; font-weight: 800; color: rgba(255,255,255,0.95);
    }
  `],
})
export class ProductImageComponent {
  src = input<string | undefined | null>('');
  name = input('?');
  failed = signal(false);

  bg() {
    const colors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#8b5cf6', '#ef4444'];
    const code = this.name().charCodeAt(0) || 0;
    const c = colors[code % colors.length];
    return `linear-gradient(135deg, ${c}, ${c}cc)`;
  }
}

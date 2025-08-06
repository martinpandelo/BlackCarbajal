import { CommonModule, NgClass } from '@angular/common';
import { Component, effect, HostListener, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'front-header',
  imports: [RouterLink, RouterLinkActive, NgClass, FormsModule, CommonModule],
  templateUrl: './header.component.html'
})
export class HeaderComponent {

  router = inject(Router);

  isNavbarHidden = false;
  lastScrollTop = 0;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > this.lastScrollTop && currentScroll > 50) {
      // Scroll hacia abajo → ocultar
      this.isNavbarHidden = true;
    } else if (currentScroll < this.lastScrollTop - 5 || currentScroll <= 0) {
      // Scroll hacia arriba o arriba del todo → mostrar
      this.isNavbarHidden = false;
    }

    this.lastScrollTop = currentScroll;
  }


  searchInput = signal('');
  debounceTime = signal(3000);

  // Output: solo para notificar hacia fuera si fuera necesario
  searchTerm = output<string>();

  // Signal interno para reaccionar
  debouncedSearch = signal('');


  // Debounce effect que actualiza una signal (válida con Angular moderno)
  debounceEffect = effect((onCleanup) => {
    const value = this.searchInput().trim();

    if (!value) return;

    const timeout = setTimeout(() => {
      this.debouncedSearch.set(value);
      this.searchTerm.emit(value); // opcional: emitir si querés usar en el template
    }, this.debounceTime());

    onCleanup(() => clearTimeout(timeout));
  });

  // Reacción al cambio real (después del debounce)
  navigateEffect = effect(() => {
    const term = this.debouncedSearch();
    if (term) {
      (document.getElementById('search') as HTMLDialogElement)?.close();
      this.router.navigate(['/productos'], {
        queryParams: { buscar: term }
      });
    }
  });

  onSearchEnter() {
  const value = this.searchInput().trim();
  if (!value) return;

  this.debouncedSearch.set('');
  this.router.navigate(['/productos'], {
    queryParams: { buscar: value }
  });

  (document.getElementById('search') as HTMLDialogElement)?.close();
}

}

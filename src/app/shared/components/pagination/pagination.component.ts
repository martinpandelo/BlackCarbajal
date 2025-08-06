import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

type PageToken = number | 'ellipsis';

@Component({
  selector: 'app-pagination',
  imports: [RouterLink],
  templateUrl: './pagination.component.html'
})
export class PaginationComponent {

  // Total de páginas y página actual (1-based)
  pages = input<number>(0);
  currentPage = input<number>(1);

  // Configurables: cuántas páginas fijas a la izquierda/derecha y cuántas alrededor de la actual
  edge = input<number>(1);   // primeras/últimas N
  around = input<number>(2); // ventana alrededor de la actual

  /**
   * Genera una lista de tokens: números de página y 'ellipsis' donde hay saltos.
   * Ejemplo: [1,2,3,4,5,'…', 23,24,25,26,27]
   * Si la página actual está en el medio, agrega una ventanita alrededor.
   */
  condensedPages = computed<PageToken[]>(() => {
    const total = this.pages();
    const active = this.currentPage();
    const edge = this.edge();
    const around = this.around();

    if (total <= 0) return [];
    if (total <= edge * 2 + 1) {
      // Pocas páginas: muestro todas
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const set = new Set<number>();

    // Primer bloque
    for (let p = 1; p <= Math.min(edge, total); p++) set.add(p);

    // Último bloque
    for (let p = Math.max(1, total - edge + 1); p <= total; p++) set.add(p);

    // Ventana alrededor de la actual (opcional)
    if (around > 0 && active >= 1 && active <= total) {
      const from = Math.max(1, active - around);
      const to = Math.min(total, active + around);
      for (let p = from; p <= to; p++) set.add(p);
    }

    const sorted = Array.from(set).sort((a, b) => a - b);

    // Insertar 'ellipsis' donde haya saltos > 1
    const result: PageToken[] = [];
    for (let i = 0; i < sorted.length; i++) {
      const p = sorted[i];
      result.push(p);
      if (i < sorted.length - 1) {
        const next = sorted[i + 1];
        if (next - p > 1) result.push('ellipsis');
      }
    }

    return result;
  });

  // Prev/Next útiles (opcional, para botones flecha)
  prevPage = computed(() => Math.max(1, this.currentPage() - 1));
  nextPage = computed(() => Math.min(this.pages(), this.currentPage() + 1));
}


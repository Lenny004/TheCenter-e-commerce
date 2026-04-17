// ============================================================================
// The Center — Modal reutilizable (panel admin)
// ============================================================================

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-admin-modal',
  standalone: true,
  templateUrl: './admin-modal.component.html',
  styleUrl: './admin-modal.component.css'
})
export class AdminModalComponent {
  @Input({ required: true }) title = '';
  @Input() open = false;
  /** Panel más ancho para formularios complejos */
  @Input() wide = false;
  /** Si es false, el clic en el fondo no cierra el modal */
  @Input() closeOnBackdrop = true;
  @Output() openChange = new EventEmitter<boolean>();

  onBackdropClick(): void {
    if (this.closeOnBackdrop) this.close();
  }

  close(): void {
    this.openChange.emit(false);
  }
}

import { Component, OnInit, OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { Cuenta } from '../models/cuenta.model';
import { CuentasService } from '../services/cuentas.service';

@Component({
  selector: 'app-side-sheet',
  standalone: true,
  imports: [CommonModule, FormsModule, ScrollingModule],
  template: `
    <div class="side-sheet" [class.open]="isOpen">
      <div class="side-sheet-header">
        <h2>Cuentas Bancarias</h2>
        <button class="close-btn" (click)="close()">×</button>
      </div>

      <div class="search-container">
        <input
          type="text"
          class="search-input"
          placeholder="Buscar por nombre, código o oficina..."
          [(ngModel)]="searchTerm"
          (ngModelChange)="onSearchChange($event)"
        />
        <div class="search-icon">🔍</div>
      </div>

      <div class="results-info">
        <span>{{ paginatedCuentas.length }} de {{ filteredCuentas.length }} | Página {{ currentPage }} de {{ totalPages }}</span>
        <span *ngIf="isFiltering" class="loading">Filtrando...</span>
      </div>

      <cdk-virtual-scroll-viewport
        #viewport
        itemSize="90"
        class="cuenta-list">
        <div
          *cdkVirtualFor="let cuenta of paginatedCuentas"
          class="cuenta-item"
          [class.selected]="cuenta.selected">
          <div class="checkbox-container">
            <input
              type="checkbox"
              class="checkbox"
              [checked]="cuenta.selected"
              (change)="toggleSelection(cuenta)"
              [id]="'checkbox-' + cuenta.id"
            />
          </div>
          <label [for]="'checkbox-' + cuenta.id" class="cuenta-content">
            <div class="cuenta-header">
              <span class="cuenta-id">#{{ cuenta.id }}</span>
              <span class="cuenta-oficina">{{ cuenta.oficina }}</span>
            </div>
            <div class="cuenta-nombre">{{ cuenta.nombreCuenta }}</div>
            <div class="cuenta-codigo">{{ cuenta.codigoCuenta }}</div>
          </label>
        </div>
      </cdk-virtual-scroll-viewport>

      <div class="pagination-container">
        <button
          class="pagination-btn"
          [disabled]="currentPage === 1"
          (click)="previousPage()">
          ← Anterior
        </button>
        <span class="page-info">Página {{ currentPage }} de {{ totalPages }}</span>
        <button
          class="pagination-btn"
          [disabled]="currentPage === totalPages"
          (click)="nextPage()">
          Siguiente →
        </button>
      </div>

      <div class="side-sheet-footer">
        <button class="btn-cancel" (click)="cancel()">Cancelar</button>
        <button class="btn-select" (click)="select()">
          Seleccionar ({{ selectedCount }})
        </button>
      </div>
    </div>
    <div class="overlay" [class.open]="isOpen" (click)="close()"></div>
  `,
  styles: [`
    .side-sheet {
      position: fixed;
      top: 0;
      right: -500px;
      width: 500px;
      height: 100vh;
      background: white;
      box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
      transition: right 0.3s ease;
      z-index: 1001;
      display: flex;
      flex-direction: column;
    }

    .side-sheet.open {
      right: 0;
    }

    .side-sheet-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #e0e0e0;
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: white;
    }

    .side-sheet-header h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }

    .close-btn {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      font-size: 32px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
      line-height: 1;
    }

    .close-btn:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .search-container {
      position: relative;
      padding: 20px;
      border-bottom: 1px solid #e0e0e0;
    }

    .search-input {
      width: 100%;
      padding: 12px 40px 12px 12px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.2s;
      box-sizing: border-box;
    }

    .search-input:focus {
      outline: none;
      border-color: #2563eb;
    }

    .search-icon {
      position: absolute;
      right: 32px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 20px;
      pointer-events: none;
    }

    .results-info {
      padding: 12px 20px;
      background: #f8fafc;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      color: #64748b;
    }

    .loading {
      color: #2563eb;
      font-weight: 500;
    }

    .cuenta-list {
      flex: 1;
      overflow-y: auto;
    }

    .cuenta-item {
      padding: 12px 16px;
      border-bottom: 1px solid #f1f5f9;
      transition: background 0.2s;
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }

    .cuenta-item:hover {
      background: #f8fafc;
    }

    .cuenta-item.selected {
      background: #eff6ff;
    }

    .checkbox-container {
      display: flex;
      align-items: center;
      padding-top: 6px;
    }

    .checkbox {
      width: 20px;
      height: 20px;
      cursor: pointer;
      accent-color: #2563eb;
    }

    .cuenta-content {
      flex: 1;
      cursor: pointer;
    }

    .cuenta-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }

    .cuenta-id {
      font-size: 12px;
      font-weight: 600;
      color: #2563eb;
    }

    .cuenta-oficina {
      font-size: 12px;
      background: #dbeafe;
      color: #1e40af;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: 500;
    }

    .cuenta-nombre {
      font-size: 15px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 4px;
    }

    .cuenta-codigo {
      font-size: 13px;
      color: #64748b;
      font-family: 'Courier New', monospace;
    }

    .pagination-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 20px;
      border-top: 1px solid #e0e0e0;
      border-bottom: 1px solid #e0e0e0;
      background: #f8fafc;
      gap: 8px;
    }

    .pagination-btn {
      padding: 8px 12px;
      border: 1px solid #e0e0e0;
      background: white;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      color: #64748b;
      transition: all 0.2s;
    }

    .pagination-btn:hover:not(:disabled) {
      background: #f1f5f9;
      border-color: #cbd5e1;
    }

    .pagination-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .page-info {
      font-size: 13px;
      color: #64748b;
      font-weight: 500;
    }

    .side-sheet-footer {
      display: flex;
      gap: 12px;
      padding: 16px 20px;
      border-top: 1px solid #e0e0e0;
    }

    .btn-cancel {
      flex: 1;
      padding: 12px 16px;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-cancel:hover {
      background: #f1f5f9;
      border-color: #cbd5e1;
    }

    .btn-select {
      flex: 1;
      padding: 12px 16px;
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      color: white;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-select:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }

    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s, visibility 0.3s;
      z-index: 1000;
    }

    .overlay.open {
      opacity: 1;
      visibility: visible;
    }
  `]
})
export class SideSheetComponent implements OnInit, OnDestroy {
  @ViewChild('viewport') viewport!: CdkVirtualScrollViewport;
  @Output() cuentasSeleccionadas = new EventEmitter<Cuenta[]>();

  isOpen = false;
  searchTerm = '';
  allCuentas: Cuenta[] = [];
  filteredCuentas: Cuenta[] = [];
  paginatedCuentas: Cuenta[] = [];
  totalCuentas = 0;
  isFiltering = false;

  itemsPerPage = 10;
  currentPage = 1;

  private searchSubject = new Subject<string>();
  private worker?: Worker;

  constructor(private cuentasService: CuentasService) {}

  ngOnInit(): void {
    this.allCuentas = this.cuentasService.getCuentas();
    this.filteredCuentas = this.allCuentas;
    this.totalCuentas = this.allCuentas.length;
    this.updatePagination();

    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(new URL('../workers/filter.worker', import.meta.url), { type: 'module' });

      this.worker.onmessage = ({ data }) => {
        this.filteredCuentas = data;
        this.isFiltering = false;
        this.currentPage = 1;
        this.updatePagination();
        if (this.viewport) {
          this.viewport.scrollToIndex(0);
        }
      };
    }

    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(term => {
        this.filterCuentas(term);
      });
  }

  ngOnDestroy(): void {
    if (this.worker) {
      this.worker.terminate();
    }
    this.searchSubject.complete();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredCuentas.length / this.itemsPerPage);
  }

  get selectedCount(): number {
    return this.allCuentas.filter(c => c.selected).length;
  }

  open(): void {
    this.isOpen = true;
  }

  close(): void {
    this.isOpen = false;
  }

  onSearchChange(term: string): void {
    this.searchSubject.next(term);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
      if (this.viewport) {
        this.viewport.scrollToIndex(0);
      }
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
      if (this.viewport) {
        this.viewport.scrollToIndex(0);
      }
    }
  }

  toggleSelection(cuenta: Cuenta): void {
    const originalCuenta = this.allCuentas.find(c => c.id === cuenta.id);
    if (originalCuenta) {
      originalCuenta.selected = !originalCuenta.selected;
    }
  }

  select(): void {
    const selected = this.allCuentas.filter(c => c.selected);
    this.cuentasSeleccionadas.emit(selected);
    this.close();
  }

  cancel(): void {
    this.close();
  }

  private updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedCuentas = this.filteredCuentas.slice(startIndex, endIndex);
  }

  private filterCuentas(term: string): void {
    this.isFiltering = true;

    if (this.worker) {
      this.worker.postMessage({
        type: 'filter',
        data: this.allCuentas,
        searchTerm: term
      });
    } else {
      const searchTerm = term.toLowerCase().trim();
      this.filteredCuentas = searchTerm
        ? this.allCuentas.filter(cuenta =>
            cuenta.nombreCuenta.toLowerCase().includes(searchTerm) ||
            cuenta.codigoCuenta.toLowerCase().includes(searchTerm) ||
            cuenta.oficina.toLowerCase().includes(searchTerm)
          )
        : this.allCuentas;
      this.isFiltering = false;
      this.currentPage = 1;
      this.updatePagination();
    }
  }
}

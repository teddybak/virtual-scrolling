import { Component, ViewChild } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { SideSheetComponent } from './components/side-sheet.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SideSheetComponent],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>Sistema de Gestión Bancaria</h1>
        <button class="open-btn" (click)="sideSheet.open()">
          📋 Ver Cuentas (10,000)
        </button>
      </header>

      <main class="app-main">
        <div class="welcome-card">
          <div class="icon">🏦</div>
          <h2>Bienvenido al Sistema Bancario</h2>
          <p>Esta aplicación gestiona <strong>10,000 cuentas bancarias</strong> de forma eficiente utilizando:</p>
          <ul class="features">
            <li>
              <span class="feature-icon">⚡</span>
              <div>
                <strong>Virtual Scrolling</strong>
                <p>Renderiza solo los elementos visibles para máximo rendimiento</p>
              </div>
            </li>
            <li>
              <span class="feature-icon">🔧</span>
              <div>
                <strong>Web Worker</strong>
                <p>Filtrado en segundo plano sin bloquear la interfaz</p>
              </div>
            </li>
            <li>
              <span class="feature-icon">🔍</span>
              <div>
                <strong>Búsqueda Inteligente</strong>
                <p>Busca por nombre, código de cuenta u oficina en tiempo real</p>
              </div>
            </li>
            <li>
              <span class="feature-icon">🎨</span>
              <div>
                <strong>Diseño Moderno</strong>
                <p>Interfaz intuitiva y responsive con animaciones fluidas</p>
              </div>
            </li>
          </ul>
          <button class="cta-button" (click)="sideSheet.open()">
            Explorar Cuentas
          </button>
        </div>
      </main>

      <app-side-sheet #sideSheet (cuentasSeleccionadas)="onCuentasSeleccionadas($event)"></app-side-sheet>
    </div>
  `,
  styles: [`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .app-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }

    .app-header {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      padding: 20px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .app-header h1 {
      color: white;
      font-size: 28px;
      font-weight: 700;
    }

    .open-btn {
      background: white;
      color: #667eea;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .open-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    .open-btn:active {
      transform: translateY(0);
    }

    .app-main {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 40px 20px;
      min-height: calc(100vh - 88px);
    }

    .welcome-card {
      background: white;
      border-radius: 16px;
      padding: 48px;
      max-width: 800px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      animation: fadeIn 0.6s ease;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .icon {
      font-size: 64px;
      text-align: center;
      margin-bottom: 24px;
    }

    .welcome-card h2 {
      font-size: 32px;
      color: #1e293b;
      text-align: center;
      margin-bottom: 16px;
    }

    .welcome-card > p {
      font-size: 18px;
      color: #64748b;
      text-align: center;
      margin-bottom: 32px;
      line-height: 1.6;
    }

    .features {
      list-style: none;
      margin-bottom: 32px;
    }

    .features li {
      display: flex;
      align-items: flex-start;
      margin-bottom: 24px;
      padding: 20px;
      background: #f8fafc;
      border-radius: 12px;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .features li:hover {
      transform: translateX(4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .feature-icon {
      font-size: 32px;
      margin-right: 16px;
      flex-shrink: 0;
    }

    .features strong {
      display: block;
      font-size: 18px;
      color: #1e293b;
      margin-bottom: 4px;
    }

    .features p {
      font-size: 14px;
      color: #64748b;
      line-height: 1.5;
    }

    .cta-button {
      width: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 16px 32px;
      border-radius: 8px;
      font-size: 18px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
    }

    .cta-button:active {
      transform: translateY(0);
    }
  `]
})
export class App {
  @ViewChild('sideSheet') sideSheet!: SideSheetComponent;

  onCuentasSeleccionadas(cuentas: any[]): void {
    console.log('Cuentas seleccionadas:', cuentas);
  }
}

bootstrapApplication(App);

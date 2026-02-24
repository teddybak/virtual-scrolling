import { Injectable } from '@angular/core';
import { Cuenta } from '../models/cuenta.model';

@Injectable({
  providedIn: 'root'
})
export class CuentasService {
  private cuentas: Cuenta[] = [];

  constructor() {
    this.generarCuentas();
  }

  private generarCuentas(): void {
    const oficinas = ['Sucursal Central', 'Sucursal Norte', 'Sucursal Sur', 'Sucursal Este', 'Sucursal Oeste'];
    const tiposCuenta = ['Cuenta Corriente', 'Cuenta de Ahorro', 'Cuenta Nómina', 'Cuenta Empresarial', 'Cuenta Inversión'];
    const nombres = ['García López', 'Martínez Silva', 'Rodríguez Pérez', 'Fernández Santos', 'González Ruiz',
                     'López Moreno', 'Sánchez Muñoz', 'Díaz Castro', 'Torres Ortiz', 'Ramírez Vargas'];

    for (let i = 0; i < 10000; i++) {
      const oficina = oficinas[Math.floor(Math.random() * oficinas.length)];
      const tipoCuenta = tiposCuenta[Math.floor(Math.random() * tiposCuenta.length)];
      const nombre = nombres[Math.floor(Math.random() * nombres.length)];
      const codigoCuenta = `ES${String(Math.floor(Math.random() * 10000000000000000000)).padStart(20, '0')}`;

      this.cuentas.push({
        id: i + 1,
        oficina,
        nombreCuenta: `${tipoCuenta} - ${nombre}`,
        codigoCuenta
      });
    }
  }

  getCuentas(): Cuenta[] {
    return this.cuentas;
  }
}

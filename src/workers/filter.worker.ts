/// <reference lib="webworker" />

interface Cuenta {
  id: number;
  oficina: string;
  nombreCuenta: string;
  codigoCuenta: string;
}

interface FilterMessage {
  type: 'filter';
  data: Cuenta[];
  searchTerm: string;
}

addEventListener('message', ({ data }: MessageEvent<FilterMessage>) => {
  if (data.type === 'filter') {
    const searchTerm = data.searchTerm.toLowerCase().trim();

    if (!searchTerm) {
      postMessage(data.data);
      return;
    }

    const filtered = data.data.filter(cuenta =>
      cuenta.nombreCuenta.toLowerCase().includes(searchTerm) ||
      cuenta.codigoCuenta.toLowerCase().includes(searchTerm) ||
      cuenta.oficina.toLowerCase().includes(searchTerm)
    );

    postMessage(filtered);
  }
});

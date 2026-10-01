# TraderFlow

Plataforma para traders: registra tus operaciones y analiza los resultados de tu
operativa — P&L, win rate, profit factor, curva de equity y desempeño por símbolo.

## Funcionalidad

- **Dashboard** con métricas clave: P&L total, nº de operaciones, win rate, profit
  factor, ganancia y pérdida media.
- **Curva de equity**: P&L acumulado a lo largo del tiempo.
- **P&L por símbolo**: qué instrumentos aportan y cuáles restan.
- **Registro de operaciones**: alta, edición y borrado manual.
- **Importar / exportar CSV** para cargar o respaldar tu historial.
- **Modo claro / oscuro.**

Los datos se guardan en el `localStorage` del navegador — no hay backend ni
cuenta de usuario en esta primera versión.

## Desarrollo

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # build de producción (tsc + vite build)
npm run lint      # oxlint
npm run preview  # sirve el build de producción
```

## Stack

React 19 + TypeScript + Vite, Tailwind CSS v4, Recharts.

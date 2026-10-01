export const TRADING_QUOTES: string[] = [
  "El plan te protege de vos mismo. Seguilo incluso cuando no tenés ganas.",
  "No se trata de tener razón, se trata de ganar plata.",
  "Corta las pérdidas rápido, dejá correr las ganancias.",
  "La disciplina es el puente entre tu plan y tus resultados.",
  "El mercado va a estar ahí mañana. Tu capital, solo si lo cuidás hoy.",
  "Una mala operación no te arruina. Romper tu plan, sí.",
  "El tamaño de la posición importa más que la dirección.",
  "No existe el setup perfecto, existe el setup que seguiste con disciplina.",
  "Preparate para perder antes de buscar ganar.",
  "El riesgo se define antes de entrar, no después.",
  "Tradeá el plan, no la emoción del momento.",
  "La paciencia es una posición.",
  "Cada operación es solo una de las próximas mil.",
  "No sobre-operar es tan importante como saber cuándo entrar.",
  "Tu peor enemigo en el mercado sos vos mismo bajo presión.",
  "La consistencia le gana a la intensidad.",
  "Revisá tu journal antes de buscar la próxima operación.",
  "Ganar seguido no te hace mejor trader. Seguir el proceso, sí.",
  "Si dudás del setup, no hay setup.",
  "El objetivo no es tener razón siempre, es sobrevivir para seguir operando.",
];

export function quoteOfTheDay(date: Date = new Date()): string {
  const dayIndex = Math.floor(date.getTime() / 86_400_000);
  const index = ((dayIndex % TRADING_QUOTES.length) + TRADING_QUOTES.length) % TRADING_QUOTES.length;
  return TRADING_QUOTES[index];
}

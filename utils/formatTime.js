// Função para formatar o tempo de preparo
export function formatPrepTime(minutes) {
  if (!minutes || typeof minutes !== "number") return null;

  if (minutes < 60) return `${minutes} min`;

  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  if (m === 0) return `${h}h`;

  return `${h}h${m}`;
}

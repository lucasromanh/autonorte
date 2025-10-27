export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(price);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('es-AR');
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: number | NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Devuelve un nombre legible para mostrar de distintos objetos de usuario/propietario.
 * Busca en varias propiedades comunes que puede devolver el backend: username, nombre, name, userName o user.{...}
 */
export const getDisplayName = (obj: any, fallback = 'Usuario'): string => {
  if (!obj) return fallback;
  if (typeof obj === 'string') return obj;
  return (
    obj.username || obj.nombre || obj.name || obj.userName ||
    (obj.user && (obj.user.username || obj.user.nombre || obj.user.name)) ||
    fallback
  );
};
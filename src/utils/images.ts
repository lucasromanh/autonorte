export const normalizeImages = (value: any): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter((v) => typeof v === 'string');
  if (typeof value === 'string') return [value];
  if (typeof value === 'object') {
    try {
      const vals = Object.values(value).filter((v) => typeof v === 'string');
      return vals as string[];
    } catch {
      return [];
    }
  }
  return [];
};

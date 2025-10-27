export const normalizeImages = (value: any): string[] => {
  if (!value) return [];
  // If it's an array of strings
  if (Array.isArray(value) && value.every(v => typeof v === 'string')) return value as string[];
  // If it's an array of objects like [{id, filename, url}, ...]
  if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
    try {
      return value.map((v: any) => v?.url || v?.filename || v?.file || '').filter(Boolean);
    } catch {
      return [];
    }
  }
  if (typeof value === 'string') return [value];
  if (typeof value === 'object') {
    // single object
    try {
      const v = value as any;
      if (v.url) return [v.url];
      if (v.filename) return [v.filename];
      if (v.file) return [v.file];
      const vals = Object.values(v).filter((x) => typeof x === 'string');
      return vals as string[];
    } catch {
      return [];
    }
  }
  return [];
};

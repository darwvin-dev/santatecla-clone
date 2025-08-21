export const isAbsoluteUrl = (u?: string) => !!u && /^(https?:)?\/\//i.test(u);
export const joinUrl = (base = "", path = "") => {
  const b = base.endsWith("/") ? base.slice(0, -1) : base;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
};
export const resolveUrl = (raw?: string, domain = process.env.NEXT_PUBLIC_DOMAIN_ADDRESS || "") => {
  if (!raw) return "";
  const src = raw.trim();
  const full = isAbsoluteUrl(src) ? src : joinUrl(domain, src);
  try { return encodeURI(full); } catch { return full; }
};

export const arrayMove = <T,>(arr: T[], from: number, to: number) => {
  const copy = arr.slice();
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
};

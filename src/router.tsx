import { createContext, MouseEvent, ReactNode, useContext } from 'react';

/*
 * Hash router. GitHub Pages serves LUMEN under /Lumen/ without an SPA fallback, so every view
 * lives after `#/`. That keeps deep links, reloads and the browser back/forward stack working
 * under any `base` without server rewrites.
 */

export type Route =
  | { view: 'portal' }
  | { view: 'drift' }
  | { view: 'chromatic' }
  | { view: 'mood' }
  | { view: 'collection'; query: string }
  | { view: 'exhibitions' }
  | { view: 'journey' }
  | { view: 'exhibition'; slug: string }
  | { view: 'walk'; slug: string; stop: number }
  | { view: 'saved'; setId?: string }
  | { view: 'about' }
  | { view: 'detail'; id: string }
  | { view: 'atlas'; id: string }
  | { view: 'notfound' };

export function parseHash(rawHash: string): Route {
  const hash = rawHash.replace(/^#/, '');
  const [path, query = ''] = hash.split('?');
  const parts = path.split('/').filter(Boolean).map((part) => {
    try { return decodeURIComponent(part); } catch { return part; }
  });
  const [first, second, third] = parts;
  if (parts.length === 0) return { view: 'portal' };
  if (first === 'drift') return { view: 'drift' };
  if (first === 'color' || first === 'chromatic') return { view: 'chromatic' };
  if (first === 'mood') return { view: 'mood' };
  if (first === 'collection' || first === 'grid') return { view: 'collection', query };
  if (first === 'exhibitions' || first === 'museum') return { view: 'exhibitions' };
  if (first === 'journey') return { view: 'journey' };
  if (first === 'exhibition') {
    if (!second || (second === 'vincent' && !third)) return { view: 'journey' };
    if (third !== undefined) {
      const stop = Number(third);
      return { view: 'walk', slug: second, stop: Number.isInteger(stop) ? stop : -1 };
    }
    return { view: 'exhibition', slug: second };
  }
  if (first === 'my-collection' || first === 'saved') return { view: 'saved', setId: second };
  if (first === 'about' || first === 'method') return { view: 'about' };
  if (first === 'artwork' && second) return { view: 'detail', id: second };
  if (first === 'atlas' && second) return { view: 'atlas', id: second };
  return { view: 'notfound' };
}

export function routeHash(route: Route): string {
  switch (route.view) {
    case 'portal': return '#/';
    case 'drift': return '#/drift';
    case 'chromatic': return '#/color';
    case 'mood': return '#/mood';
    case 'collection': return '#/collection' + (route.query ? '?' + route.query : '');
    case 'exhibitions': return '#/exhibitions';
    case 'journey': return '#/exhibition/vincent';
    case 'exhibition': return '#/exhibition/' + encodeURIComponent(route.slug);
    case 'walk': return '#/exhibition/' + encodeURIComponent(route.slug) + '/' + route.stop;
    case 'saved': return '#/my-collection' + (route.setId ? '/' + encodeURIComponent(route.setId) : '');
    case 'about': return '#/about';
    case 'detail': return '#/artwork/' + encodeURIComponent(route.id);
    case 'atlas': return '#/atlas/' + encodeURIComponent(route.id);
    default: return '#/404';
  }
}

/** The page identity without query: changing it moves focus and scroll, changing only the query does not. */
export function pageKey(route: Route) {
  return routeHash(route).split('?')[0];
}

export type NavigateOptions = { replace?: boolean };

type RouterValue = {
  route: Route;
  navigate: (to: Route | string, options?: NavigateOptions) => void;
};

export const RouterContext = createContext<RouterValue>({
  route: { view: 'portal' },
  navigate: () => undefined,
});

export function useRouter() {
  return useContext(RouterContext);
}

export function toHash(to: Route | string) {
  return typeof to === 'string' ? to : routeHash(to);
}

/** A real anchor (open in new tab, copy link) that routes in-app on a plain click. */
export function Link({
  to,
  children,
  className,
  replace,
  ...rest
}: {
  to: Route | string;
  children: ReactNode;
  className?: string;
  replace?: boolean;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
  const { navigate } = useRouter();
  const href = toHash(to);
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    rest.onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(href, { replace });
  };
  return <a {...rest} className={className} href={href} onClick={onClick}>{children}</a>;
}

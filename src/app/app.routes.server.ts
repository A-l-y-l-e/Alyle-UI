import {RenderMode, ServerRoute} from '@angular/ssr';
export const serverRoutes: ServerRoute[] = [
  {
    path: '', // This renders the "/" route on the client (CSR)
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'api', // This page is static, so we prerender it (SSG)
    renderMode: RenderMode.Client,
  },
  {
    path: 'api/**', // This page is static, so we prerender it (SSG)
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Client,
  }
];
import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { memoize } from '@alyle/ui';


@Injectable({
  providedIn: 'root'
})
export class SEOService {
  readonly origin = 'https://alyle.io';
  /**
   * Equal to URL but with memoize
   */
  readonly url = memoize((path: string) => new URL(path, this.origin));
  constructor(
    @Inject(DOCUMENT) private dom: Document,
    private titleService: Title,
    private metaService: Meta,
    private router: Router,
  ) { }

  updateCanonicalUrl(url?: string) {
    const head = this.dom.getElementsByTagName('head')[ 0 ];
    let element: HTMLLinkElement | null = head.querySelector(`link[rel='canonical']`) || null;
    if (!url) {
      if (element) {
        head.removeChild(element);
      }
      return;
    }
    if (element == null) {
      element = this.dom.createElement('link');
      head.appendChild(element);
    }
    element.setAttribute('rel', 'canonical');
    element.setAttribute('href', url);
  }

  /**
   * Tell search engine crawlers whether to index this page
   */
  setNoIndex(val: boolean) {
    if (val) {
      this.metaService.addTag({ name: 'robots', content: 'noindex' });
    } else {
      this.metaService.removeTag('name="robots"');
    }
  }

  setTitle(val?: string) {
    this.titleService.setTitle(val
      ? val
      : 'Alyle UI: Minimal Design, a set of components for Angular');
    if (val || this.router.url === '/') {
      this.updateCanonicalUrl(`${this.origin}${this.router.url}`);
    } else {
      this.updateCanonicalUrl();
    }
  }

}

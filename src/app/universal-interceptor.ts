import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

@Injectable()
export class UniversalInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<unknown>, next: HttpHandler) {
    let serverReq: HttpRequest<unknown> = req;
    if (req.url.startsWith('api/docs/')) {
      serverReq = req.clone({url: `http://localhost:3000/${req.url.slice(4)}`});
    }
    return next.handle(serverReq);
  }
}

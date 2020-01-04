import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, of } from 'rxjs';
import { Meta } from '@angular/platform-browser';

export interface APIList {
  pkg: string;
  items: {
    name: string;
    symbol: string;
  }[];
}

@Injectable()
export class APIService {
  private _apiUrl = 'api/@alyle/ui/APIList.min.json';
  private _temp = new Map<string, any>();
  constructor(
    private http: HttpClient,
    private metaService: Meta
  ) { }

  getList() {
    if (this._temp.has(this._apiUrl)) {
      return of<APIList[]>(this._temp.get(this._apiUrl));
    }
    return this.http.get<APIList[]>(this._apiUrl)
      .pipe(
        catchError(this.handleError),
        tap(content => this._temp.set(this._apiUrl, content))
      );
  }

  handleError(error: HttpErrorResponse) {
    const is404 = (error instanceof ErrorEvent) ? false : error.status === 404;
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    this.metaService.addTag({ name: 'robots', content: 'noindex' });
    const errMsg = is404 ? 'PAGE NOT FOUND' : 'REQUEST FOR DOCUMENT FAILED';
    // return an observable with a user-facing error message
    return throwError(
      errMsg);
  }
}

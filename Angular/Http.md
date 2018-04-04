# HTTP in angular

## Handling Http Errors in service

1.  inject `HttpClientModule` in service's constructor
1.  Encapsulate Http errors in service
1.  Don't expose implementation details to the component
1.  Use RxJS "catchError" operator
1.  Return custom errors to components

## Model for error

```ts
// Book return error model

export class BookTrackerError {
  errorNumber: number;
  message: string;
  friendlyMessage: string;
}
```

## Service demo

```ts
// book.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map, tap, catchError } from 'rxjs/operators';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

import { Book } from 'app/models/book';
import { BookTrackerError } from 'app/models/bookTrackerError';
import { FormattedBook } from 'app/models/formattedBook';

@Injectable()
export class BookService {
  constructor(private http: HttpClient) {}

  private handleHttpError(error: HttpErrorResponse): Observable<BookTrackerError> {
    let dataError = new BookTrackerError();
    dataError.errorNumber = 100;
    dataError.message = error.statusText;
    dataError.friendlyMessage = 'An error occurred retrieving data.';
    return ErrorObservable.create(dataError);
  }

  getAll(): Observable<Book[] | BookTrackerError> {
    return this.http.get<Book[]>(`/api/books`).pipe(catchError((err) => this.handleHttpError(err)));
  }

  // second param is optional
  getOne(id: number): Observable<Book> {
    return this.http.get<Book>(`/api/books/${id}`, {
      headers: new HttpHeaders({
        Accept: 'application/json',
        Authorization: 'my-token',
      }),
    });
  }

  // if UI needs a formatted book
  getOneFormatted(id: number): Observable<FormattedBook> {
    return this.http.get<Book>(`/api/books/${id}`).pipe(
      // data convert
      map(
        (b) =>
          <FormattedBook>{
            title: b.bookTitle,
            year: b.publicationYear,
          },
      ),
      // use converted data to do some logic
      tap((newBook) => console.log(newBook)),
    );
  }

  // return 201 if successful
  add(book: Book): Observable<Book> {
    return this.http.post<Book>(`/api/books`, book, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      // third param is optional
    });
  }

  // return 204 no content if successful
  update(book: Book): Observable<void> {
    return this.http.put<void>(`/api/books/${book.id}`, book, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      // third param is optional
    });
  }

  // return 204 no content if successful
  deleteBook(id: Book): Observable<void> {
    return this.http.put<void>(`/api/books/${id}`);
  }
}
```

## Component that consumes service

```ts
// component using the service

ngOnInit() {
  this.bookService.getAll().subscribe(
    (data: Book[]) => this.books = data,
    (err: BookTrackerError) => console.log(err.friendlyMessage),
    () => console.log('all done')
  )
}
```

## Use a resolver

If our component doesn't call bookService in ngOnInit to load data, but use a resolver.

```ts
// books-resolver.service.ts

import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { Book } from 'app/models/book';
import { BookService } from 'app/core/book.service';
import { BookTrackerError } from 'app/models/bookTrackerError';

@Injectable()
export class BooksResolverService implements Resolve<Book[] | BookTrackerError> {
  constructor(private bookService: BookService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<Book[] | BookTrackerError> {
    return this.bookService.getAll().pipe(catchError((err) => of(err)));
  }
}
```

## Interceptors

1.  Adding headers to all requests
1.  Login
1.  Reporting progress events
1.  Client-side caching

Providing an interceptor:

```ts
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AddHeaderInterceptor } from './add-header.interceptor';
import { LogResponseInterceptor } from 'app/core/log-response.interceptor';
import { CacheInterceptor } from './cache.interceptor';

@NgModule({
  imports: [],
  declarations: [],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LogResponseInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AddHeaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
  ],
})
export class CoreModule {}
```

```ts
// log response interceptor

import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEventType,
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';

@Injectable()
export class LogResponseInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(`LogResponseInterceptor - ${req.url}`);

    return next.handle(req).pipe(
      tap((event) => {
        if (event.type === HttpEventType.Response) {
          console.log(event.body);
        }
      }),
    );
  }
}
```

```ts
// add-header.interceptor
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AddHeaderInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(`AddHeaderInterceptor - ${req.url}`);

    let jsonReq: HttpRequest<any> = req.clone({
      setHeaders: { 'Content-Type': 'application/json' },
    });

    return next.handle(jsonReq);
  }
}
```

### Caching with interceptors

client --> interceptor (check cache) --> no ? --> server

### Role of cache service

* Provide a data structure for the cached items
* add items to the cache
* retrieve items from the cache
* remove items from the cache (cache invalidation)

```ts
// http-cache.service.ts
import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

@Injectable()
export class HttpCacheService {
  private requests: any = {};

  constructor() {}

  put(url: string, response: HttpResponse<any>): void {
    this.requests[url] = response;
  }

  get(url: string): HttpResponse<any> | undefined {
    return this.requests[url];
  }

  invalidateUrl(url: string): void {
    this.requests[url] = undefined;
  }

  invalidateCache(): void {
    this.requests = {};
  }
}
```

```ts
// cache interceptor
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { HttpCacheService } from 'app/core/http-cache.service';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  constructor(private cacheService: HttpCacheService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // pass along non-cacheable requests and invalidate cache
    if (req.method !== 'GET') {
      console.log(`Invalidating cache: ${req.method} ${req.url}`);
      this.cacheService.invalidateCache();
      return next.handle(req);
    }

    // attempt to retrieve a cached response
    const cachedResponse: HttpResponse<any> = this.cacheService.get(req.url);

    // return cached response
    if (cachedResponse) {
      console.log(`Returning a cached response: ${cachedResponse.url}`);
      console.log(cachedResponse);
      return of(cachedResponse);
    }

    // send request to server and add response to cache
    return next.handle(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          console.log(`Adding item to cache: ${req.url}`);
          this.cacheService.put(req.url, event);
        }
      }),
    );
  }
}
```

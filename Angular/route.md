# Route

## Route config

Suppose we are building a small app and we only have a app routing and all components are registered in app.module.

```ts
import { Routes } from '@angular/router';
import { About } from './about/about';
import { Home } from './home/home';
import { RepoBrowser } from './github/repo-browser/repo-browser';
import { RepoList } from './github/repo-list/repo-list';
import { RepoDetail } from './github/repo-detail/repo-detail';

export const rootRouterConfig: Routes = [
  { path: '', redirectTo: 'home', terminal: true },
  { path: 'home', component: Home },
  { path: 'about', component: About },
  {
    path: 'github',
    component: RepoBrowser,
    children: [
      { path: '', component: RepoList },
      {
        path: ':org',
        component: RepoList,
        children: [{ path: '', component: RepoDetail }, { path: ':repo', component: RepoDetail }],
      },
    ],
  },
];
```

## ActivatedRoute params subscribe

List of models:

```html
<h3>Repo list</h3>
<ul>
  <li *ngFor="let repo of repos | async">
    <a [routerLink]="['/github', repo.owner.login, repo.name]">
      {{ repo.name }}
    </a>
  </li>
</ul>

<router-outlet></router-outlet>
```

```ts
import { Component, OnInit } from '@angular/core';
import { GithubService } from '../services/github.service';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'repo-list',
  styleUrls: ['./repo-list.css'],
  templateUrl: './repo-list.html',
})
export class RepoList implements OnInit {
  org: string;
  repos: Observable<any>;

  constructor(public githubService: GithubService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.org = params['org'];
      if (this.org) {
        this.repos = this.githubService.getReposForOrg(this.org);
      }
    });
  }
}
```

## Navigate by `Router`

Above List of Models, there is a search area. When clicking the button, the page navigates to Single Model detail page.

```html
<input type="text" #repoName placeholder="Search Github Orgs" />
<button (click)="searchForOrg(repoName.value)">Search Orgs</button>

<router-outlet></router-outlet>
```

```ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GithubService } from '../services/github.service';

@Component({
  selector: 'repo-browser',
  templateUrl: './repo-browser.html',
  styleUrls: ['./repo-browser.css'],
})
export class RepoBrowser {
  constructor(private router: Router, private githubService: GithubService) {}

  searchForOrg(orgName: string) {
    this.githubService.getOrg(orgName).subscribe(({ name }) => {
      console.log(name);
      this.router.navigate(['/github', orgName]);
    });
  }
}
```

## ActivatedRoute to query params

Model detail page:

```html
<h2>{{ repoDetails.full_name }}</h2>

<pre>this.repoDetails = {{ repoDetails | json }}</pre>
```

```ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GithubService } from '../services/github.service';

@Component({
  selector: 'repo-detail',
  styleUrls: ['./repo-detail.css'],
  templateUrl: './repo-detail.html',
})
export class RepoDetail implements OnInit {
  private org: string;
  private repo: string;
  public repoDetails: any = {};

  constructor(
    public githubService: GithubService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      // query previous route info
      this.org = this.router.routerState.parent(this.route).snapshot.params['org'];

      this.repo = params['repo'] || '';

      if (this.repo) {
        this.githubService.getRepoForOrg(this.org, this.repo).subscribe((repoDetails) => {
          this.repoDetails = repoDetails;
        });
      }
    });
  }
}
```

## [RouteStateSnapshot vs RouteState](https://vsavkin.com/angular-router-understanding-router-state-7b5b95a12eab)

- RouteStateSnapshot is an immutable data structure representing the state of the router at a particular moment in time. Any time a component is added or removed or parameter is updated, a new snapshot is created.

- RouterState is similar to RouteStateSnapshot, except that it represents the state of the router changing over time.

- ActivatedRoute: ActivatedRoute provides access to the url, params, data, queryParams, and fragment observables

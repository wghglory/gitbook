# 前端主流框架区别

## React

* Component-based
* MVC's V: small view library
* Virtual DOM: lightweight, representation of actual DOM in memory
* one way data flow
* manage state => UI updates automatically by React
* React is smart to update only necessary UI by comparing previous state and new state
* Presentational and Container Components

## Angular4

* MVVM: full framework with all the tooling
* Component-based too
* Typescript
* @Component has template or templateUrl, style or styleUrl. Styles work only in current component
* Data Validation

## Vue.js

* Lightweight
* Like angular1 syntax

## Scalability

* Angular is easy to scale thanks to its design as well as a powerful CLI.
* React claims to be more testable and therefore scalable than vue and I think that is partly true.
* Vue being just behind react, it is a good choice however it lacks a list of best scaling practices, resulting in a lot of spaghetti code.

## size

* vue is the smallest and contains a lot as well. Actually you might think it doesn’t matter, but say that to a cheap android 3g smartphone and I don’t think you will be so sure about it.
* react is bigger than vue, but still smaller than angular. That’s all I’ve got to say.
* angular is way bigger, causing longer load times and performance issues on mobiles.
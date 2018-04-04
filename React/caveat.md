# Something you need to know about react

### 1. React is MVC's V

### [2. Keep your components small](https://camjackson.net/post/9-things-every-reactjs-beginner-should-know#keep-your-components-small)

```jsx
const LatestPostsComponent = (props) => (
  <section>
    <div>
      <h1>Latest posts</h1>
    </div>
    <div>{props.posts.map((post) => <PostPreview key={post.slug} post={post} />)}</div>
  </section>
);
```

The component itself is a `<section>`, with only 2 `<div>`s inside it. The first one has a heading, and second one just maps over some data, rendering a `<PostPreview>`for each element. That last part, extracting the `<PostPreview>` as its own component, is the important bit.

### [3. Write functional components](https://camjackson.net/post/9-things-every-reactjs-beginner-should-know#write-functional-components)

```jsx
class MyComponent extends React.Component {
  render() {
    return <div className={this.props.className} />;
  }
}
```

```jsx
const MyComponent = (props) => <div className={props.className} />;
```

1.  don't use `ref` often: ref encourage a very imperative, almost jquery-like way of writing components, taking us away from the functional, one-way data flow philosophy for which we chose React in the first place!
1.  don't use `state` if possible

### [4. Write stateless components](https://camjackson.net/post/9-things-every-reactjs-beginner-should-know#write-stateless-components)

#### State makes components difficult to test

When components are just functions of input props, testing is a lot easier. (More on testing later).

#### State makes it too easy to put business logic in the component

React is a **view library**, so while _render_ logic in the components is OK, _business_ logic is a massive code smell. But when so much of your application's state is right there in the component, easily accessible by `this.state`, it can become really tempting to start putting things like calculations or validation into the component, where it does not belong. Revisiting my earlier point, this makes testing that much harder - you can't test render logic without the business logic getting in the way, and vice versa!

### [6. Always use propTypes](https://camjackson.net/post/9-things-every-reactjs-beginner-should-know#always-use-proptypes)

[propTypes](https://facebook.github.io/react/docs/reusable-components.html#prop-validation) offer us a really easy way to add a bit more type safety to our components. They look like this:

```jsx
import PropTypes from 'prop-types';

const ListOfNumbers = (props) => (
  <ol className={props.className}>{props.numbers.map((number) => <li>{number}</li>)}</ol>
);

ListOfNumbers.propTypes = {
  className: PropTypes.string.isRequired,
  numbers: PropTypes.arrayOf(PropTypes.number),
};
```

When in development (not production), if any component is not given a required prop, or is given the wrong type for one of its props, then React will log an error to let you know. This has several benefits:

* It can catch bugs early, by preventing silly mistakes
* If you use `isRequired`, then you don't need to check for `undefined` or `null` as often
* It acts as documentation, saving readers from having to search through a component to find all the props that it needs

The above list looks a bit like one you might see from someone advocating for static typing over dynamic typing. Personally, I usually prefer dynamic typing for the ease and speed of development it provides, but I find that propTypes add a lot of safety to my React components, without making things any more difficult. Frankly I see no reason not to use them.

**One final tip is to make your tests fail on any propType errors**. The following is a bit of a blunt instrument, but it's simple and it works:

```jsx
beforeAll(() => {
  console.error = (error) => {
    throw new Error(error);
  };
});
```

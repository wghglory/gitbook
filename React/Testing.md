# [Use shallow rendering](https://camjackson.net/post/9-things-every-reactjs-beginner-should-know#use-shallow-rendering)

Testing React components is still a bit of a tricky topic. Not because it's hard, but because it's still an evolving area, and no single approach has emerged as the 'best' one yet. At the moment, my go-to method is to use [shallow rendering](https://facebook.github.io/react/docs/test-utils.html#shallow-rendering) and prop assertions.

Shallow rendering is nice, because it allows you to render a single component completely, but without delving into any of its child components to render those. Instead, the resulting object will tell you things like the type and props of the children. This gives us good isolation, allowing testing of a single component at a time.

There are three types of component unit tests I find myself most commonly writing:

#### Render logic

Imagine a component that should conditionally display either an image, or a loading icon:

```jsx
const Image = (props) => {
  if (props.loading) {
    return <LoadingIcon />;
  }

  return <img src={props.src} />;
};
```

We might test it like this:

```jsx
describe('Image', () => {
  it('renders a loading icon when the image is loading', () => {
    const image = shallowRender(<Image loading={true} />);
    expect(image.type).toEqual(LoadingIcon);
  });

  it('renders the image once it has loaded', () => {
    const image = shallowRender(<Image loading={false} src="https://example.com/image.jpg" />);
    expect(image.type).toEqual('img');
  });
});
```

Easy! I should point out that the API for shallow rendering is slightly more complicated than what I've shown. The `shallowRender` function used above is our own helper, which wraps the real API to make it easier to use.

Revisiting our `ListOfNumbers` component above, here is how we might test that the map is done correctly:

```jsx
describe('ListOfNumbers', () => {
  it('renders an item for each provided number', () => {
    const listOfNumbers = shallowRender(<ListOfNumbers className="red" numbers={[3, 4, 5, 6]} />);
    expect(listOfNumbers.props.numbers.length).toEqual(4);
  });
});
```

#### Prop transformations

In the last example, we dug into the children of the component being tested, to make sure that they were rendered correctly. We can extend this by asserting that not only are the children there, but that they were given the correct props. This is particularly useful when a component does some transformation on its props, before passing them on. For example, the following component takes CSS class names as an array of strings, and passes them down as a single, space-separated string:

```jsx
const TextWithArrayOfClassNames = (props) => (
  <div>
    <p className={props.classNames.join(' ')}>{props.text}</p>
  </div>
);

describe('TextWithArrayOfClassNames', () => {
  it('turns the array into a space-separated string', () => {
    const text = 'Hello, world!';
    const classNames = ['red', 'bold', 'float-right'];
    const textWithArrayOfClassNames = shallowRender(
      <TextWithArrayOfClassNames text={text} classNames={classNames} />,
    );

    const childClassNames = textWithArrayOfClassNames.props.children.props.className;
    expect(childClassNames).toEqual('red bold float-right');
  });
});
```

One common criticism of this approach to testing is the proliferation of `props.children.props.children`... While it's not the prettiest code, personally I find that if I'm being annoyed by writing `props.children` too much in the one test, that's a sign that the component is too big, complex, or deeply nested, and should be split up.

The other thing I often hear is that your tests become too dependent on the component's internal implementation, so that changing your DOM structure slightly causes all of your tests to break. This is definitely a fair criticism, and a brittle test suite is the last thing that anyone wants. The best way to manage this is to (wait for it) keep your components small and simple, which should limit the number of tests that break due to any one component changing.

#### User interaction

Of course, components are not just for display, they're also interactive:

```jsx
const RedInput = (props) => <input className="red" onChange={props.onChange} />;
```

Here's my favorite way to test these:

```jsx
describe('RedInput', () => {
  it('passes the event to the given callback when the value changes', () => {
    const callback = jasmine.createSpy();
    const redInput = shallowRender(<RedInput onChange={callback} />);

    redInput.props.onChange('an event!');
    expect(callback).toHaveBeenCalledWith('an event!');
  });
});
```

It's a bit of a trivial example, but hopefully you get the idea.

#### Integration testing

So far I've only covered unit testing components in isolation, but you're also going to want some higher level tests in order to ensure that your application connects up properly and actually works.

1.  [Render your entire tree of components](https://facebook.github.io/react/docs/test-utils.html#renderintodocument) (instead of shallow rendering).
1.  Reach into the DOM (using the [React TestUtils](https://facebook.github.io/react/docs/test-utils.html), or [jQuery](https://jquery.com/), etc) to find the elements you care about the most, and then assert on their HTML attributes or contents, or[simulate DOM events](https://facebook.github.io/react/docs/test-utils.html#simulate) and then assert on the side effects (DOM or route changes, AJAX calls, etc)

#### On TDD

In general, I don't use TDD when writing React components.

When working on a component, I often find myself churning its structure quite a bit, as I try to land on the simplest HTML and CSS that looks right in whatever browsers I need to support. And because my component unit testing approach tends to assert on the component structure, TDD would cause me to be constantly fixing my tests as I tweak the DOM, which seems like a waste of time.

The other factor to this is that the components should be so simple that the advantages of test-first are diminished. All of the complex logic and transformations are pulled out into action creators and reducers, which is where I can (and do) reap the benefits of TDD.

Which brings me to my final point about testing. In this whole section, I've been talking about testing the components, and that's because there's no special information needed for testing the rest of a Redux-based app. As a framework, Redux has very little 'magic' that goes on behind the scenes, which I find reduces the need for excessive mocking or other test boilerplate. Everything is just plain old functions (many of them pure), which is a real breath of fresh air when it comes to testing.

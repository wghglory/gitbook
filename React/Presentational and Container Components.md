### Presentational and Container Components

My **presentational** components:

- Are concerned with *how things look*.
- May contain both presentational and container components inside, and usually have some DOM markup and styles of their own.
- Often allow containment via `this.props.children`.
- Have no dependencies on the rest of the app, such as Flux actions or stores.
- Don’t specify how the data is loaded or mutated.
- Receive data and callbacks exclusively via props.
- Rarely have their own state (when they do, it’s UI state rather than data).
- Are written as [functional components](https://facebook.github.io/react/blog/2015/10/07/react-v0.14.html#stateless-functional-components) unless they need state, lifecycle hooks, or performance optimizations.
- Examples: *Page, Sidebar, Story, UserInfo, List.*

Presentational components are components that only render UI elements. They do not tightly couple with any data architecture. Instead, they receive data as props and send data to their parent component via callback function properties. They are purely concerned with the UI and can be reused across applications that contain different data. 

My **container** components:

- Are concerned with *how things work*.
- May contain both presentational and container components inside but usually don’t have any DOM markup of their own except for some wrapping divs, and never have any styles.
- Provide the data and behavior to presentational or other container components.
- Call Flux actions and provide these as callbacks to the presentational components.
- Are often stateful, as they tend to serve as data sources.
- Are usually generated using [higher order components](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750) such as `connect()` from React Redux, `createContainer()` from Relay, or `Container.create()` from Flux Utils, rather than written by hand.
- Examples: *UserPage, FollowersSidebar, StoryContainer, FollowedUserList.*

Container components are components that connect presentational components to the data. In our case, container components will retrieve the store via context and manage any interactions with the store. They render presentational components by mapping properties to state and callback function properties to the store’s dispatch method. Container components are not concerned with UI elements; they are used to connect presentational components to data.

I put them in different folders to make this distinction clear.

### Benefits of This Approach

- Better separation of concerns. You understand your app and UI better by writing components this way.
- Better reusability. Presentational components are reusable. They are easy to swap out and easy to test. They can be composed to create the UI. Presentational components can be reused across browser applications that may use different data libraries. You can use the same presentational component with completely different state sources, and turn those into separate container components that can be further reused.
- Presentational components are essentially your app’s “palette”. You can put them on a single page and let the designer tweak all their variations without touching the app’s logic. You can run screenshot regression tests on that page.
- This forces you to extract “layout components” such as *Sidebar, Page, ContextMenu* and use `this.props.children` instead of duplicating the same markup and layout in several container components.

Remember, **components don’t have to emit DOM.** They only need to provide composition boundaries between UI concerns.

Container components are not concerned with the UI at all. Their main focus is connecting the presentation components to the data architecture. Container components can be reused across device platforms to connect native presentational components to the data.

### When to Introduce Containers?

I suggest you to start building your app with just presentational components first. Eventually you’ll realize that you are passing too many props down the intermediate components. When you notice that some components don’t use the props they receive but merely forward them down and you have to rewire all those intermediate components any time the children need more data, it’s a good time to introduce some container components. This way you can get the data and the behavior props to the leaf components without burdening the unrelated components in the middle of the tree.

This is an ongoing process of refactoring so don’t try to get it right the first time. As you experiment with this pattern, you will develop an intuitive sense for when it’s time to extract some containers, just like you know when it’s time to extract a function. My [free Redux Egghead series](https://egghead.io/series/getting-started-with-redux) might help you with that too!

### Other Dichotomies

It’s important that you understand that the distinction between the presentational components and the containers is not a technical one. Rather, it is a distinction in their purpose.

By contrast, here are a few related (but different!) technical distinctions:

- **Stateful and Stateless.** Some components use React `setState()` method and some don’t. While container components tend to be stateful and presentational components tend to be stateless, this is not a hard rule. Presentational components can be stateful, and containers can be stateless too.
- **Classes and Functions.** Functional components are simpler to define but they lack certain features currently available only to class components. Some of these restrictions may go away in the future but they exist today. Because functional components are easier to understand, I suggest you to use them unless you need state, lifecycle hooks, or performance optimizations, which are only available to the class components at this time.
- **Pure and Impure.** People say that a component is pure if it is guaranteed to return the same result given the same props and state. Pure components can be defined both as classes and functions, and can be both stateful and stateless. Another important aspect of pure components is that they don’t rely on deep mutations in props or state, so their rendering performance can be optimized by a shallow comparison in their [*shouldComponentUpdate()* hook](https://facebook.github.io/react/docs/pure-render-mixin.html). Currently only classes can define *shouldComponentUpdate()* but that may change in the future.

Both presentational components and containers can fall into either of those buckets. In my experience, presentational components tend to be stateless pure functions, and containers tend to be stateful pure classes. However this is not a rule but an observation, and I’ve seen the exact opposite cases that made sense in specific circumstances.


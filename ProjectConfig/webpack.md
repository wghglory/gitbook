# Webpack

Webpack is a **module bundler** that helps us make production and development transformations to the code we write. The reason for it to exist is that web developers shouldn’t have to transform code every time they want to test or deploy it. These transformations include but are not limited to: **bundling js, bundling css, minification and uglification, jsx to js, sass/less to css**, et cetera.

Webpack needs the **entry point** for the main javascript files. It has a modules property that we use to specify all loaders (rules) that need to make a transformation on the code. It has `plugins` property which specifies plugins like `html-webpack-config`’s object in its array. It needs the template and filename in the output distribution folder.

Webpack loaders allow us to preprocess files (like css, et cetera) as we `require` them into the root js file.

While using `webpack-dev-server` to run a web server locally, any changes we make do not cause webpack to compile our bundle to the dist folder. However, it dynamically updates quickly because webpack saves the changes in a **cache** that is meant to refresh quickly rather than compiling a build bundle every time a change is made.

2 core things: **Loaders, plugins**

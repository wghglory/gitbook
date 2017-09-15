# Project Structure

## Why Include a Demo App?

* Examples of:
  * Automated deployment
  * Directory structure and file naming
  * Framework usage
  * Testing
  * Mock API
* Codifies decisions
* Interactive example of working with starter

## Tips

1. Cannot put js in html. Put js in a .js file

    ```html
    <html>
      <body>
      <script>
      // slap code here...
      </script>
    </html>
    ```

    * Test this?
    * Lint this?
    * Reuse this?
    * Transpile this?
    * Import explicit dependencies?

1. Consider organizing by feature

    _Organize by file type_ (MVC)

    ```
    /components
    /data
    /models
    /views
    ```

    _Organize by Feature_ (larger app)

    ```
    /authors
    /courses
    ```

1. Extract logic into "POJOs" (plain old javascript object, no framework-specific code)

    Put utils to utils folder, this doesn't have any relationship with react.

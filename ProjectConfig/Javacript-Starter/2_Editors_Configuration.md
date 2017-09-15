# Editors, Configuration

## Editor (Vscode, atom, webstorm, brackets)

* Strong ES2015+ support
  * Autocompletion
  * Parse ES6 imports
  * Report unused imports
  * Automated refactoring
* Framework intelligence
* Built in terminal

## Automated Consistency via Editorconfig

**.editorconfig**:

```
# editorconfig.org
root = true

[*]
indent_style = space  # hit tab, editorconfig converts it into 2 spaces
indent_size = 2
end_of_line = lf  # line feed, \n
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
```

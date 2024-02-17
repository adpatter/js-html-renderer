# A JS HTML Renderer

A JS DSL for rendering HTML on the client or the server.

## Introduction
The JS HTML Renderer provides a concise syntax for writing HTML using JavaScript.  You can create a static template and inject dynamic content into it.  JS Symbols are used in order to designate where dynamic content will be inserted.

### Features
- An intuitive and concise syntax.
- Create your own custom HTML tags.
- Precompiled HTML.

## Table of Contents
- Installation
- Usage

## Installation

```bash
npm install js-html-renderer
```

## Usage
In this example you will create an HTML document that contains greetings in English and Esperanto.
### Import typings and relevant tags.
```ts
import { Template, doctype, html, head, body, main, ul, li } from "js-html-renderer";
```
### Create Symbols for dynamic content.
```ts
const $greetings = Symbol('greetings_fragment');
```
### Create an HTML template.
You will use the Symbol created above in order to designate where dynamic content will be inserted.
```ts
const template: Template = doctype()(
    html()(
        head()(
        ),
        body()(
            main({ id: 'main' })(
                $greetings
            )
        )
    )
);
```
### Create an HTML list of greetings using JavaScript.
```ts
const greetings = ul({ id: 'greetings' })(
    ['Hello, World!', 'Saluton, Mondo!'].map(
        (greeting: string, index: number) => li({ id: `greeting-${index}` })(greeting)
    )
);
```
### Inject the dynamic content and render the HTML.
Use `template.render` in order to inject the unordered HTML list of `greetings` created above into the template.
```ts
const html_text = template.render(
    {
        [$greetings]: greetings,
    }
);

```
### Log the result.
```ts
console.log(html_text);
```
#### The resulting HTML (formatted for clarity).
```html
<!DOCTYPE html>
<html>
<head></head>
<body>
    <main id="main">
        <ul id="greetings">
            <li id="greeting-0">Hello, World!</li>
            <li id="greeting-1">Saluton, Mondo!</li>
        </ul>
    </main>
</body>

</html>
```




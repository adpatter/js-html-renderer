# JS HTML Renderer

A JS DSL for rendering HTML on the client or the server.

## Introduction
The JS HTML Renderer provides a concise and intuitive syntax for writing HTML using JavaScript.  You can use the Renderer in order to create a static template and inject dynamic content into it.  JS [Symbols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) are used in order to designate where dynamic content will be inserted.

The Renderer's syntax is intuitive and concise:

```ts
const template: Template = doctype()(
    html()(
        head()(
        ),
        body()(
            main({ id: 'main' })(
                $greetings // Dynamic content may be injected wherever there is a Symbol.
            )
        )
    )
);
```

### Features
- An intuitive and concise syntax.
- Create your own custom HTML tags (i.e., for [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements)).
- Use the prettier of your choice for beautifying your HTML.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Custom HTML Tags](#custom-html-tags)

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
const $greetings = Symbol('greetings');
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
const helloWorld = ['Hello, World!', 'Saluton, Mondo!'];

const greetings = ul({ id: 'greetings' })(
    helloWorld.map(
        (greeting: string, index: number) => li({ id: `greeting-${index}` })(greeting)
    )
);
```
### Inject the dynamic content and render the HTML.
Use `template.render` in order to inject the unordered HTML list of `greetings` created above into the template.
```ts
const htmlText = template.render(
    {
        [$greetings]: greetings
    }
);

```
### Log the result to the console.
```ts
console.log(htmlText);
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

## Custom HTML Tags
Custom HTML tags can be created by binding the name of the tag to the first argument of the Renderer's sigil function.  The resulting HTML tag could be used as a [Custom Element](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements).

### Import the Renderer's sigil function for creating custom HTML tags.
```ts
import { $ } from "js-html-renderer";
```
### Create a custom HTML element.
```ts
const my_custom_element = $.bind(null, 'my-custom-element');
```
### Render the custom element with the class name `custom-element` and the string "Hello, World!" for content and log it to the console.
```ts
console.log(my_custom_element({ class: 'custom-element' })('Hello, World!').render());
// <my-custom-element class="custom-element">Hello, World!</my-custom-element>
```
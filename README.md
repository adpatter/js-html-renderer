# JS HTML Renderer

A JS DSL for rendering HTML on the client or the server.

## Introduction
The JS HTML Renderer provides a concise and intuitive syntax for writing HTML using JavaScript.  You can use the Renderer in order to create a static `Template` and inject dynamic content into it.  JS [Symbols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) are used in order to designate where dynamic content will be inserted.

The Renderer's syntax is intuitive and concise e.g.,

```ts
const template: Template = doctype()(
    html()(
        head()(
            title()('The Title'),
                    // ⮴ The element collection may contain text nodes or elements.
            script({ src: 'script.js' })()
                    // ⮴ Attributes are defined using key-value pairs.
        ),
        body()(
            main({ id: 'main-content' })(
                br(),
                // ⮴ Void elements lack parens for a node collection.
                p()(
                    $greetings // 🢤 `$greetings` is a JS Symbol.
                    // ⮴ Dynamic content may be injected wherever there is a Symbol.
                )
            )
        )
    )
);
```

### Features
- An intuitive and concise syntax.
- Create your own custom HTML tags (i.e., for [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements)).
- Performant [prerendering](#prerendering).
- Use the prettier of your choice for beautifying your HTML.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Performance](#performance)
- [Custom HTML Tags](#custom-html-tags)

## Installation

```bash
npm install js-html-renderer
```

## Usage
In this example you will create an HTML document that contains greetings in Esperanto and English.

### Import typings and relevant tags.
```ts
import { Template, doctype, html, head, body, main, ul, li } from "js-html-renderer";
```
### Create Symbols for dynamic content.
```ts
const $greetings = Symbol('greetings');
```
### Create an HTML `Template`.
You will use the `Symbol` created above in order to designate where dynamic content will be inserted.
```ts
const template: Template = doctype()(
    html()(
        head()(
        ),
        body()(
            main({ id: 'main-content' })(
                $greetings
                // ⮴ You will insert an unordered list of greetings here.
            )
        )
    )
);
```
### Create an HTML list of greetings using JavaScript.
You use JavaScript and the Renderer's HTML elements in order to produce dynamic content.  In this example we use `Array.prototype.map` in order to map the elements of `helloWorld` into a list of `li` elements.
```ts
const helloWorld = ['Saluton, Mondo!', 'Hello, World!'];

const greetings = ul({ id: 'greetings' })(
    helloWorld.map(
        (greeting: string, index: number) => li({ id: `greeting-${index}` })(greeting)
            // This is an HTML `li` element. ⮵ 
            // Each `li` element will contain its respective `id` attribute.
    ) 
);
```
#### The `greetings` HTML fragment looks like this:
```html
<ul id="greetings">
    <li id="greeting-0">Saluton, Mondo!</li>
    <li id="greeting-1">Hello, World!</li>
</ul>
```
### Inject the dynamic content and render the HTML.
You use `template.render` in order to inject the unordered HTML list of `greetings` created above into the `Template`.
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
    <main id="main-content">
        <ul id="greetings">
            <li id="greeting-0">Saluton, Mondo!</li>
            <li id="greeting-1">Hello, World!</li>
        </ul>
    </main>
</body>
</html>
```
## Performance
### Prerendering
HTML is prerendered at the time the `Template` is created.  The HTML elements are concatenated into a string separated by just the Symbolic dynamic components of the `Template`.  

For example, in the `Template` below, all the HTML elements, including the `footer`, are prerendered at the time of `Template` creation.  This means that the `Template` may be reused without having to reconstruct the HTML elements that comprise it at each use.

The final render step, invoked using the `template.render` method, involves just injection of dynamic content and a final concatenation of the prerenderd HTML.

```ts
const template: Template = doctype()(
    html()(
        head()(
        ),
        body()(
            main({ id: 'main-content' })(
                $greetings
            ),
            footer({id: 'footer'})()
        )
    )
);
```

## Custom HTML Tags
Custom HTML tags can be created by binding the name of the tag to the first argument of the Renderer's sigil function.  The resulting HTML tag can be used as a [Custom Element](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements).

### Example

#### Import the Renderer's sigil function for creating custom HTML tags.
```ts
import { $ } from "js-html-renderer";
```
#### Create a custom HTML element.
```ts
const my_custom_element = $.bind(null, 'my-custom-element');
```
#### Render the custom element with the class name `custom-element` and content "Hello, World!" and log it to the console.
```ts
console.log(my_custom_element({ class: 'custom-element' })('Hello, World!').render());
```
##### Output
```html
<my-custom-element class="custom-element">Hello, World!</my-custom-element>
```

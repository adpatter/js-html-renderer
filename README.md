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
- Create custom HTML tags (i.e., for [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements)).
- Performant [prerendering](#prerendering).
- Use the prettier of your choice for beautifying your HTML.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Performance](#performance)
- [Custom HTML Tags](#custom-html-tags)
- [Hello, World! Example](#hello-world-example)

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
### Create a `Symbol` variable for dynamic content.
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
HTML is prerendered at the time the root `Template` object is created.  The resulting `Template` object contains an array of prerendered HTML elements and JavaScript Symbols.

For example, in the example shown below, all the HTML elements, including the `footer`, are prerendered at the time the `Template` is created.  This means that the `Template` may be reused without having to reconstruct the HTML elements that comprise it.

The final render step, invoked using `template.render`, involves a single pass over the elements of the array in order to swap out the Symbols with dynamic content and, finally, a concatenation of the resulting HTML.

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

### How to create a custom HTML tag.

#### Import the Renderer's sigil function for creating custom HTML tags.
```ts
import { $ } from "js-html-renderer";
```
#### Create a custom HTML tag named `my-custom-element`.
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
## "Hello, World!" Example

In this example you will create a multi-lingual Greeter application. You will create an HTTP server that listens on port 3000 and serves dynamic content that contains greetings from around the world.  Please see the [Hello, World!](https://github.com/faranalytics/js-html-renderer/tree/main/examples/hello_world) example for a working implementation.

### Import Node's native HTTP server, the `Template` type, relevant HTML tags, and a dictionary of "Hello, World!" greetings.
```ts
import * as http from "node:http";
import { Template, doctype, html, head, title, script, link, body, main, section, h1, ul, li, footer } from "js-html-renderer";
import { worlds } from "./hello_worlds.js";
```

### Create the `Symbol` variables and the `Template`.
Dynamic content will be injected into the `Template` at each `Symbol` on each request.
```ts
const $main_content = Symbol('main_content');
const $title = Symbol('title');
const $script = Symbol('script');
const $inline_script = Symbol('inline_script');
const $style_sheet = Symbol('style_sheet');

const template: Template = doctype()(
    html()(
        head()(
            $title,
            $style_sheet,
            $script,
            $inline_script
        ),
        body()(
            main({ id: 'main-content' })(
                $main_content
            ),
            footer({ id: 'footer' })()
        )
    )
);
```

### Create a function to be rendered in an inline script element.
```ts
function sayHello() {
    alert('Hello, World!');
}
```

### Create the web application.
```ts
http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    if (req.url == '/') {
        // Create an unordered list of greetings.
        const greetings = ul({ id: 'content' })(
            Object.values(worlds).map(
                (greeting: string, index: number) => li({ id: `greeting-${index}`, class: 'greetings' })(
                    greeting
                )
            )
        );
        // Create the content for the main section and add an inline `click` handler to the `section` element.
        const html_main_content = section({ 'onClick': 'sayHello();' })(
            h1()('Greetings from Around the World!'),
            greetings
        );
        // Create a title element.
        const html_title = title({ id: 'title' })('The Title');
        // Create a script element.
        const html_script = script({ src: './script.js' })();
        // Create a link element for a stylesheet.
        const html_stylesheet = link({ rel: "stylesheet", href: "styles.css" })();
        //Create an inline script element.
        const inline_script = script()(
            sayHello.toString()
        );

        // Inject the dynamic materials into the `Template`.
        const htmlText = template.render(
            {
                [$title]: html_title,
                [$style_sheet]: html_stylesheet,
                [$script]: html_script,
                [$inline_script]: inline_script,
                [$main_content]: html_main_content
            }
        );
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(htmlText);
    }
    else {
        res.writeHead(404, '').end();
    }
}).listen(3000);
```
#### Output:
# Greetings from Around the World!
- Saluton, Mondo!
- Hello Wêreld!
- Përshendetje Botë!
- ሰላም ልዑል!
- مرحبا بالعالم!
- Բարեւ աշխարհ!
- Kaixo Mundua!
- Прывітанне Сусвет!
- ওহে বিশ্ব!
- Здравей свят!
- Hola món!
- Moni Dziko Lapansi!
- 你好世界！
- Pozdrav svijete!
- Ahoj světe!
- Hej Verden!
- Hallo Wereld!
- Hello World!
- Tere maailm!
- Hei maailma!
- Bonjour monde!
- Hallo wrâld!
- გამარჯობა მსოფლიო!
- Hallo Welt!
- Γειά σου Κόσμε!
- Sannu Duniya!
- שלום עולם!
- नमस्ते दुनिया!
- Helló Világ!
- Halló heimur!
- Ndewo Ụwa!
- Halo Dunia!
- Ciao mondo!
- こんにちは世界！
- Сәлем Әлем!
- សួស្តី​ពិភពលោក!
- Салам дүйнө!
- ສະ​ບາຍ​ດີ​ຊາວ​ໂລກ!
- Sveika pasaule!
- Labas pasauli!
- Moien Welt!
- Здраво свету!
- Hai dunia!
- ഹലോ വേൾഡ്!
- Сайн уу дэлхий!
- မင်္ဂလာပါကမ္ဘာလောက!
- नमस्कार संसार!
- Hei Verden!
- سلام نړی!
- سلام دنیا!
- Witaj świecie!
- Olá Mundo!
- ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਦੁਨਿਆ!
- Salut Lume!
- Привет мир!
- Hàlo a Shaoghail!
- Здраво Свете!
- Lefatše Lumela!
- හෙලෝ වර්ල්ඩ්!
- Pozdravljen svet!
- ¡Hola Mundo!
- Halo Dunya!
- Salamu Dunia!
- Hej världen!
- Салом Ҷаҳон!
- สวัสดีชาวโลก!
- Selam Dünya!
- Привіт Світ!
- Salom Dunyo!
- Chào thế giới!
- Helo Byd!
- Molo Lizwe!
- העלא וועלט!
- Mo ki O Ile Aiye!
- Sawubona Mhlaba!

#### The rendered HTML (formatted for clarity):
```html
<!DOCTYPE html>
<html>
<head>
    <title id="title">The Title</title>
    <link rel="stylesheet" href="styles.css">
    <script src="./script.js"></script>
    <script>function sayHello() {
            alert('Hello, World!');
        }</script>
</head>
<body>
    <main id="main-content">
        <section onClick="sayHello();">
            <h1>Greetings from Around the World!</h1>
            <ul id="content">
                <li id="greeting-0" class="greetings">Saluton, Mondo!</li>
                <li id="greeting-1" class="greetings">Hello Wêreld!</li>
                <li id="greeting-2" class="greetings">Përshendetje Botë!</li>
                <li id="greeting-3" class="greetings">ሰላም ልዑል!</li>
                <li id="greeting-4" class="greetings">مرحبا بالعالم!</li>
                <li id="greeting-5" class="greetings">Բարեւ աշխարհ!</li>
                <li id="greeting-6" class="greetings">Kaixo Mundua!</li>
                <li id="greeting-7" class="greetings">Прывітанне Сусвет!</li>
                <li id="greeting-8" class="greetings">ওহে বিশ্ব!</li>
                <li id="greeting-9" class="greetings">Здравей свят!</li>
                <li id="greeting-10" class="greetings">Hola món!</li>
                <li id="greeting-11" class="greetings">Moni Dziko Lapansi!</li>
                <li id="greeting-12" class="greetings">你好世界！</li>
                <li id="greeting-13" class="greetings">Pozdrav svijete!</li>
                <li id="greeting-14" class="greetings">Ahoj světe!</li>
                <li id="greeting-15" class="greetings">Hej Verden!</li>
                <li id="greeting-16" class="greetings">Hallo Wereld!</li>
                <li id="greeting-17" class="greetings">Hello World!</li>
                <li id="greeting-18" class="greetings">Tere maailm!</li>
                <li id="greeting-19" class="greetings">Hei maailma!</li>
                <li id="greeting-20" class="greetings">Bonjour monde!</li>
                <li id="greeting-21" class="greetings">Hallo wrâld!</li>
                <li id="greeting-22" class="greetings">გამარჯობა მსოფლიო!</li>
                <li id="greeting-23" class="greetings">Hallo Welt!</li>
                <li id="greeting-24" class="greetings">Γειά σου Κόσμε!</li>
                <li id="greeting-25" class="greetings">Sannu Duniya!</li>
                <li id="greeting-26" class="greetings">שלום עולם!</li>
                <li id="greeting-27" class="greetings">नमस्ते दुनिया!</li>
                <li id="greeting-28" class="greetings">Helló Világ!</li>
                <li id="greeting-29" class="greetings">Halló heimur!</li>
                <li id="greeting-30" class="greetings">Ndewo Ụwa!</li>
                <li id="greeting-31" class="greetings">Halo Dunia!</li>
                <li id="greeting-32" class="greetings">Ciao mondo!</li>
                <li id="greeting-33" class="greetings">こんにちは世界！</li>
                <li id="greeting-34" class="greetings">Сәлем Әлем!</li>
                <li id="greeting-35" class="greetings">សួស្តី​ពិភពលោក!</li>
                <li id="greeting-36" class="greetings">Салам дүйнө!</li>
                <li id="greeting-37" class="greetings">ສະ​ບາຍ​ດີ​ຊາວ​ໂລກ!</li>
                <li id="greeting-38" class="greetings">Sveika pasaule!</li>
                <li id="greeting-39" class="greetings">Labas pasauli!</li>
                <li id="greeting-40" class="greetings">Moien Welt!</li>
                <li id="greeting-41" class="greetings">Здраво свету!</li>
                <li id="greeting-42" class="greetings">Hai dunia!</li>
                <li id="greeting-43" class="greetings">ഹലോ വേൾഡ്!</li>
                <li id="greeting-44" class="greetings">Сайн уу дэлхий!</li>
                <li id="greeting-45" class="greetings">မင်္ဂလာပါကမ္ဘာလောက!</li>
                <li id="greeting-46" class="greetings">नमस्कार संसार!</li>
                <li id="greeting-47" class="greetings">Hei Verden!</li>
                <li id="greeting-48" class="greetings">سلام نړی!</li>
                <li id="greeting-49" class="greetings">سلام دنیا!</li>
                <li id="greeting-50" class="greetings">Witaj świecie!</li>
                <li id="greeting-51" class="greetings">Olá Mundo!</li>
                <li id="greeting-52" class="greetings">ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਦੁਨਿਆ!</li>
                <li id="greeting-53" class="greetings">Salut Lume!</li>
                <li id="greeting-54" class="greetings">Привет мир!</li>
                <li id="greeting-55" class="greetings">Hàlo a Shaoghail!</li>
                <li id="greeting-56" class="greetings">Здраво Свете!</li>
                <li id="greeting-57" class="greetings">Lefatše Lumela!</li>
                <li id="greeting-58" class="greetings">හෙලෝ වර්ල්ඩ්!</li>
                <li id="greeting-59" class="greetings">Pozdravljen svet!</li>
                <li id="greeting-60" class="greetings">¡Hola Mundo!</li>
                <li id="greeting-61" class="greetings">Halo Dunya!</li>
                <li id="greeting-62" class="greetings">Salamu Dunia!</li>
                <li id="greeting-63" class="greetings">Hej världen!</li>
                <li id="greeting-64" class="greetings">Салом Ҷаҳон!</li>
                <li id="greeting-65" class="greetings">สวัสดีชาวโลก!</li>
                <li id="greeting-66" class="greetings">Selam Dünya!</li>
                <li id="greeting-67" class="greetings">Привіт Світ!</li>
                <li id="greeting-68" class="greetings">Salom Dunyo!</li>
                <li id="greeting-69" class="greetings">Chào thế giới!</li>
                <li id="greeting-70" class="greetings">Helo Byd!</li>
                <li id="greeting-71" class="greetings">Molo Lizwe!</li>
                <li id="greeting-72" class="greetings">העלא וועלט!</li>
                <li id="greeting-73" class="greetings">Mo ki O Ile Aiye!</li>
                <li id="greeting-74" class="greetings">Sawubona Mhlaba!</li>
            </ul>
        </section>
    </main>
    <footer id="footer"></footer>
</body>
</html>
```
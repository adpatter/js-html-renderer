import * as http from 'node:http';
import { Template, doctype, html, head, title, script, link, body, main, section, h1, ul, li, footer } from 'js-html-renderer';
import { worlds } from './hello_worlds.js';

const $html_main_content = Symbol('main_content');
const $html_title = Symbol('title');
const $html_script = Symbol('script');
const $html_inline_script = Symbol('inline_script');
const $html_style_sheet = Symbol('style_sheet');

const template: Template = doctype()(
    html()(
        head()(
            $html_title,
            $html_style_sheet,
            $html_script,
            $html_inline_script
        ),
        body()(
            main({ id: 'main-content' })(
                $html_main_content
            ),
            footer({ id: 'footer' })()
        )
    )
);

// Create a function to be rendered in an inline script element.
function sayHello() {
    alert('Hello, World!');
}

const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
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
        // Create a Title element.
        const html_title = title({ id: 'title' })('The Title');
        // Create a Script element.
        const html_script = script({ src: './script.js' })();
        // Create a Link element for a stylesheet.
        const html_stylesheet = link({ rel: 'stylesheet', href: 'styles.css' });
        //Create an inline script.
        const html_inline_script = script()(
            sayHello.toString()
        );

        // Inject the dynamic materials into the `Template`.
        const htmlText = template.render(
            {
                [$html_title]: html_title,
                [$html_style_sheet]: html_stylesheet,
                [$html_script]: html_script,
                [$html_inline_script]: html_inline_script,
                [$html_main_content]: html_main_content
            }
        );
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(htmlText);
    }
    else {
        res.writeHead(404, '').end();
    }
}).listen(3000, '127.0.0.1');

server.on('listening', ()=>console.log('Listening on: http://127.0.0.1:3000/'));
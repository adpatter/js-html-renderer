import { Template, doctype, html, head, title, script, body, main, p, ul, li, $, footer } from "js-html-renderer";

const $greetings = Symbol('greetings_fragment');

const template: Template = doctype()(
    html()(
        head()(
            title()('The Title'),
            script({ 'src': 'script.js' })()
        ),
        body()(
            main({ id: 'main-content' })(
                p()(
                    $greetings
                    // Dynamic content may be injected wherever there is a Symbol.
                )
            ),
            footer({id: 'footer'})()
        )
    )
);

const helloWorld = ['Saluton, Mondo!', 'Hello, World!'];

const greetings = ul({ id: 'greetings' })(
    helloWorld.map(
        (greeting: string, index: number) => li({ id: `greeting-${index}` })(greeting)
    )
);

console.log(greetings.render());

const htmlText = template.render(
    {
        [$greetings]: greetings
    }
);

console.log(htmlText);

const my_custom_element = $.bind(null, 'my-custom-element');

console.log(my_custom_element({ class: 'custom-element' })('Hello, World!').render());

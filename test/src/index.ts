/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Template, doctype, html, head, body, main, ul, li, $ } from "js-html-renderer";

const $the_time_is = Symbol('the_time_is');
const $greetings = Symbol('greetings_fragment');

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

const greetings = ul({ id: 'greetings' })(
    ['Hello, World!', 'Saluton, Mondo!'].map(
        (greeting: string, index: number) => li({ id: `greeting-${index}` })(greeting)
    )
);

const html_text = template.render(
    {
        [$greetings]: greetings,
    }
);

console.log(html_text);

const my_custom_element = $.bind(null, 'my-custom-element');

console.log(my_custom_element({ class: 'custom-element' })('Hello, World!').render());

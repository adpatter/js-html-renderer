import { Template, doctype, html, head, body, main, ul, li, $, footer } from "js-html-renderer";

const $greetings = Symbol("greetings");
const $title = Symbol("title");

const template: Template = doctype()(
  html()(head()($title), body()(main({ id: "main-content" })($greetings), footer({ id: "footer" })()))
);

// Hello, World!
const helloWorld = ["Saluton, Mondo!", "Hello, World!"];

const greetings = ul({ id: "greetings" })(
  helloWorld.map((greeting: string, index: number) => li({ id: `greeting-${index.toString()}` })(greeting))
);

console.log(greetings.render());

const htmlText = template.render({
  [$greetings]: greetings,
});

console.log(htmlText);

// Custom Element
const my_custom_element = $.bind(null, "my-custom-element");

console.log(my_custom_element({ class: "custom-element" })("Hello, World!").render());

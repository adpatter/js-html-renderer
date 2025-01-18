import { Template } from './template';

export function $(name: string, attr?: { [key: string]: string }): typeof Template.prototype.collect {

    const template: Template = new Template(name, attr);

    return template.collect.bind(template);
}
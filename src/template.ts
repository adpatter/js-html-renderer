import { NotImplementedError } from "./errors";
import { attributeName, attributeValue, preamble, tagName } from "./regexes";

type Nodes = Array<string | Template | symbol | ((...args: Nodes) => Template)  | Nodes>;

export class Template {

    protected startTag: string;
    protected endTag: string;
    protected children?: Array<unknown>;

    constructor(name: string, attr?: { [key: string]: string }) {
        this.children = [];
        const isPreamble = name.match(preamble);
        if (!name.match(tagName) && !isPreamble) {
            throw new Error(`The tag or preamble named ${name} matches neither the regular expression ${tagName.toString()} nor the regular expression ${preamble.toString()}.`);
        }
        let tag = '<' + name;
        if (attr && typeof attr == 'object') {
            tag = tag + this.attrToString(attr);
        }
        this.startTag = tag + '>';
        if (!isPreamble) {
            this.endTag = '</' + name + '>';
        }
        else {
            this.endTag = '';
        }
    }

    protected addPart(part: string): void {
        if (this.children) {
            const last = this.children[this.children.length - 1];
            if (typeof last == 'string') {
                this.children[this.children.length - 1] = <string>this.children[this.children.length - 1] + part;
            }
            else {
                this.children.push(part);
            }
        }
    }

    public render(symbols?: { [key: symbol]: string | Template | symbol | typeof Template.prototype.collect }): string {
        // Rendering involves injection of dyanmic content; hence, the Template must not be mutated.
        if (this.children) {
            // A copy of `this.children` is made in order to ensure the Template is not mutated.
            const children = [...this.children];
            if (symbols) {
                for (let i = 0; i < children?.length; i++) {
                    const child = children[i];
                    if (typeof child == 'symbol') {
                        let value = symbols[child];
                        if (value) {
                            if (typeof value == 'string') {
                                children[i] = value;
                            }
                            else if (value instanceof Template) {
                                value = value.render();
                                children[i] = value;
                            }
                            else if (typeof value == 'function') {
                                const result: unknown = value();
                                if (result instanceof Template) {
                                    // This *was* a `collect` function that had not been invoked; hence, it doesn't have any children (e.g., <br>).  Add just its `startTag`. 
                                    this.addPart(result.startTag);
                                }
                                else {
                                    throw new NotImplementedError(`The function ${value.toString()} returned an unhandled type.`);
                                }
                            }
                            else {
                                children[i] = '';
                            }
                        }
                        else {
                            children[i] = '';
                        }
                    }
                }
            }
            return this.startTag + children.join('') + this.endTag;
        }
        else {
            return '';
        }
    }

    public collect(...args: Nodes): Template {
        if (this.children) {
            args = args.flat();
            for (const arg of args) {
                if (typeof arg == 'string') {
                    this.addPart(arg);
                }
                else if (arg instanceof Template) {
                    //  This is a Template (i.e., its `collect` has been called); hence, add its children to the root Template's children.
                    this.addPart(arg.startTag);
                    if (arg.children) {
                        for (const child of arg.children) {
                            if (typeof child == 'string') {
                                this.addPart(child);
                            }
                            else {
                                this.children.push(child);
                            }
                        }
                    }
                    delete arg.children;
                    this.addPart(arg.endTag);
                }
                else if (typeof arg == 'function') {
                    const result: unknown = arg();
                    if (result instanceof Template) {
                        // This *was* a `collect` function that had not been invoked; hence, it doesn't have any children (e.g., <br>).  Add just its `startTag`. 
                        this.addPart(result.startTag);
                    }
                    else {
                        throw new NotImplementedError(`The function ${arg.toString()} returned an unhandled type.`);
                    }
                }
                else if (typeof arg == 'symbol') {
                    // This is a `symbol`; hence it may be replaced during rendering.
                    this.children.push(arg);
                }
                else {
                    throw new NotImplementedError(`The node ${JSON.stringify(arg)} is an unhandled type.`);
                }
            }
        }
        return this;
    }

    protected attrToString(attr?: { [key: string]: string | boolean }) {
        if (!attr) {
            return '';
        }
        const names = Object.keys(attr);
        let attrStr = '';
        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            if (!name.match(attributeName)) {
                throw new Error(`The attribute name ${name}, does not match the regular expression ${attributeName.toString()}.`);
            }
            const value = attr[name];
            if (typeof value == 'string') {
                attrStr = attrStr + ' ' + name + '="';
                if (!value.match(attributeValue)) {
                    throw new Error(`The attribute value ${value}, does not match the regular expression ${attributeValue.toString()}.`);
                }
                for (let i = 0; i < value.length; i++) {
                    const char = value[i];
                    if (char == '&') {
                        attrStr = attrStr + '&amp;';
                    }
                    else if (char == '<') {
                        attrStr = attrStr + '&lt;';
                    }
                    else if (char == '>') {
                        attrStr = attrStr + '&gt;';
                    }
                    else if (char == '"') {
                        attrStr = attrStr + '&quot;';
                    }
                    else {
                        attrStr = attrStr + char;
                    }
                }
                attrStr = attrStr + '"';
            }
            else if (typeof value == 'boolean' && value === true) {
                attrStr = attrStr + ' ' + name;
            }
        }
        return attrStr;
    }
}

// eslint-disable-next-line no-control-regex
export const attributeName = /^[^\u{0000}-\u{001f}\u{0022}\u{0027}\u{003e}\u{002f}\u{003d}\u{e000}-\u{f8ff}\u{f0000}-\u{ffffd}]+$/u;
// eslint-disable-next-line no-control-regex
export const attributeValue = /^[^\u{0000}-\u{0008}\u{000b}\u{000e}-\u{001F}\u{e000}-\u{f8ff}\u{f0000}-\u{ffffd}]*$/u;
export const tagName = /^[\u{0030}-\u{0039}\u{0061}-\u{007A}\u{0041}-\u{005A}-]+$/ui;
export const preamble = /^!DOCTYPE +html/i;
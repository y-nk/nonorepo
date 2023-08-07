import noOptions from "./markdown.md";
document.body.innerHTML = noOptions;

import asString from "./markdown.md?as=string";
document.body.innerHTML = asString;

import asFragment from "./markdown.md?as=fragment";
document.body.appendChild(asFragment());

// Copyright (c) 2024-present AI-Labs

import markdownItKatex from '@vscode/markdown-it-katex';
import MarkdownIt from 'markdown-it';
import container from 'markdown-it-container';

import TurndownService from 'turndown';

import hljs from 'highlight.js';

const md = MarkdownIt({
    html: true,
    linkify: true,
    typographer: true
});


const containerClasses = ['info', 'tip', 'warning', 'danger'];
containerClasses.forEach(name => {
    md.use(container, name, {
        validate: function (params: any) {
            params = params.trim()
            if (params === '') return true;
            return params.indexOf(name) >= 0;
        },
        render: function (tokens: any, idx: any) {
            if (tokens[idx].nesting === 1) {
                return `<div class="container-wrapper ${name}">`;
            } else {
                return '</div>';
            }
        }
    })
})

md.use(markdownItKatex, {
    // 这里可以设置katex的选项
});

// @ts-ignore
// 添加一个自定义规则来处理代码块，并使用 highlight.js 进行高亮
md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const language = token.info.trim()
    const content = token.content
    const head = `<div>`
    const tail = "</div>"
    if (language && hljs.getLanguage(language)) {
        return `${head}<pre><code class="hljs ${language}">${hljs.highlight(content, { language }).value}</code></pre>${tail}`
    } else {
        return `<pre><code class="hljs">${md.utils.escapeHtml(content)}</code></pre>`
    }
}

//options https://github.com/mixmark-io/turndown?tab=readme-ov-file#options
const turndownService = new TurndownService({
    headingStyle: 'atx',
    hr: '---',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    fence: '```',
    emDelimiter: '_',
    strongDelimiter: '**',
    linkStyle: 'inlined',
    linkReferenceStyle: 'full',
    preformattedCode: false,
});

turndownService.keep((node: any) => {
    return !(node && node.nodeName === "DIV");
});

export const markdownToHtml = (markdown: string) => {
    if (!markdown) return markdown;
    const renderHtml = md.render(markdown).trim();
    if (!renderHtml) return markdown;
    const parser = new DOMParser();
    const doc = parser.parseFromString(renderHtml, 'text/html');
    const lis = doc.querySelectorAll("li");

    //"tiptap" does not support empty list items. Here to fill in the gaps
    if (lis) lis.forEach(li => {
        if (!li.innerHTML) li.innerHTML = "<p></p>"
    })

    let html = '';
    for (let i = 0; i < doc.body.children.length; i++) {
        const element = doc.body.children[i];
        if (i == 0 && element.tagName === "P") {
            html += element.innerHTML;
        } else {
            html += element.querySelector("img")
                ? element.innerHTML : element.outerHTML;
        }
    }
    return html;
}


export const htmlToMarkdown = (html: string) => {
    if (!html) return html;
    return turndownService.turndown(html)
}

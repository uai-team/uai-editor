// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { mergeAttributes, Node, NodeViewRendererProps } from '@tiptap/core'
import { TextSelection } from '@tiptap/pm/state'

import { t } from 'i18next'

import { InnerEditor } from '../core/UAIEditor.ts'

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        addTableOfContents: {
            addTableOfContents: () => ReturnType
        }
    }
}

/**
 * 定义文档大纲插件
 */
export default Node.create({
    name: 'toc',
    group: 'block',
    atom: true,
    addAttributes() {
        return {
            vnode: {
                default: true,
            },
        }
    },
    parseHTML() {
        return [{ tag: 'toc' }]
    },
    renderHTML({ HTMLAttributes }) {
        return ['toc', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
    },
    addGlobalAttributes() {
        return [
            {
                types: ['heading'],
                attributes: {},
            },
        ]
    },
    addNodeView() {
        return (props: NodeViewRendererProps) => {
            const container = document.createElement('div');
            container.classList.add(`uai-node-view`);

            const content = document.createElement('div');
            content.classList.add("uai-node-container");
            content.classList.add("uai-hover-shadow");
            content.classList.add("uai-select-outline");
            content.classList.add("uai-node-toc");
            container.appendChild(content);

            const title = document.createElement("p");
            title.classList.add("uai-node-toc-head");
            title.innerHTML = t("toc.title");
            content.appendChild(title);

            let tableOfContents = (props.editor as InnerEditor).uaiEditor.tableOfContents;

            if (tableOfContents) {
                const ul = document.createElement("ul");
                ul.classList.add("uai-node-toc-body");

                tableOfContents.forEach(heading => {
                    const li = document.createElement("li");
                    li.classList.add("uai-node-toc-item");
                    li.classList.add(`level-${heading.level}`);
                    li.setAttribute("key", heading.id);
                    li.innerHTML = heading.textContent;
                    li.addEventListener("click", () => {
                        const element = props.editor.view.dom.querySelector(`[data-toc-id="${heading.id}"`)
                        if (element) {
                            element.scrollIntoView()
                            const pos = props.editor.view.posAtDOM(element, 0)
                            const { tr } = props.editor.view.state ?? {}
                            tr?.setSelection(new TextSelection(tr.doc.resolve(pos ?? 0)))
                            if (tr) {
                                props.editor.view.dispatch(tr)
                                props.editor.view.focus()
                            }
                        }
                    });
                    ul.appendChild(li);
                })
                content.appendChild(ul);
            }
            return {
                dom: container
            }
        }
    },
    addCommands() {
        return {
            addTableOfContents:
                () =>
                    ({ editor }) => {
                        return editor.chain().focus().insertContent({ type: this.name }).run()
                    },
        }
    },
})

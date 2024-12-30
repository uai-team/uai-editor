// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import closeIcon from "../../assets/icons/close.svg";
import titleIcon from "../../assets/icons/toc.svg";
import { t } from "i18next";
import { UAIEditor, UAIEditorEventListener, UAIEditorOptions } from "../../core/UAIEditor.ts";
import { EditorEvents } from "@tiptap/core";
import { TextSelection } from "@tiptap/pm/state";

/**
 * 定义文档大纲容器
 */
export class TocContainer extends HTMLElement implements UAIEditorEventListener {
    // 文档大纲容器
    container!: HTMLElement;

    // 文档大纲标题
    tocTitle!: HTMLElement;

    // 文档大纲内容
    content!: HTMLElement;

    constructor() {
        super();
        // 初始化容器
        this.container = document.createElement("div");
        this.container.classList.add("uai-pannel-container");
        this.appendChild(this.container);

        // 初始化标题
        this.tocTitle = document.createElement("div");
        this.tocTitle.classList.add("uai-pannel-title");
        this.tocTitle.innerHTML = `<img src="${titleIcon}" width="18" />&nbsp; ${t('toc.title')}`;
        this.container.appendChild(this.tocTitle);

        // 初始化关闭容器按钮
        const dialogClose = document.createElement("div");
        dialogClose.classList.add("uai-pannel-close");
        dialogClose.innerHTML = `<img src="${closeIcon}" width="24"/>`;
        // 注册点击事件，点击关闭按钮关闭容器
        dialogClose.addEventListener("click", () => {
            this.style.display = "none";
        })
        this.tocTitle.appendChild(dialogClose);

        this.content = document.createElement("div");
        this.content.classList.add("uai-toc-content");
        this.container.appendChild(this.content);
    }

    onCreate(event: EditorEvents["create"], options: UAIEditorOptions) {
    }

    onTransaction(event: EditorEvents["transaction"], options: UAIEditorOptions) {
    }

    onEditableChange(editable: boolean) {
    }

    /**
     * 文档大纲内容渲染
     * @param uaiEditor 
     */
    renderContents(uaiEditor: UAIEditor) {
        this.content.innerHTML = "";
        // 获取编辑器的文档大纲内容
        let tableOfContents = uaiEditor.tableOfContents;
        if (tableOfContents) {
            // 循环处理所有大纲
            tableOfContents.forEach(content => {
                const item = document.createElement("div");
                item.classList.add("uai-toc-item");
                // 根据大纲级别渲染大纲
                item.classList.add(`level-${content.level}`);
                if (content.isActive) {
                    item.classList.add("active");
                }
                // 大纲条目点击事件，跳转到文档中对应的位置
                item.addEventListener("click", () => {
                    if (!uaiEditor.innerEditor) {
                        return;
                    }
                    const activeHeading = tableOfContents.find(
                        (item: any) => 'isActive' in item && item.isActive,
                    )
                    if (activeHeading && 'isActive' in activeHeading) {
                        activeHeading.isActive = false;
                    }
                    if ('isActive' in content) {
                        content.isActive = true;
                    }
                    const element = uaiEditor.innerEditor.view.dom.querySelector(
                        `[data-toc-id="${content.id}"`,
                    )
                    const pageContainer = document.querySelector(
                        `.uai-main`,
                    )
                    pageContainer?.scrollTo({
                        top: (element as HTMLElement)?.offsetTop ?? 0 + 10,
                    })
                    const pos = uaiEditor.innerEditor.view.posAtDOM(element as Node, 0);
                    const { tr } = uaiEditor.innerEditor.view.state;
                    tr.setSelection(new TextSelection(tr.doc.resolve(pos)));
                    uaiEditor.innerEditor.view.dispatch(tr);
                    // uaiEditor.innerEditor.view.focus();
                    this.renderContents(uaiEditor);
                });
                // 大纲文字内容
                const text = document.createElement("div");
                text.classList.add("uai-toc-text");
                text.innerHTML = content.textContent;
                item.appendChild(text);
                this.content.appendChild(item);
            })
        }
    }
}


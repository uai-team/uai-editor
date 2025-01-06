// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { t } from "i18next";
import { UAIEditorEventListener, UAIEditorOptions } from "../../../core/UAIEditor.ts";
import { EditorEvents } from "@tiptap/core";
import tippy, { Instance, Props } from "tippy.js";

/**
 * 状态栏菜单：字数统计
 */
export class CharacterCount extends HTMLElement implements UAIEditorEventListener {
    // 字数统计容器
    container!: HTMLDivElement;
    // 提示框内容
    tipsContent!: HTMLDivElement;
    // 提示框实例
    tippyInstance!: Instance<Props>;

    constructor() {
        super();
        // 创建字数统计容器
        this.container = document.createElement("div");
        this.container.classList.add("uai-menu-button-wrap");
        this.container.classList.add("uai-menu-button");
        this.container.style.cursor = "pointer";
        this.appendChild(this.container);
        // 创建字数统计内容容器
        this.tipsContent = document.createElement("div");
        this.tipsContent.classList.add("uai-word-count-detail");
        // 提示框实例化
        this.tippyInstance = tippy(this.container, {
            appendTo: "parent",
            content: this.tipsContent,
            theme: 'uai-tips',
            placement: "top",
            // trigger: "click",
            // arrow: false,
            // interactive: true,
        });
    }

    /**
     * 定义创建方法
     * @param event 
     * @param options 
     */
    onCreate(_event: EditorEvents["create"], _options: UAIEditorOptions) {
        this.addEventListener("click", () => {
        })
    }

    /**
     * 定义Transaction监听方法
     * @param event 
     * @param options 
     */
    onTransaction(event: EditorEvents["transaction"], _options: UAIEditorOptions) {
        const { selection } = event.editor.state;
        // 获取当前选中的内容
        const text = event.editor.state.doc.textBetween(
            selection.from,
            selection.to,
            '',
        );

        // 根据当前选定的内容，获取相应的字数
        if (text.length > 0) {
            this.container.innerHTML = `&nbsp;&nbsp;${text.length} / ${event.editor.storage.characterCount.characters()} 字符&nbsp;&nbsp;`;
        } else {
            this.container.innerHTML = `&nbsp;&nbsp;${event.editor.storage.characterCount.characters()} 字符&nbsp;&nbsp;`;
        }

        // 提示框内容
        this.tipsContent.innerHTML = `
            <div class="uai-word-count-title">${t('wordCount.title')}</div>
            <ul>
              <li>
                ${t('wordCount.input')}
                <span>
                  ${event.editor.storage.characterCount.characters()}
                </span>
              </li>
              <li>
                ${t('wordCount.selection')}
                <span>${text.length}</span>
              </li>
            </ul>
          </div>
        `
    }

    onEditableChange(_editable: boolean) {
    }
}


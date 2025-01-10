// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { EditorEvents } from "@tiptap/core";

import { t } from "i18next";

import { UAIEditorEventListener, UAIEditorOptions } from "../../../../core/UAIEditor.ts";
import { MenuButton, MenuButtonOptions } from "../../MenuButton.ts";
import { CenterModal } from "../../../modals/CenterModal.ts";

import icon from "../../../../assets/icons/link.svg";

/**
 * 插入菜单：插入链接
 */
export class Link extends HTMLElement implements UAIEditorEventListener {
    // 按钮选项
    menuButtonOptions: MenuButtonOptions = {
        menuType: "button",
        enable: true,
        icon: icon,
        hideText: false,
        text: t('insert.link.text'),
        tooltip: t('insert.link.text'),
    }

    // 功能按钮
    menuButton: MenuButton;
    // 模态框
    modal: CenterModal;
    // 链接文本
    textInput!: HTMLInputElement;
    // 链接地址
    hrefInput!: HTMLInputElement;

    constructor(options: MenuButtonOptions) {
        super();

        // 初始化功能按钮选项
        this.menuButtonOptions = { ...this.menuButtonOptions, ...options };

        // 创建功能按钮
        this.menuButton = new MenuButton(this.menuButtonOptions);

        // 创建模态框
        this.modal = new CenterModal(t('insert.link.title'));
    }

    /**
     * 定义创建方法
     * @param event 
     * @param options 
     */
    onCreate(event: EditorEvents["create"], options: UAIEditorOptions) {
        this.menuButton.onCreate(event, options);
        this.appendChild(this.menuButton);

        // 定义模态框中链接文本输入
        const group1 = document.createElement("div");
        group1.classList.add("form-group");

        // 链接文本输入框
        const textLabel = document.createElement("label")
        textLabel.setAttribute("for", "textInput");
        textLabel.innerHTML = t('insert.link.hrefText');
        this.textInput = document.createElement("input");
        this.textInput.id = "textInput";
        this.textInput.classList.add("form-control");

        group1.appendChild(textLabel);
        group1.appendChild(this.textInput);
        this.modal.modalBody.appendChild(group1);

        const group2 = document.createElement("div");
        group2.classList.add("form-group");

        // 定义模态框中链接地址输入
        const hrefLabel = document.createElement("label")
        hrefLabel.setAttribute("for", "hrefInput");
        hrefLabel.innerHTML = t('insert.link.href');
        this.hrefInput = document.createElement("input");
        this.hrefInput.id = "hrefInput";
        this.hrefInput.classList.add("form-control");

        // 链接地址输入框
        group2.appendChild(hrefLabel);
        group2.appendChild(this.hrefInput);
        this.modal.modalBody.appendChild(group2);

        // 定义按钮点击事件，模态框中点确认时插入链接到文档
        this.modal.commit.addEventListener("click", () => {
            event.editor.commands.setLink({ href: this.hrefInput.value, target: '_blank' });
            event.editor.chain().focus().insertContent(this.textInput.value).run();
            this.modal.hide();
        });
        // 定义按钮点击事件，弹出模态框并编辑
        this.addEventListener("click", () => {
            if (this.menuButtonOptions.enable) {
                const state = event.editor.state;
                this.textInput.value = state.doc.textBetween(state.selection.from, state.selection.to);
                const href = event.editor.getAttributes('link').href;
                if (href) {
                    this.hrefInput.value = href;
                }
                this.modal.show();
            }
        })
    }

    /**
     * 定义Transaction监听方法
     * @param event 
     * @param options 
     */
    onTransaction(event: EditorEvents["transaction"], options: UAIEditorOptions) {
        this.menuButton.onTransaction(event, options);
        if (this.menuButton.menuButton) {
            var disable = event.editor.isEditable;
            this.onEditableChange(disable);
        }
        // 清空输入内容
        if (this.hrefInput) {
            this.hrefInput.value = "";
        }
    }

    onEditableChange(editable: boolean) {
        this.menuButtonOptions.enable = editable;
        this.menuButton.onEditableChange(editable);
    }
}


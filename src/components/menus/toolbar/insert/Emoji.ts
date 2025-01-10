// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { EditorEvents } from "@tiptap/core";

import tippy, { Instance, Props } from "tippy.js";
import { t } from "i18next";

import { UAIEditorEventListener, UAIEditorOptions } from "../../../../core/UAIEditor.ts";
import { MenuButton, MenuButtonOptions } from "../../MenuButton.ts";

import icon from "../../../../assets/icons/emoji.svg";

/**
 * 插入菜单：插入表情
 */
export class Emoji extends HTMLElement implements UAIEditorEventListener {
    // 按钮选项
    menuButtonOptions: MenuButtonOptions = {
        menuType: "popup",
        enable: true,
        icon: icon,
        hideText: true,
        text: t('insert.emoji'),
        tooltip: t('insert.emoji'),
    }

    // 功能按钮
    menuButton: MenuButton;
    // 选项提示实例
    tippyInstance!: Instance<Props>;

    constructor(options: MenuButtonOptions) {
        super();

        // 初始化功能按钮选项
        this.menuButtonOptions = { ...this.menuButtonOptions, ...options };

        // 创建功能按钮
        this.menuButton = new MenuButton(this.menuButtonOptions);
    }

    /**
     * 定义创建方法
     * @param event 
     * @param options 
     */
    onCreate(event: EditorEvents["create"], options: UAIEditorOptions) {
        this.menuButton.onCreate(event, options);
        this.appendChild(this.menuButton);

        // 创建表情选择提示框
        if (this.menuButtonOptions.enable && this.menuButton.menuButtonArrow) {
            this.tippyInstance = tippy(this.menuButton.menuButton, {
                content: this.createContainer(event, options),
                appendTo: 'parent',
                placement: 'bottom',
                trigger: 'click',
                interactive: true,
                arrow: false,
                onShow: () => {
                    this.menuButton.tippyInstance?.disable();
                },
                onHidden: () => {
                    this.menuButton.tippyInstance?.enable();
                },
            });
        }
    }

    /**
     * 定义Transaction监听方法
     * @param event 
     * @param options 
     */
    onTransaction(event: EditorEvents["transaction"], options: UAIEditorOptions) {
        this.menuButton.onTransaction(event, options);
    }

    onEditableChange(editable: boolean) {
        this.menuButtonOptions.enable = editable;
        this.menuButton.onEditableChange(editable);
    }

    /**
     * 创建表情选择容器
     * @param event 
     * @param options 
     * @returns 
     */
    createContainer(event: EditorEvents["create"], options: UAIEditorOptions) {
        const container = document.createElement("div");
        container.classList.add("uai-emojis-container");
        // 添加所有可选表情
        options.dicts?.emojis?.forEach(emoji => {
            const groupTitle = document.createElement("div");
            groupTitle.classList.add("uai-emojis-group-title");
            groupTitle.innerHTML = emoji.label;
            container.appendChild(groupTitle);
            const groupContainer = document.createElement("div");
            groupContainer.classList.add("uai-emojis-group-container");
            container.appendChild(groupContainer);
            emoji.value.toString().split(" ").forEach(item => {
                const it = document.createElement("div");
                it.classList.add("uai-emojis-group-item");
                it.innerHTML = item;
                groupContainer.appendChild(it);
                it.addEventListener("click", () => {
                    event.editor.chain().focus().insertContent(item).run();
                });
            })
        });
        return container;
    }
}


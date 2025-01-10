// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { EditorEvents } from "@tiptap/core";

import tippy, { Instance, Props } from "tippy.js";
import { t } from "i18next";

import { UAIEditorEventListener, UAIEditorOptions } from "../../../../core/UAIEditor.ts";
import { MenuButton, MenuButtonOptions } from "../../MenuButton.ts";

import icon from "../../../../assets/icons/task-list.svg";

/**
 * 基础菜单：任务列表
 */
export class TaskList extends HTMLElement implements UAIEditorEventListener {
    // 按钮选项
    menuButtonOptions: MenuButtonOptions = {
        menuType: "popup",
        enable: true,
        icon: icon,
        hideText: true,
        text: t('list.task.text'),
        tooltip: t('list.task.text'),
        shortcut: "Ctrl+Shift+9",
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

        this.menuButton.menuButtonContent.addEventListener("click", () => {
            if (this.menuButtonOptions.enable) {
                event.editor.chain().focus().toggleTaskList().run();
            }
        })

        if (this.menuButtonOptions.enable && this.menuButton.menuButtonArrow) {
            this.tippyInstance = tippy(this.menuButton.menuButtonArrow, {
                content: this.createContainer(event, options),
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
            })
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

    createContainer(event: EditorEvents["create"], options: UAIEditorOptions) {
        const container = document.createElement("div");
        container.classList.add("uai-ordered-list");

        return container
    }
}


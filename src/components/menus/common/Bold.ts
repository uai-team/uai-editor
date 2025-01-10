// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { EditorEvents } from "@tiptap/core";

import { t } from "i18next";

import { UAIEditorEventListener, UAIEditorOptions } from "../../../core/UAIEditor.ts";
import { MenuButton, MenuButtonOptions } from "../MenuButton.ts";

import icon from "../../../assets/icons/bold.svg";

/**
 * 公共菜单：粗体
 */
export class Bold extends HTMLElement implements UAIEditorEventListener {
    // 按钮选项
    menuButtonOptions: MenuButtonOptions = {
        menuType: "button",
        enable: true,
        icon: icon,
        hideText: true,
        text: t('base.bold'),
        tooltip: t('base.bold'),
        shortcut: "Ctrl+B",
    }

    // 功能按钮
    menuButton: MenuButton;

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

        // 定义按钮点击事件，内容加粗、或者取消加粗
        this.addEventListener("click", () => {
            if (this.menuButtonOptions.enable) {
                event.editor.chain().focus().toggleBold().run();
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
            // 先判断当前内容是否可以加粗，只有选中内容是文字，才可以执行加粗
            var disable = event.editor.can().chain().toggleBold().run();
            // 如果选定内容不可以加粗，则禁用当前按钮
            this.onEditableChange(disable);

            if (this.menuButtonOptions.enable) {
                // 如果所选内容是加粗的，功能按钮成激活状态，否则是非激活状态
                var active = event.editor.isActive('bold');
                if (active) {
                    this.menuButton.menuButton.classList.add("active");
                } else {
                    this.menuButton.menuButton.classList.remove("active");
                }
            }
        }
    }

    onEditableChange(editable: boolean) {
        this.menuButtonOptions.enable = editable;
        this.menuButton.onEditableChange(editable);
    }
}


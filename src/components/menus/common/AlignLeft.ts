// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { EditorEvents } from "@tiptap/core";

import { t } from "i18next";

import { UAIEditorEventListener, UAIEditorOptions } from "../../../core/UAIEditor.ts";
import { MenuButton, MenuButtonOptions } from "../MenuButton.ts";

import icon from "../../../assets/icons/align-left.svg";

/**
 * 公共菜单：左对齐
 */
export class AlignLeft extends HTMLElement implements UAIEditorEventListener {
    // 按钮选项
    menuButtonOptions: MenuButtonOptions = {
        menuType: "button",
        enable: true,
        icon: icon,
        hideText: true,
        text: t('base.align.left'),
        tooltip: t('base.align.left'),
        shortcut: "Ctrl+Shift+L",
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

        // 定义按钮点击事件，内容左对齐
        this.addEventListener("click", () => {
            if (this.menuButtonOptions.enable) {
                if (event.editor.can().chain().focus().setTextAlign('left').run()) {
                    event.editor.chain().focus().setTextAlign('left').run();
                }
                event.editor.chain().focus().setNodeAlign('flex-start').run();
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
        if (this.menuButton.menuButton && this.menuButtonOptions.enable) {
            // 如果所选内容是左对齐的，左对齐按钮成激活状态，否则是非激活状态
            var active = event.editor.isActive({ textAlign: 'left' });
            if (active) {
                this.menuButton.menuButton.classList.add("active");
            } else {
                this.menuButton.menuButton.classList.remove("active");
            }
        }
    }

    onEditableChange(editable: boolean) {
        this.menuButtonOptions.enable = editable;
        this.menuButton.onEditableChange(editable);
    }
}


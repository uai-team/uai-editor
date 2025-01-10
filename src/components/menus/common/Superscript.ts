// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { EditorEvents } from "@tiptap/core";

import { t } from "i18next";

import { UAIEditorEventListener, UAIEditorOptions } from "../../../core/UAIEditor.ts";
import { MenuButton, MenuButtonOptions } from "../MenuButton.ts";

import icon from "../../../assets/icons/superscript.svg";

/**
 * 公共菜单：设置上标
 */
export class Superscript extends HTMLElement implements UAIEditorEventListener {
    // 按钮选项
    menuButtonOptions: MenuButtonOptions = {
        menuType: "button",
        enable: true,
        icon: icon,
        hideText: true,
        text: t('base.superscript'),
        tooltip: t('base.superscript'),
        shortcut: "Ctrl+.",
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

        // 定义按钮点击事件，设置内容为上标、或者取消上标
        this.addEventListener("click", () => {
            if (this.menuButtonOptions.enable) {
                event.editor.chain().focus().toggleSuperscript().run();
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
            // 先判断当前内容是否可以设置上标格式，只有选中内容是文字，才可以执行设置上标格式
            var disable = event.editor.can().chain().toggleSuperscript().run();
            // 如果选定内容不可以设置上标格式，则禁用当前按钮
            this.onEditableChange(disable);

            if (this.menuButtonOptions.enable) {
                // 如果所选内容是上标格式，功能按钮成激活状态，否则是非激活状态
                var active = event.editor.isActive('superscript');
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


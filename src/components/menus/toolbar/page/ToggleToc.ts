// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { EditorEvents } from "@tiptap/core";

import { t } from "i18next";

import { UAIEditorEventListener, UAIEditorOptions, InnerEditor } from "../../../../core/UAIEditor.ts";
import { MenuButton, MenuButtonOptions } from "../../MenuButton.ts";

import icon from "../../../../assets/icons/toc.svg";

/**
 * 页面菜单：打开文档大纲
 */
export class ToggleToc extends HTMLElement implements UAIEditorEventListener {
    // 按钮选项
    menuButtonOptions: MenuButtonOptions = {
        menuType: "button",
        enable: true,
        icon: icon,
        hideText: true,
        text: t('toc.title'),
        tooltip: t('toc.title'),
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

        // 定义按钮点击事件，显示或关闭文档大纲界面
        this.addEventListener("click", () => {
            if (this.menuButtonOptions.enable) {
                // 判断文档大纲是否显示
                const display = (event.editor as InnerEditor).uaiEditor.tocContainer.style.display;
                if (display != "none") {
                    // 如果当前已显示，则关闭文档大纲界面
                    (event.editor as InnerEditor).uaiEditor.tocContainer.style.display = "none";
                } else {
                    // 如果当前未显示，则显示文档大纲界面
                    (event.editor as InnerEditor).uaiEditor.toggleContainers.forEach(toggle => {
                        toggle.style.display = "none";
                    });
                    (event.editor as InnerEditor).uaiEditor.tocContainer.style.display = "block";
                }
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
    }

    onEditableChange(editable: boolean) {
        this.menuButtonOptions.enable = editable;
        this.menuButton.onEditableChange(editable);
    }
}


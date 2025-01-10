// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { EditorEvents } from "@tiptap/core";

import { t } from "i18next";

import { UAIEditorEventListener, UAIEditorOptions, InnerEditor } from "../../../../core/UAIEditor.ts";
import { MenuButton, MenuButtonOptions } from "../../MenuButton.ts";

import icon from "../../../../assets/icons/image-bot.svg";

/**
 * 人工智能菜单：画图
 */
export class ToggleImage extends HTMLElement implements UAIEditorEventListener {
    // 按钮选项
    menuButtonOptions: MenuButtonOptions = {
        menuType: "button",
        enable: true,
        icon: icon,
        hideText: false,
        text: t('ai.image.title'),
        tooltip: t('ai.image.title'),
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

        // 定义按钮点击事件，打开人工智能画图窗口
        this.addEventListener("click", () => {
            if (this.menuButtonOptions.enable) {
                // 判断画图窗口是否已打开
                const display = (event.editor as InnerEditor).uaiEditor.imageContainer.style.display;
                if (display != "none") {
                    // 如果窗口已打开，则关闭窗口
                    (event.editor as InnerEditor).uaiEditor.imageContainer.style.display = "none";
                } else {
                    // 如果窗口没打开，则先关闭其他窗口，再打开画图窗口
                    (event.editor as InnerEditor).uaiEditor.toggleContainers.forEach(toggle => {
                        toggle.style.display = "none";
                    });
                    (event.editor as InnerEditor).uaiEditor.imageContainer.style.display = "block";
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


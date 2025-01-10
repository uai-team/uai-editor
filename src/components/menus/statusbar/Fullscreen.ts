// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { EditorEvents } from "@tiptap/core";

import { t } from "i18next";

import { InnerEditor, UAIEditorEventListener, UAIEditorOptions } from "../../../core/UAIEditor.ts";
import { MenuButton, MenuButtonOptions } from "../MenuButton.ts";

import fullIcon from "../../../assets/icons/full-screen.svg";
import exitIcon from "../../../assets/icons/full-screen-exit.svg";

/**
 * 状态栏菜单：全屏
 */
export class Fullscreen extends HTMLElement implements UAIEditorEventListener {
    // 全屏按钮选项
    fullButtonOptions: MenuButtonOptions = {
        menuType: "button",
        enable: true,
        icon: fullIcon,
        hideText: true,
        text: t('fullscreen.title'),
        tooltip: t('fullscreen.title'),
    }
    // 退出全屏按钮选项
    exitButtonOptions: MenuButtonOptions = {
        menuType: "button",
        enable: true,
        icon: exitIcon,
        hideText: true,
        text: t('fullscreen.disable'),
        tooltip: t('fullscreen.disable'),
    }

    // 全屏功能按钮
    fullButton: MenuButton;
    // 退出全屏功能按钮
    exitButton: MenuButton;

    constructor(options: MenuButtonOptions) {
        super();

        // 初始化功能按钮选项
        this.fullButtonOptions = { ...this.fullButtonOptions, ...options };
        this.exitButtonOptions = { ...this.exitButtonOptions, ...options };

        // 创建功能按钮
        this.fullButton = new MenuButton(this.fullButtonOptions);
        this.exitButton = new MenuButton(this.exitButtonOptions);
    }

    /**
     * 定义创建方法
     * @param event 
     * @param options 
     */
    onCreate(event: EditorEvents["create"], options: UAIEditorOptions) {
        this.fullButton.onCreate(event, options);
        this.exitButton.onCreate(event, options);
        this.appendChild(this.fullButton);

        // 定义按钮点击事件，全屏展示
        this.fullButton.addEventListener("click", () => {
            if (this.fullButtonOptions.enable) {
                (event.editor as InnerEditor).uaiEditor.container.requestFullscreen();
                this.removeChild(this.fullButton);
                this.appendChild(this.exitButton);
            }
        });
        // 定义按钮点击事件，退出全屏展示
        this.exitButton.addEventListener("click", () => {
            if (this.exitButtonOptions.enable) {
                document.exitFullscreen();
                this.removeChild(this.exitButton);
                this.appendChild(this.fullButton);
            }
        });
        // 定义退出全屏事件，需要同时切换按钮状态
        document.addEventListener("fullscreenchange", () => {
            this.click();
        });
    }

    /**
     * 定义按钮点击功能
     */
    click() {
        // 如果当前不是全屏，就展示全屏按钮
        if (!document.fullscreenElement) {
            try {
                this.removeChild(this.exitButton);
            } catch (error) {
            }
            this.appendChild(this.fullButton);
        } else {
            // 否则就展示退出全屏按钮
            try {
                this.removeChild(this.fullButton);
            } catch (error) {
            }
            this.appendChild(this.exitButton);
        }
    }

    /**
     * 定义Transaction监听方法
     * @param event 
     * @param options 
     */
    onTransaction(event: EditorEvents["transaction"], options: UAIEditorOptions) {
        this.fullButton.onTransaction(event, options);
        this.exitButton.onTransaction(event, options);
    }

    onEditableChange(editable: boolean) {
        this.fullButtonOptions.enable = editable;
        this.fullButton.onEditableChange(editable);
        this.exitButtonOptions.enable = editable;
        this.exitButton.onEditableChange(editable);
    }
}


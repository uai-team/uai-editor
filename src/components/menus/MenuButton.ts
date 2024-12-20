// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { EditorEvents } from "@tiptap/core";
import { UAIEditorEventListener, UAIEditorOptions } from "../../core/UAIEditor.ts";
import tippy, { Instance, Props } from "tippy.js";

/**
 * 菜单按钮选项
 */
export type MenuButtonOptions = {
    menuType: "button",
    enable: boolean,
    className?: string,
    header?: "ribbon" | "classic",
    huge?: boolean,
    icon?: string,
    text?: string,
    hideText?: boolean,
    tooltip?: string,
    shortcut?: string,
    options?: string[] | number[]
}

/**
 * 功能菜单
 */
export class MenuButton extends HTMLElement implements UAIEditorEventListener {
    container!: HTMLElement;
    menuButton!: HTMLElement;
    menuButtonContent!: HTMLElement;
    menuButtonArrow?: HTMLElement;
    menuButtonOptions!: MenuButtonOptions;
    tippyInstance!: Instance<Props>;

    constructor(options: MenuButtonOptions) {
        super();

        // 初始化功能菜单选项
        this.menuButtonOptions = options;
    }

    /**
     * 定义创建方法
     * @param event 
     * @param options 
     */
    onCreate(_event: EditorEvents["create"], _options: UAIEditorOptions) {
        this.container = document.createElement("div");
        this.container.classList.add("uai-menu-button-wrap");
        this.appendChild(this.container);

        // 根据不同的菜单类型绘制不同的用户界面
        if (this.menuButtonOptions.menuType === "button") {
            // 按钮
            this.createMenuButton()
        }

        // 提示信息
        var tipsContent = this.menuButtonOptions.tooltip;
        if (tipsContent) {
            if (this.menuButtonOptions.shortcut) {
                tipsContent += ` (${this.menuButtonOptions.shortcut})`;
            }
            this.tippyInstance = tippy(this.menuButton, {
                appendTo: "parent",
                content: tipsContent,
                theme: 'uai-tips',
                placement: "top",
                // arrow: false,
                // interactive: true,
            });
        }
    }

    onTransaction(_event: EditorEvents["transaction"], _options: UAIEditorOptions) {

    }

    onEditableChange(editable: boolean) {
        this.menuButtonOptions.enable = editable;
        if (editable) {
            this.menuButton.style.pointerEvents = "auto";
            this.menuButton.style.opacity = "1";
            this.style.cursor = "pointer";
        } else {
            this.menuButton.style.pointerEvents = "none";
            this.menuButton.style.opacity = "0.3";
            this.style.cursor = "not-allowed";
        }
    }

    /**
     * 创建按钮
     */
    createMenuButton() {
        var size = 16;
        this.menuButton = document.createElement("div");
        this.menuButton.classList.add("uai-menu-button");
        if (this.menuButtonOptions.huge) {
            // 大按钮大小
            this.menuButton.classList.add("huge");
            size = 28;
        } else {
            // 小按钮大小
            size = 16;
        }
        // 传统样式设置，文字在图标右侧
        if (this.menuButtonOptions.header === "classic") {
            this.menuButton.classList.add("classic-text");
        }
        this.container.appendChild(this.menuButton);

        // 按钮内容
        this.menuButtonContent = document.createElement("div");
        this.menuButtonContent.classList.add("uai-button-content");
        this.menuButton.appendChild(this.menuButtonContent);

        // 按钮图标
        if (this.menuButtonOptions.icon) {
            this.menuButtonContent.innerHTML = `<img src="${this.menuButtonOptions.icon}" width="${size}" />`
        }

        // 按钮文字描述
        if (!this.menuButtonOptions.hideText && this.menuButtonOptions.text) {
            const menuButtonText = document.createElement("span");
            menuButtonText.classList.add("uai-button-text");
            menuButtonText.innerHTML = this.menuButtonOptions.text;
            this.menuButtonContent.appendChild(menuButtonText);
        }
    }
}
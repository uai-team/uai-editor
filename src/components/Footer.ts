// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { EditorEvents } from "@tiptap/core";
import { UAIEditorEventListener, UAIEditorOptions } from "../core/UAIEditor.ts";

import { ToggleToc } from "./menus/toolbar/page/ToggleToc";

/**
 * 编辑器底部状态栏
 */
export class Footer extends HTMLElement implements UAIEditorEventListener {
    container!: HTMLElement;

    // 文档大纲
    toggleToc!: ToggleToc;

    constructor() {
        super();

        // 创建状态栏菜单
        this.toggleToc = new ToggleToc({ menuType: "button", enable: true });
    }

    /**
     * 定义创建方法
     * @param event 
     * @param options 
     */
    onCreate(event: EditorEvents["create"], options: UAIEditorOptions) {
        // 初始化状态栏菜单
        this.toggleToc.onCreate(event, options);

        this.container = document.createElement("div");
        this.container.classList.add("uai-footer");
        this.appendChild(this.container);

        // 状态栏
        const statusBar = document.createElement("div");
        statusBar.classList.add("uai-status-bar");
        this.container.appendChild(statusBar);

        // 状态栏左边区域
        const statusBarLeft = document.createElement("div");
        statusBarLeft.classList.add("uai-status-bar-left");
        statusBar.appendChild(statusBarLeft);

        // 状态栏右边区域
        const statusBarRight = document.createElement("div");
        statusBarRight.classList.add("uai-status-bar-right");
        statusBar.appendChild(statusBarRight);

        this.toggleToc.classList.add("uai-status-bar-button");

        // 状态栏中添加功能菜单按钮
        statusBarLeft.appendChild(this.toggleToc);
    }

    /**
     * 定义Transaction监听方法
     * @param event 
     * @param options 
     */
    onTransaction(event: EditorEvents["transaction"], options: UAIEditorOptions) {
        this.toggleToc.onTransaction(event, options);
    }

    onEditableChange(editable: boolean) {
        this.toggleToc.onEditableChange(editable);
    }
}
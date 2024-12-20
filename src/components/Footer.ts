// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { EditorEvents } from "@tiptap/core";
import { UAIEditorEventListener, UAIEditorOptions } from "../core/UAIEditor.ts";

/**
 * 编辑器底部状态栏
 */
export class Footer extends HTMLElement implements UAIEditorEventListener {
    container!: HTMLElement;

    constructor() {
        super();
    }

    /**
     * 定义创建方法
     * @param event 
     * @param options 
     */
    onCreate(event: EditorEvents["create"], options: UAIEditorOptions) {
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
    }

    /**
     * 定义Transaction监听方法
     * @param event 
     * @param options 
     */
    onTransaction(event: EditorEvents["transaction"], options: UAIEditorOptions) {

    }

    onEditableChange(_editable: boolean) {

    }
}
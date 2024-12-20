// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { EditorEvents } from "@tiptap/core";
import { UAIEditorEventListener, UAIEditorOptions } from "../core/UAIEditor.ts";

/**
 * 编辑器界面，主要是用来组织编辑器页面布局
 */
export class Editor extends HTMLElement implements UAIEditorEventListener {
    // 主容器
    mainContainer!: HTMLElement;
    // 分页容器
    pageContainer!: HTMLElement;
    // 可缩放容器
    zoomableContainer!: HTMLElement;
    // 缩放内容
    zoomableContent!: HTMLElement;
    // 页面内容
    pageContent!: HTMLElement;
    // 编辑器容器
    editorContainer!: HTMLElement;

    constructor() {
        super();

        this.pageContainer = document.createElement("div");
        this.pageContainer.classList.add("uai-page-container");
        this.appendChild(this.pageContainer);

        this.zoomableContainer = document.createElement("div");
        this.zoomableContainer.classList.add("uai-zoomable-container");
        this.pageContainer.appendChild(this.zoomableContainer);

        this.zoomableContent = document.createElement("div");
        this.zoomableContent.classList.add("uai-zoomable-content");
        this.zoomableContainer.appendChild(this.zoomableContent);

        this.pageContent = document.createElement("div");
        this.pageContent.classList.add("uai-page-content");
        this.zoomableContent.appendChild(this.pageContent);

        this.editorContainer = document.createElement("div");
        this.editorContainer.classList.add("uai-editor-container");
        this.pageContent.appendChild(this.editorContainer);
    }

    /**
     * 定义创建方法
     * @param event 
     * @param options 
     */
    onCreate(_event: EditorEvents["create"], _options: UAIEditorOptions) {

    }

    /**
     * 定义Transaction监听方法
     * @param event 
     * @param options 
     */
    onTransaction(_event: EditorEvents["transaction"], _options: UAIEditorOptions) {

    }

    onEditableChange(_editable: boolean) {

    }
}
// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { EditorEvents } from "@tiptap/core";

import { UAIEditorEventListener, UAIEditor, UAIEditorOptions } from "../../../core/UAIEditor";

import { AlignLeft } from "../common/AlignLeft.ts";
import { AlignCenter } from "../common/AlignCenter.ts";
import { AlignRight } from "../common/AlignRight.ts";

import { ImageFlipX } from "./image/ImageFlipX.ts";
import { ImageFlipY } from "./image/ImageFlipY.ts";

import { NodeDelete } from "../common/NodeDelete.ts";

/**
 * 定义图片内容浮动菜单
 */
export class ImageBubbleMenu extends HTMLElement implements UAIEditorEventListener {
    uaiEditor!: UAIEditor;

    // 左对齐
    baseMenuAlignLeft!: AlignLeft;
    // 居中对齐
    baseMenuAlignCenter!: AlignCenter;
    // 右对齐
    baseMenuAlignRight!: AlignRight;

    // 垂直翻转
    imageMenuFlipX!: ImageFlipX;
    // 水平翻转
    imageMenuFlipY!: ImageFlipY;

    commonMenuNodeDelete!: NodeDelete;

    constructor(uaiEditor: UAIEditor) {
        super();
        this.uaiEditor = uaiEditor;
        this.initMenus();

        // 定义菜单容器
        const container = document.createElement("div");
        container.classList.add("uai-bubble-menu-container");

        // 定义菜单组
        const group1 = document.createElement("div");
        group1.classList.add("uai-bubble-menu-virtual-group");
        container.appendChild(group1);
        // 添加对齐功能
        group1.appendChild(this.baseMenuAlignLeft);
        group1.appendChild(this.baseMenuAlignCenter);
        group1.appendChild(this.baseMenuAlignRight);

        // 定义菜单组
        const group2 = document.createElement("div");
        group2.classList.add("uai-bubble-menu-virtual-group");
        container.appendChild(group2);
        // 添加翻转功能
        group2.appendChild(this.imageMenuFlipX);
        group2.appendChild(this.imageMenuFlipY);

        // 定义菜单组
        const group3 = document.createElement("div");
        group3.classList.add("uai-bubble-menu-virtual-group");
        container.appendChild(group3);
        // 添加删除功能
        group3.appendChild(this.commonMenuNodeDelete);

        this.appendChild(container);
    }

    onCreate(event: EditorEvents["create"], options: UAIEditorOptions) {

    }

    onTransaction(event: EditorEvents["transaction"], options: UAIEditorOptions) {

    }

    onEditableChange(editable: boolean) {

    }

    /**
     * 初始化功能菜单
     */
    initMenus() {
        this.baseMenuAlignLeft = new AlignLeft({ menuType: "button", enable: true });
        this.uaiEditor.eventComponents.push(this.baseMenuAlignLeft);

        this.baseMenuAlignCenter = new AlignCenter({ menuType: "button", enable: true });
        this.uaiEditor.eventComponents.push(this.baseMenuAlignCenter);

        this.baseMenuAlignRight = new AlignRight({ menuType: "button", enable: true });
        this.uaiEditor.eventComponents.push(this.baseMenuAlignRight);

        this.imageMenuFlipX = new ImageFlipX({ menuType: "button", enable: true });
        this.uaiEditor.eventComponents.push(this.imageMenuFlipX);

        this.imageMenuFlipY = new ImageFlipY({ menuType: "button", enable: true });
        this.uaiEditor.eventComponents.push(this.imageMenuFlipY);

        this.commonMenuNodeDelete = new NodeDelete({ menuType: "button", enable: true });
        this.uaiEditor.eventComponents.push(this.commonMenuNodeDelete);

    }
}
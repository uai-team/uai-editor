// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { EditorEvents } from "@tiptap/core";

import { UAIEditor, UAIEditorEventListener, UAIEditorOptions } from "../../../core/UAIEditor";

import { Bold } from "../common/Bold";
import { FontSizeDecrease } from "../common/FontSizeDecrease";
import { FontSizeIncrease } from "../common/FontSizeIncrease";
import { Italic } from "../common/Italic";
import { Strike } from "../common/Strike";
import { Subscript } from "../common/Subscript";
import { Superscript } from "../common/Superscript";
import { Underline } from "../common/Underline";
import { FontColor } from "../common/FontColor";
import { Highlight } from "../common/Highlight";

/**
 * 定义选中文本浮动菜单
 */
export class TextSelectionBubbleMenu extends HTMLElement implements UAIEditorEventListener {
    uaiEditor!: UAIEditor;

    // 设置字体大小
    baseMenuFontSizeIncrease!: FontSizeIncrease;
    baseMenuFontSizeDecrease!: FontSizeDecrease;

    // 设置字体样式
    baseMenuBold!: Bold;
    baseMenuItalic!: Italic;
    baseMenuUnderline!: Underline;
    baseMenuStrike!: Strike;
    baseMenuSubscript!: Subscript;
    baseMenuSuperscript!: Superscript;

    // 设置颜色
    baseMenuFontColor!: FontColor;
    baseMenuHighlight!: Highlight;

    constructor(uaiEditor: UAIEditor) {
        super();
        this.uaiEditor = uaiEditor;
        this.initMenus();

        // 定义菜单容器
        const container = document.createElement("div");
        container.classList.add("uai-bubble-menu-container");

        const group0 = document.createElement("div");
        group0.classList.add("uai-bubble-menu-virtual-group");
        container.appendChild(group0);

        // 定义菜单组
        const group1 = document.createElement("div");
        group1.classList.add("uai-bubble-menu-virtual-group");
        container.appendChild(group1);
        // 添加字体样式功能
        group1.appendChild(this.baseMenuBold);
        group1.appendChild(this.baseMenuItalic);
        group1.appendChild(this.baseMenuUnderline);
        group1.appendChild(this.baseMenuStrike);

        // 定义菜单组
        const group2 = document.createElement("div");
        group2.classList.add("uai-bubble-menu-virtual-group");
        container.appendChild(group2);
        // 添加字体大小功能
        group2.appendChild(this.baseMenuFontSizeIncrease);
        group2.appendChild(this.baseMenuFontSizeDecrease);

        group2.appendChild(this.baseMenuSubscript);
        group2.appendChild(this.baseMenuSuperscript);

        // 定义菜单组
        const group4 = document.createElement("div");
        group4.classList.add("uai-bubble-menu-virtual-group");
        container.appendChild(group4);
        // 添加设置颜色
        group4.appendChild(this.baseMenuFontColor);
        group4.appendChild(this.baseMenuHighlight);

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
        this.baseMenuFontSizeIncrease = new FontSizeIncrease({ menuType: "button", enable: true });
        this.uaiEditor.eventComponents.push(this.baseMenuFontSizeIncrease);

        this.baseMenuFontSizeDecrease = new FontSizeDecrease({ menuType: "button", enable: true });
        this.uaiEditor.eventComponents.push(this.baseMenuFontSizeDecrease);

        this.baseMenuBold = new Bold({ menuType: "button", enable: true });
        this.uaiEditor.eventComponents.push(this.baseMenuBold);

        this.baseMenuItalic = new Italic({ menuType: "button", enable: true });
        this.uaiEditor.eventComponents.push(this.baseMenuItalic);

        this.baseMenuUnderline = new Underline({ menuType: "button", enable: true });
        this.uaiEditor.eventComponents.push(this.baseMenuUnderline);

        this.baseMenuStrike = new Strike({ menuType: "button", enable: true });
        this.uaiEditor.eventComponents.push(this.baseMenuStrike);

        this.baseMenuSubscript = new Subscript({ menuType: "button", enable: true });
        this.uaiEditor.eventComponents.push(this.baseMenuSubscript);

        this.baseMenuSuperscript = new Superscript({ menuType: "button", enable: true });
        this.uaiEditor.eventComponents.push(this.baseMenuSuperscript);

        this.baseMenuFontColor = new FontColor({ menuType: "color", enable: true });
        this.uaiEditor.eventComponents.push(this.baseMenuFontColor);

        this.baseMenuHighlight = new Highlight({ menuType: "color", enable: true });
        this.uaiEditor.eventComponents.push(this.baseMenuHighlight);
    }
}
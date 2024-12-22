// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { EditorEvents } from "@tiptap/core";
import { UAIEditorEventListener, UAIEditorOptions } from "../../../core/UAIEditor.ts";

import menuIcon from "../../../assets/icons/menu.svg";
import { ScrollableDiv } from "./ScrollableDiv";

import { FontSizeIncrease } from "../common/FontSizeIncrease.ts";
import { FontSizeDecrease } from "../common/FontSizeDecrease.ts";

import { Bold } from "../common/Bold.ts";
import { Italic } from "../common/Italic.ts";
import { Underline } from "../common/Underline.ts";
import { Strike } from "../common/Strike.ts";
import { Subscript } from "../common/Subscript.ts";
import { Superscript } from "../common/Superscript.ts";

import { FontColor } from "../common/FontColor.ts";
import { Highlight } from "../common/Highlight.ts";

import { Redo } from "./base/Redo";
import { Undo } from "./base/Undo";
import { FormatPainter } from "./base/FormatPainter";
import { ClearFormat } from "./base/ClearFormat";

import { FontFamily } from "./base/FontFamily";
import { FontSize } from "./base/FontSize";

/**
 * 传统菜单栏
 */
export class Classic extends HTMLElement implements UAIEditorEventListener {
    defaultToolbarMenus!: Record<string, any>[];
    eventComponents: UAIEditorEventListener[] = [];

    // 传统菜单栏容器
    classicMenu!: HTMLElement;
    classicScrollableContainer!: HTMLElement;

    // 基础菜单容器
    classicMenuBaseScrollable!: ScrollableDiv;
    classicMenuBaseGroup!: HTMLElement;

    // 基础菜单
    baseMenuUndo!: Undo;
    baseMenuRedo!: Redo;
    baseMenuFormatPainter!: FormatPainter;
    baseMenuClearFormat!: ClearFormat;

    baseMenuFontFamily!: FontFamily;
    baseMenuFontSize!: FontSize;
    baseMenuFontSizeIncrease!: FontSizeIncrease;
    baseMenuFontSizeDecrease!: FontSizeDecrease;

    baseMenuBold!: Bold;
    baseMenuItalic!: Italic;
    baseMenuUnderline!: Underline;
    baseMenuStrike!: Strike;
    baseMenuSubscript!: Subscript;
    baseMenuSuperscript!: Superscript;
    baseMenuFontColor!: FontColor;
    baseMenuHighlight!: Highlight;

    constructor(defaultToolbarMenus: Record<string, any>[]) {
        super();
        this.defaultToolbarMenus = defaultToolbarMenus;
        // 初始化菜单
        this.initMenus();
    }

    /**
     * 定义创建方法
     * @param event 
     * @param options 
     */
    onCreate(event: EditorEvents["create"], options: UAIEditorOptions) {
        this.eventComponents.forEach(component => {
            component.onCreate(event, options);
        })
        // 创建菜单容器
        this.classicScrollableContainer = document.createElement("div");
        this.classicScrollableContainer.classList.add("uai-classic-scrollable-container");
        this.appendChild(this.classicScrollableContainer);

        this.classicMenu = document.createElement("div");
        this.classicMenu.classList.add("uai-classic-menu");
        this.classicScrollableContainer.appendChild(this.classicMenu);

        const selectDiv = document.createElement("div");
        selectDiv.classList.add("uai-classic-virtual-group");
        selectDiv.classList.add("uai-editor-menu-select-3");
        selectDiv.innerHTML = `<img src="${menuIcon}" width="16" />`;
        this.classicMenu.appendChild(selectDiv);

        const selectMuenus = document.createElement("select");
        selectDiv.appendChild(selectMuenus);

        this.defaultToolbarMenus.forEach(menu => {
            const option = document.createElement("option");
            option.label = menu.label;
            option.value = menu.value;
            selectMuenus.options.add(option);
        });
        // 添加事件，处理菜单分组切换、界面元素切换
        selectMuenus.addEventListener("change", () => {
            const menu = selectMuenus.selectedOptions[0].value;
            this.classicMenuBaseScrollable.style.display = "none";
            if (menu === "base") {
                this.classicMenuBaseScrollable.style.display = "flex";
            }
        })
        // 创建分组菜单
        this.createBaseMenu(event, options);
        this.classicMenuBaseScrollable.style.display = "flex";
    }

    /**
     * 定义Transaction监听方法
     * @param event 
     * @param options 
     */
    onTransaction(event: EditorEvents["transaction"], options: UAIEditorOptions) {
        this.eventComponents.forEach(component => {
            component.onTransaction(event, options);
        })
    }

    onEditableChange(editable: boolean) {
        this.eventComponents.forEach(component => {
            component.onEditableChange(editable);
        })
    }

    /**
     * 初始化菜单
     */
    initMenus() {
        this.baseMenuUndo = new Undo({ menuType: "button", enable: true, hideText: false });
        this.eventComponents.push(this.baseMenuUndo);

        this.baseMenuRedo = new Redo({ menuType: "button", enable: true });
        this.eventComponents.push(this.baseMenuRedo);

        this.baseMenuFormatPainter = new FormatPainter({ menuType: "button", enable: true });
        this.eventComponents.push(this.baseMenuFormatPainter);

        this.baseMenuClearFormat = new ClearFormat({ menuType: "button", enable: true });
        this.eventComponents.push(this.baseMenuClearFormat);

        this.baseMenuFontFamily = new FontFamily({ menuType: "select", enable: true });
        this.eventComponents.push(this.baseMenuFontFamily);

        this.baseMenuFontSize = new FontSize({ menuType: "select", enable: true });
        this.eventComponents.push(this.baseMenuFontSize);

        this.baseMenuFontSizeIncrease = new FontSizeIncrease({ menuType: "button", enable: true });
        this.eventComponents.push(this.baseMenuFontSizeIncrease);

        this.baseMenuFontSizeDecrease = new FontSizeDecrease({ menuType: "button", enable: true });
        this.eventComponents.push(this.baseMenuFontSizeDecrease);

        this.baseMenuBold = new Bold({ menuType: "button", enable: true });
        this.eventComponents.push(this.baseMenuBold);

        this.baseMenuItalic = new Italic({ menuType: "button", enable: true });
        this.eventComponents.push(this.baseMenuItalic);

        this.baseMenuUnderline = new Underline({ menuType: "button", enable: true });
        this.eventComponents.push(this.baseMenuUnderline);

        this.baseMenuStrike = new Strike({ menuType: "button", enable: true });
        this.eventComponents.push(this.baseMenuStrike);

        this.baseMenuSubscript = new Subscript({ menuType: "button", enable: true });
        this.eventComponents.push(this.baseMenuSubscript);

        this.baseMenuSuperscript = new Superscript({ menuType: "button", enable: true });
        this.eventComponents.push(this.baseMenuSuperscript);

        this.baseMenuFontColor = new FontColor({ menuType: "color", enable: true });
        this.eventComponents.push(this.baseMenuFontColor);

        this.baseMenuHighlight = new Highlight({ menuType: "color", enable: true });
        this.eventComponents.push(this.baseMenuHighlight);
    }
    /**
     * 创建基础菜单
     * @param event 
     * @param options 
     */
    createBaseMenu(event: EditorEvents["create"], options: UAIEditorOptions) {
        this.classicMenuBaseGroup = document.createElement("div");
        this.classicMenuBaseGroup.style.display = "flex";
        this.classicMenuBaseScrollable = new ScrollableDiv(this.classicMenuBaseGroup);
        this.classicMenuBaseScrollable.style.display = "none";
        this.classicMenu.appendChild(this.classicMenuBaseScrollable);
        this.classicMenuBaseScrollable.onCreate(event, options);

        const group1 = document.createElement("div");
        group1.classList.add("uai-classic-virtual-group");
        this.classicMenuBaseGroup.appendChild(group1);
        group1.appendChild(this.baseMenuUndo);
        group1.appendChild(this.baseMenuRedo);
        group1.appendChild(this.baseMenuFormatPainter);
        group1.appendChild(this.baseMenuClearFormat);

        const group2 = document.createElement("div");
        group2.classList.add("uai-classic-virtual-group");
        this.classicMenuBaseGroup.appendChild(group2);
        group2.appendChild(this.baseMenuFontFamily);
        group2.appendChild(this.baseMenuFontSize);
        group2.appendChild(this.baseMenuFontSizeIncrease);
        group2.appendChild(this.baseMenuFontSizeDecrease);
        group2.appendChild(this.baseMenuBold);
        group2.appendChild(this.baseMenuItalic);
        group2.appendChild(this.baseMenuUnderline);
        group2.appendChild(this.baseMenuStrike);
        group2.appendChild(this.baseMenuSubscript);
        group2.appendChild(this.baseMenuSuperscript);
        group2.appendChild(this.baseMenuFontColor);
        group2.appendChild(this.baseMenuHighlight);
    }
}
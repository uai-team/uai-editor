// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { EditorEvents } from "@tiptap/core";
import { UAIEditorEventListener, UAIEditorOptions } from "../../../core/UAIEditor.ts";

import menuIcon from "../../../assets/icons/menu.svg";
import { ScrollableDiv } from "./ScrollableDiv.ts";

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

import { AlignLeft } from "../common/AlignLeft.ts";
import { AlignCenter } from "../common/AlignCenter.ts";
import { AlignRight } from "../common/AlignRight.ts";
import { AlignJustify } from "../common/AlignJustify.ts";
import { AlignDistributed } from "../common/AlignDistributed.ts";

import { Redo } from "./base/Redo.ts";
import { Undo } from "./base/Undo.ts";

import { FormatPainter } from "./base/FormatPainter.ts";
import { ClearFormat } from "./base/ClearFormat.ts";

import { FontFamily } from "./base/FontFamily.ts";
import { FontSize } from "./base/FontSize.ts";

import { OrderedList } from "./base/OrderedList.ts";
import { BulletList } from "./base/BulletList.ts";
import { TaskList } from "./base/TaskList.ts";
import { Indent } from "./base/Indent.ts";
import { Outdent } from "./base/Outdent.ts";
import { LineHeight } from "./base/LineHeight.ts";

import { BlockQuote } from "./base/BlockQuote.ts";
import { CodeBlock } from "./base/CodeBlock.ts";
import { Print } from "./base/Print.ts";

import { Link } from "./insert/Link.ts";
import { Image } from "./insert/Image.ts";

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

    // 插入菜单容器
    classicMenuInsertScrollable!: ScrollableDiv;
    classicMenuInsertGroup!: HTMLElement;

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

    baseMenuOrderedList!: OrderedList;
    baseMenuBulletList!: BulletList;
    baseMenuTaskList!: TaskList;
    baseMenuIndent!: Indent;
    baseMenuOutdent!: Outdent;
    baseMenuLineHeight!: LineHeight;

    baseMenuAlignLeft!: AlignLeft;
    baseMenuAlignCenter!: AlignCenter;
    baseMenuAlignRight!: AlignRight;
    baseMenuAlignJustify!: AlignJustify;
    baseMenuAlignDistributed!: AlignDistributed;
    baseMenuBlockQuote!: BlockQuote;
    baseMenuCodeBlock!: CodeBlock;
    baseMenuPrint!: Print;

    // 插入菜单
    insertMenuLink!: Link;
    insertMenuImage!: Image;

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
            this.classicMenuInsertScrollable.style.display = "none";
            if (menu === "base") {
                this.classicMenuBaseScrollable.style.display = "flex";
            }
            if (menu === "insert") {
                this.classicMenuInsertScrollable.style.display = "flex";
            }
        })
        // 创建分组菜单
        this.createBaseMenu(event, options);
        this.createInsertMenu(event, options);
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

        this.baseMenuOrderedList = new OrderedList({ menuType: "popup", enable: true });
        this.eventComponents.push(this.baseMenuOrderedList);

        this.baseMenuBulletList = new BulletList({ menuType: "popup", enable: true });
        this.eventComponents.push(this.baseMenuBulletList);

        this.baseMenuTaskList = new TaskList({ menuType: "popup", enable: true });
        this.eventComponents.push(this.baseMenuTaskList);

        this.baseMenuIndent = new Indent({ menuType: "button", enable: true });
        this.eventComponents.push(this.baseMenuIndent);

        this.baseMenuOutdent = new Outdent({ menuType: "button", enable: true });
        this.eventComponents.push(this.baseMenuOutdent);

        this.baseMenuLineHeight = new LineHeight({ menuType: "popup", enable: true });
        this.eventComponents.push(this.baseMenuLineHeight);

        this.baseMenuAlignLeft = new AlignLeft({ menuType: "button", enable: true });
        this.eventComponents.push(this.baseMenuAlignLeft);

        this.baseMenuAlignCenter = new AlignCenter({ menuType: "button", enable: true });
        this.eventComponents.push(this.baseMenuAlignCenter);

        this.baseMenuAlignRight = new AlignRight({ menuType: "button", enable: true });
        this.eventComponents.push(this.baseMenuAlignRight);

        this.baseMenuAlignJustify = new AlignJustify({ menuType: "button", enable: true });
        this.eventComponents.push(this.baseMenuAlignJustify);

        this.baseMenuAlignDistributed = new AlignDistributed({ menuType: "button", enable: true });
        this.eventComponents.push(this.baseMenuAlignDistributed);

        this.baseMenuBlockQuote = new BlockQuote({ menuType: "button", enable: true });
        this.eventComponents.push(this.baseMenuBlockQuote);

        this.baseMenuCodeBlock = new CodeBlock({ menuType: "button", enable: true });
        this.eventComponents.push(this.baseMenuCodeBlock);

        this.baseMenuPrint = new Print({ menuType: "button", enable: true, header: "classic", hideText: false });
        this.eventComponents.push(this.baseMenuPrint);

        this.insertMenuLink = new Link({ menuType: "button", enable: true, header: "classic", hideText: false });
        this.eventComponents.push(this.insertMenuLink);

        this.insertMenuImage = new Image({ menuType: "button", enable: true, header: "classic", hideText: false });
        this.eventComponents.push(this.insertMenuImage);
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

        const group3 = document.createElement("div");
        group3.classList.add("uai-classic-virtual-group");
        this.classicMenuBaseGroup.appendChild(group3);
        group3.appendChild(this.baseMenuOrderedList);
        group3.appendChild(this.baseMenuBulletList);
        group3.appendChild(this.baseMenuTaskList);
        group3.appendChild(this.baseMenuIndent);
        group3.appendChild(this.baseMenuOutdent);
        group3.appendChild(this.baseMenuLineHeight);
        group3.appendChild(this.baseMenuAlignLeft);
        group3.appendChild(this.baseMenuAlignCenter);
        group3.appendChild(this.baseMenuAlignRight);
        group3.appendChild(this.baseMenuAlignJustify);
        group3.appendChild(this.baseMenuAlignDistributed);
        group3.appendChild(this.baseMenuBlockQuote);
        group3.appendChild(this.baseMenuCodeBlock);

        const group4 = document.createElement("div");
        group4.classList.add("uai-classic-virtual-group");
        this.classicMenuBaseGroup.appendChild(group4);
        group4.appendChild(this.baseMenuPrint);
    }

    /**
     * 创建插入菜单
     * @param event 
     * @param options 
     */
    createInsertMenu(event: EditorEvents["create"], options: UAIEditorOptions) {
        this.classicMenuInsertGroup = document.createElement("div");
        this.classicMenuInsertGroup.style.display = "flex";
        this.classicMenuInsertScrollable = new ScrollableDiv(this.classicMenuInsertGroup);
        this.classicMenuInsertScrollable.style.display = "none";
        this.classicMenu.appendChild(this.classicMenuInsertScrollable);
        this.classicMenuInsertScrollable.onCreate(event, options);

        const group1 = document.createElement("div");
        group1.classList.add("uai-classic-virtual-group");
        this.classicMenuInsertGroup.appendChild(group1);
        group1.appendChild(this.insertMenuLink);
        group1.appendChild(this.insertMenuImage);
    }
}
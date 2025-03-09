// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { EditorEvents } from "@tiptap/core";

import { UAIEditorEventListener, UAIEditorOptions } from "../../../core/UAIEditor.ts";

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
import { Video } from "./insert/Video.ts";
import { Audio } from "./insert/Audio.ts";
import { File } from "./insert/File.ts";
import { HardBreak } from "./insert/HardBreak.ts";
import { Emoji } from "./insert/Emoji.ts";
import { Symbol } from "./insert/Symbol.ts";
import { Math } from "./insert/Math.ts";
import { Toc } from "./insert/Toc.ts";

import { InsertTable } from "./table/InsertTable.ts";
import { AddColumnAfter } from "./table/AddColumnAfter.ts";
import { AddColumnBefore } from "./table/AddColumnBefore.ts";
import { DeleteColumn } from "./table/DeleteColumn.ts";
import { AddRowAfter } from "./table/AddRowAfter.ts";
import { AddRowBefore } from "./table/AddRowBefore.ts";
import { DeleteRow } from "./table/DeleteRow.ts";
import { DeleteTable } from "./table/DeleteTable.ts";

import { Diagrams } from "./tools/Diagrams.ts";

import { ToggleToc } from "./page/ToggleToc.ts";
import { BackgroundColor } from "./page/BackgroundColor.ts";
import { Watermark } from "./page/Watermark.ts";

import { ExportDocx } from "./export/ExportDocx.ts";
import { ExportOdt } from "./export/ExportOdt.ts";
import { ExportPdf } from "./export/ExportPdf.ts";
import { ExportMarkdown } from "./export/ExportMarkdown.ts";
import { ExportImage } from "./export/ExportImage.ts";

import { ToggleChat } from "./ai/ToggleChat.ts";
import { ToggleImage } from "./ai/ToggleImage.ts";

import menuIcon from "../../../assets/icons/menu.svg";

/**
 * 传统菜单栏
 */
export class Classic extends HTMLElement implements UAIEditorEventListener {
    defaultToolbarMenus!: Record<string, any>[];
    eventComponents: UAIEditorEventListener[] = [];
    scrollableDivs: ScrollableDiv[] = [];

    // 传统菜单栏容器
    classicMenu!: HTMLElement;
    classicScrollableContainer!: HTMLElement;

    // 基础菜单容器
    classicMenuBaseScrollable!: ScrollableDiv;
    classicMenuBaseGroup!: HTMLElement;

    // 插入菜单容器
    classicMenuInsertScrollable!: ScrollableDiv;
    classicMenuInsertGroup!: HTMLElement;

    // 表格菜单容器
    classicMenuTableScrollable!: ScrollableDiv;
    classicMenuTableGroup!: HTMLElement;

    // 工具菜单容器
    classicMenuToolScrollable!: ScrollableDiv;
    classicMenuToolGroup!: HTMLElement;

    // 页面菜单容器
    classicMenuPageScrollable!: ScrollableDiv;
    classicMenuPageGroup!: HTMLElement;

    // 导出菜单容器
    classicMenuExportScrollable!: ScrollableDiv;
    classicMenuExportGroup!: HTMLElement;

    // 人工智能菜单容器
    classicMenuAIScrollable!: ScrollableDiv;
    classicMenuAIGroup!: HTMLElement;

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
    insertMenuVideo!: Video;
    insertMenuAudio!: Audio;
    insertMenuFile!: File;
    insertMenuHardBreak!: HardBreak;
    insertMenuEmoji!: Emoji;
    insertMenuSymbol!: Symbol;
    insertMenuMath!: Math;
    insertMenuToc!: Toc;

    // 表格菜单
    tableMenuInsertTable!: InsertTable;
    tableMenuAddColumnAfter!: AddColumnAfter;
    tableMenuAddColumnBefore!: AddColumnBefore;
    tableMenuDeleteColumn!: DeleteColumn;
    tableMenuAddRowAfter!: AddRowAfter;
    tableMenuAddRowBefore!: AddRowBefore;
    tableMenuDeleteRow!: DeleteRow;
    tableMenuDeleteTable!: DeleteTable;

    // 工具菜单
    toolsMenuDiagrams!: Diagrams;

    // 页面菜单
    pageMenuToggleToc!: ToggleToc;
    pageMenuBackgroundColor!: BackgroundColor;
    pageMenuWatermark!: Watermark;

    // 导出菜单
    exportMenuExportDocx!: ExportDocx;
    exportMenuExportOdt!: ExportOdt;
    exportMenuExportPdf!: ExportPdf;
    exportMenuExportMarkdown!: ExportMarkdown;
    exportMenuExportImage!: ExportImage;

    // 人工智能菜单
    aiMenuToggleChat!: ToggleChat;
    aiMenuToggleImage!: ToggleImage;

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
        this.classicMenu = document.createElement("div");
        this.classicMenu.classList.add("uai-classic-menu");
        this.appendChild(this.classicMenu);

        const selectDiv = document.createElement("div");
        selectDiv.classList.add("uai-classic-menu-switch");
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
            this.scrollableDivs.forEach(scrollable => {
                try {
                    this.classicScrollableContainer.removeChild(scrollable);
                } catch (e) {
                }
            });
            if (menu === "base") {
                this.classicScrollableContainer.appendChild(this.classicMenuBaseScrollable);
            }
            if (menu === "insert") {
                this.classicScrollableContainer.appendChild(this.classicMenuInsertScrollable);
            }
            if (menu === "table") {
                this.classicScrollableContainer.appendChild(this.classicMenuTableScrollable);
            }
            if (menu === "tools") {
                this.classicScrollableContainer.appendChild(this.classicMenuToolScrollable);
            }
            if (menu === "page") {
                this.classicScrollableContainer.appendChild(this.classicMenuPageScrollable);
            }
            if (menu === "export") {
                this.classicScrollableContainer.appendChild(this.classicMenuExportScrollable);
            }
            if (menu === "ai") {
                this.classicScrollableContainer.appendChild(this.classicMenuAIScrollable);
            }
        })
        
        this.classicScrollableContainer = document.createElement("div");
        this.classicScrollableContainer.classList.add("uai-classic-scrollable-container");
        this.classicMenu.appendChild(this.classicScrollableContainer);

        // 创建分组菜单
        this.createBaseMenu(event, options);
        this.createInsertMenu(event, options);
        this.createTableMenu(event, options);
        this.createToolMenu(event, options);
        this.createPageMenu(event, options);
        this.createExportMenu(event, options);
        this.createAIMenu(event, options);
        selectMuenus.dispatchEvent(new Event("change"));
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

        this.insertMenuVideo = new Video({ menuType: "button", enable: true, header: "classic", hideText: false });
        this.eventComponents.push(this.insertMenuVideo);

        this.insertMenuAudio = new Audio({ menuType: "button", enable: true, header: "classic", hideText: false });
        this.eventComponents.push(this.insertMenuAudio);

        this.insertMenuFile = new File({ menuType: "button", enable: true, header: "classic", hideText: false });
        this.eventComponents.push(this.insertMenuFile);

        this.insertMenuHardBreak = new HardBreak({ menuType: "button", enable: true, header: "classic", hideText: false });
        this.eventComponents.push(this.insertMenuHardBreak);

        this.insertMenuEmoji = new Emoji({ menuType: "popup", enable: true, header: "classic", hideText: false });
        this.eventComponents.push(this.insertMenuEmoji);

        this.insertMenuSymbol = new Symbol({ menuType: "popup", enable: true, header: "classic", hideText: false });
        this.eventComponents.push(this.insertMenuSymbol);

        this.insertMenuMath = new Math({ menuType: "button", enable: true, header: "classic", hideText: false });
        this.eventComponents.push(this.insertMenuMath);

        this.insertMenuToc = new Toc({ menuType: "button", enable: true, header: "classic", hideText: false });
        this.eventComponents.push(this.insertMenuToc);

        this.tableMenuInsertTable = new InsertTable({ menuType: "popup", enable: true, header: "classic", hideText: false });
        this.eventComponents.push(this.tableMenuInsertTable);

        this.tableMenuAddColumnAfter = new AddColumnAfter({ menuType: "button", enable: true, header: "classic", hideText: false });
        this.eventComponents.push(this.tableMenuAddColumnAfter);

        this.tableMenuAddColumnBefore = new AddColumnBefore({ menuType: "button", enable: true, header: "classic", hideText: false });
        this.eventComponents.push(this.tableMenuAddColumnBefore);

        this.tableMenuDeleteColumn = new DeleteColumn({ menuType: "button", enable: true, header: "classic", hideText: false });
        this.eventComponents.push(this.tableMenuDeleteColumn);

        this.tableMenuAddRowAfter = new AddRowAfter({ menuType: "button", enable: true, header: "classic", hideText: false });
        this.eventComponents.push(this.tableMenuAddRowAfter);

        this.tableMenuAddRowBefore = new AddRowBefore({ menuType: "button", enable: true, header: "classic", hideText: false });
        this.eventComponents.push(this.tableMenuAddRowBefore);

        this.tableMenuDeleteRow = new DeleteRow({ menuType: "button", enable: true, header: "classic", hideText: false });
        this.eventComponents.push(this.tableMenuDeleteRow);

        this.tableMenuDeleteTable = new DeleteTable({ menuType: "button", enable: true, header: "classic", hideText: false });
        this.eventComponents.push(this.tableMenuDeleteTable);

        this.toolsMenuDiagrams = new Diagrams({ menuType: "button", enable: true, header: "classic", hideText: false });
        this.eventComponents.push(this.toolsMenuDiagrams);

        this.pageMenuToggleToc = new ToggleToc({ menuType: "button", enable: true, header: "classic", hideText: false });
        this.eventComponents.push(this.pageMenuToggleToc);

        this.pageMenuBackgroundColor = new BackgroundColor({ menuType: "popup", enable: true, header: "classic", hideText: false });
        this.eventComponents.push(this.pageMenuBackgroundColor);

        this.pageMenuWatermark = new Watermark({ menuType: "popup", enable: true, header: "classic", hideText: false });
        this.eventComponents.push(this.pageMenuWatermark);

        this.exportMenuExportDocx = new ExportDocx({ menuType: "button", enable: true, header: "classic", hideText: false });
        this.eventComponents.push(this.exportMenuExportDocx);

        this.exportMenuExportOdt = new ExportOdt({ menuType: "button", enable: true, header: "classic", hideText: false });
        this.eventComponents.push(this.exportMenuExportOdt);

        this.exportMenuExportPdf = new ExportPdf({ menuType: "button", enable: true, header: "classic", hideText: false });
        this.eventComponents.push(this.exportMenuExportPdf);

        this.exportMenuExportMarkdown = new ExportMarkdown({ menuType: "button", enable: true, header: "classic", hideText: false });
        this.eventComponents.push(this.exportMenuExportMarkdown);

        this.exportMenuExportImage = new ExportImage({ menuType: "button", enable: true, header: "classic", hideText: false });
        this.eventComponents.push(this.exportMenuExportImage);

        this.aiMenuToggleChat = new ToggleChat({ menuType: "button", enable: true, header: "classic", hideText: false });
        this.eventComponents.push(this.aiMenuToggleChat);

        this.aiMenuToggleImage = new ToggleImage({ menuType: "button", enable: true, header: "classic", hideText: false });
        this.eventComponents.push(this.aiMenuToggleImage);
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
        this.classicMenuBaseScrollable.style.display = "flex";
        this.classicMenuBaseScrollable.onCreate(event, options);
        this.scrollableDivs.push(this.classicMenuBaseScrollable);

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
        this.classicMenuInsertScrollable.style.display = "flex";
        this.classicMenuInsertScrollable.onCreate(event, options);
        this.scrollableDivs.push(this.classicMenuInsertScrollable);

        const group1 = document.createElement("div");
        group1.classList.add("uai-classic-virtual-group");
        this.classicMenuInsertGroup.appendChild(group1);
        group1.appendChild(this.insertMenuLink);
        group1.appendChild(this.insertMenuImage);
        group1.appendChild(this.insertMenuVideo);
        group1.appendChild(this.insertMenuAudio);
        group1.appendChild(this.insertMenuFile);

        const group2 = document.createElement("div");
        group2.classList.add("uai-classic-virtual-group");
        this.classicMenuInsertGroup.appendChild(group2);
        group2.appendChild(this.insertMenuHardBreak);
        group2.appendChild(this.insertMenuEmoji);
        group2.appendChild(this.insertMenuSymbol);
        group2.appendChild(this.insertMenuMath);

        const group3 = document.createElement("div");
        group3.classList.add("uai-classic-virtual-group");
        this.classicMenuInsertGroup.appendChild(group3);
        group3.appendChild(this.insertMenuToc);
    }

    /**
     * 创建表格菜单
     * @param event 
     * @param options 
     */
    createTableMenu(event: EditorEvents["create"], options: UAIEditorOptions) {
        this.classicMenuTableGroup = document.createElement("div");
        this.classicMenuTableGroup.style.display = "flex";
        this.classicMenuTableScrollable = new ScrollableDiv(this.classicMenuTableGroup);
        this.classicMenuTableScrollable.style.display = "flex";
        this.classicMenuTableScrollable.onCreate(event, options);
        this.scrollableDivs.push(this.classicMenuTableScrollable);

        const group1 = document.createElement("div");
        group1.classList.add("uai-classic-virtual-group");
        this.classicMenuTableGroup.appendChild(group1);
        group1.appendChild(this.tableMenuInsertTable);

        const group2 = document.createElement("div");
        group2.classList.add("uai-classic-virtual-group");
        this.classicMenuTableGroup.appendChild(group2);
        group2.appendChild(this.tableMenuAddColumnBefore);
        group2.appendChild(this.tableMenuAddColumnAfter);
        group2.appendChild(this.tableMenuDeleteColumn);
        group2.appendChild(this.tableMenuAddRowBefore);
        group2.appendChild(this.tableMenuAddRowAfter);
        group2.appendChild(this.tableMenuDeleteRow);

        const group3 = document.createElement("div");
        group3.classList.add("uai-classic-virtual-group");
        this.classicMenuTableGroup.appendChild(group3);
        group3.appendChild(this.tableMenuDeleteTable);
    }

    /**
     * 创建工具菜单
     * @param event 
     * @param options 
     */
    createToolMenu(event: EditorEvents["create"], options: UAIEditorOptions) {
        this.classicMenuToolGroup = document.createElement("div");
        this.classicMenuToolGroup.style.display = "flex";
        this.classicMenuToolScrollable = new ScrollableDiv(this.classicMenuToolGroup);
        this.classicMenuToolScrollable.style.display = "flex";
        this.classicMenuToolScrollable.onCreate(event, options);
        this.scrollableDivs.push(this.classicMenuToolScrollable);

        const group1 = document.createElement("div");
        group1.classList.add("uai-classic-virtual-group");
        this.classicMenuToolGroup.appendChild(group1);
        group1.appendChild(this.toolsMenuDiagrams);
    }

    /**
     * 创建页面菜单
     * @param event 
     * @param options 
     */
    createPageMenu(event: EditorEvents["create"], options: UAIEditorOptions) {
        this.classicMenuPageGroup = document.createElement("div");
        this.classicMenuPageGroup.style.display = "flex";
        this.classicMenuPageScrollable = new ScrollableDiv(this.classicMenuPageGroup);
        this.classicMenuPageScrollable.style.display = "flex";
        this.classicMenuPageScrollable.onCreate(event, options);
        this.scrollableDivs.push(this.classicMenuPageScrollable);

        const group1 = document.createElement("div");
        group1.classList.add("uai-classic-virtual-group");
        this.classicMenuPageGroup.appendChild(group1);
        group1.appendChild(this.pageMenuToggleToc);

        const group2 = document.createElement("div");
        group2.classList.add("uai-classic-virtual-group");
        this.classicMenuPageGroup.appendChild(group2);
        group2.appendChild(this.pageMenuBackgroundColor);
        group2.appendChild(this.pageMenuWatermark);
    }

    /**
     * 创建导出菜单
     * @param event 
     * @param options 
     */
    createExportMenu(event: EditorEvents["create"], options: UAIEditorOptions) {
        this.classicMenuExportGroup = document.createElement("div");
        this.classicMenuExportGroup.style.display = "flex";
        this.classicMenuExportScrollable = new ScrollableDiv(this.classicMenuExportGroup);
        this.classicMenuExportScrollable.style.display = "flex";
        this.classicMenuExportScrollable.onCreate(event, options);
        this.scrollableDivs.push(this.classicMenuExportScrollable);

        const group1 = document.createElement("div");
        group1.classList.add("uai-classic-virtual-group");
        this.classicMenuExportGroup.appendChild(group1);
        group1.appendChild(this.exportMenuExportDocx);
        group1.appendChild(this.exportMenuExportOdt);
        group1.appendChild(this.exportMenuExportPdf);
        group1.appendChild(this.exportMenuExportMarkdown);

        const group2 = document.createElement("div");
        group2.classList.add("uai-classic-virtual-group");
        this.classicMenuExportGroup.appendChild(group2);
        group2.appendChild(this.exportMenuExportImage);
    }

    /**
     * 创建人工智能菜单
     * @param event 
     * @param options 
     */
    createAIMenu(event: EditorEvents["create"], options: UAIEditorOptions) {
        this.classicMenuAIGroup = document.createElement("div");
        this.classicMenuAIGroup.style.display = "flex";
        this.classicMenuAIScrollable = new ScrollableDiv(this.classicMenuAIGroup);
        this.classicMenuAIScrollable.style.display = "flex";
        this.classicMenuAIScrollable.onCreate(event, options);
        this.scrollableDivs.push(this.classicMenuAIScrollable);

        const group1 = document.createElement("div");
        group1.classList.add("uai-classic-virtual-group");
        this.classicMenuAIGroup.appendChild(group1);
        group1.appendChild(this.aiMenuToggleChat);
        group1.appendChild(this.aiMenuToggleImage);
    }
}
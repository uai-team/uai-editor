// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { EditorEvents } from "@tiptap/core";

import { t } from "i18next";

import { UAIEditorEventListener, UAIEditorOptions } from "../../../core/UAIEditor.ts";
import { ScrollableDiv } from "./ScrollableDiv.ts";
import { Icons } from "../../Icons.ts";

import { FontSizeIncrease } from "../common/FontSizeIncrease.ts";
import { FontSizeDecrease } from "../common/FontSizeDecrease.ts";

import { Bold } from "../common/Bold.ts";
import { Italic } from "../common/Italic.ts";
import { Underline } from "../common/Underline.ts";
import { Strike } from "../common/Strike.ts";
import { Subscript } from "../common/Subscript.ts";
import { Superscript } from "../common/Superscript.ts";

import { AlignLeft } from "../common/AlignLeft.ts";
import { AlignCenter } from "../common/AlignCenter.ts";
import { AlignRight } from "../common/AlignRight.ts";
import { AlignJustify } from "../common/AlignJustify.ts";
import { AlignDistributed } from "../common/AlignDistributed.ts";

import { FontColor } from "../common/FontColor.ts";
import { Highlight } from "../common/Highlight.ts";

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

/**
 * 经典菜单栏
 */
export class Ribbon extends HTMLElement implements UAIEditorEventListener {
    defaultToolbarMenus!: Record<string, any>[];
    eventComponents: UAIEditorEventListener[] = [];
    headingOptions: Record<string, any>[] = [];

    // 经典菜单栏容器
    ribbonMenu!: HTMLElement;
    ribbonScrollableContainer!: HTMLElement;

    // 基础菜单容器
    ribbonMenuBaseScrollable!: ScrollableDiv;
    ribbonMenuBaseGroup!: HTMLElement;

    // 插入菜单容器
    ribbonMenuInsertScrollable!: ScrollableDiv;
    ribbonMenuInsertGroup!: HTMLElement;

    // 表格菜单容器
    ribbonMenuTableScrollable!: ScrollableDiv;
    ribbonMenuTableGroup!: HTMLElement;

    // 工具菜单容器
    ribbonMenuToolScrollable!: ScrollableDiv;
    ribbonMenuToolGroup!: HTMLElement;

    // 页面菜单容器
    ribbonMenuPageScrollable!: ScrollableDiv;
    ribbonMenuPageGroup!: HTMLElement;

    // 导出菜单容器
    ribbonMenuExportScrollable!: ScrollableDiv;
    ribbonMenuExportGroup!: HTMLElement;

    // 人工智能菜单容器
    ribbonMenuAIScrollable!: ScrollableDiv;
    ribbonMenuAIGroup!: HTMLElement;

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
        this.ribbonMenu = document.createElement("div");
        this.ribbonMenu.classList.add("uai-ribbon-menu");
        this.appendChild(this.ribbonMenu);

        const ribbonTabs = document.createElement("div");
        ribbonTabs.classList.add("uai-ribbon-tabs");
        this.ribbonMenu.appendChild(ribbonTabs);

        // 添加菜单分组
        this.defaultToolbarMenus.forEach(menu => {
            const tab = document.createElement("div");
            tab.classList.add("uai-ribbon-tabs-item");
            tab.innerHTML = menu.label;
            // 添加事件，处理菜单分组切换、界面元素切换
            tab.addEventListener("click", () => {
                for (var i = 0; i < ribbonTabs.children.length; i++) {
                    ribbonTabs.children[i].classList.remove("active");
                }
                tab.classList.add("active");
                this.ribbonMenuBaseScrollable.style.display = "none";
                this.ribbonMenuInsertScrollable.style.display = "none";
                this.ribbonMenuTableScrollable.style.display = "none";
                this.ribbonMenuToolScrollable.style.display = "none";
                this.ribbonMenuPageScrollable.style.display = "none";
                this.ribbonMenuExportScrollable.style.display = "none";
                this.ribbonMenuAIScrollable.style.display = "none";
                if (menu.value === "base") {
                    this.ribbonMenuBaseScrollable.style.display = "flex";
                }
                if (menu.value === "insert") {
                    this.ribbonMenuInsertScrollable.style.display = "flex";
                }
                if (menu.value === "table") {
                    this.ribbonMenuTableScrollable.style.display = "flex";
                }
                if (menu.value === "tools") {
                    this.ribbonMenuToolScrollable.style.display = "flex";
                }
                if (menu.value === "page") {
                    this.ribbonMenuPageScrollable.style.display = "flex";
                }
                if (menu.value === "export") {
                    this.ribbonMenuExportScrollable.style.display = "flex";
                }
                if (menu.value === "ai") {
                    this.ribbonMenuAIScrollable.style.display = "flex";
                }
            })
            ribbonTabs.appendChild(tab);
        });
        ribbonTabs.children[0].classList.add("active")

        this.ribbonScrollableContainer = document.createElement("div");
        this.ribbonScrollableContainer.classList.add("uai-ribbon-scrollable-container");
        this.ribbonMenu.appendChild(this.ribbonScrollableContainer);

        this.headingOptions.push({ label: t('base.heading.paragraph'), desc: 'text', value: 'paragraph', element: document.createElement("div") });

        for (const i of Array.from({ length: 6 }).keys()) {
            const level = i + 1
            this.headingOptions.push({ label: `${t('base.heading.text')}`.replace("{level}", `${level}`), desc: `h${level}`, value: level, element: document.createElement("div") })
        }

        // 创建分组菜单
        this.createBaseMenu(event, options);
        this.createInsertMenu(event, options);
        this.createTableMenu(event, options);
        this.createToolMenu(event, options);
        this.createPageMenu(event, options);
        this.createExportMenu(event, options);
        this.createAIMenu(event, options);
        this.ribbonMenuBaseScrollable.style.display = "flex";
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

        this.headingOptions.forEach(headingOption => {
            // 标题样式设置
            (headingOption.element as HTMLElement).classList.remove("active");
            if (headingOption.value === "paragraph" && event.editor.isActive('paragraph')) {
                // 如果当前选中非标题，则正文选项被激活
                (headingOption.element as HTMLElement).classList.add("active");
            } else if (event.editor.isActive('heading', { level: headingOption.value })) {
                // 如果当前选中是标题，则激活对应的标题选项
                (headingOption.element as HTMLElement).classList.add("active");
            }
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
        this.baseMenuUndo = new Undo({ menuType: "button", enable: true });
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

        this.baseMenuPrint = new Print({ menuType: "button", enable: true, huge: true, hideText: false });
        this.eventComponents.push(this.baseMenuPrint);

        this.insertMenuLink = new Link({ menuType: "button", enable: true, huge: true });
        this.eventComponents.push(this.insertMenuLink);

        this.insertMenuImage = new Image({ menuType: "button", enable: true, huge: true });
        this.eventComponents.push(this.insertMenuImage);

        this.insertMenuVideo = new Video({ menuType: "button", enable: true, huge: true });
        this.eventComponents.push(this.insertMenuVideo);

        this.insertMenuAudio = new Audio({ menuType: "button", enable: true, huge: true });
        this.eventComponents.push(this.insertMenuAudio);

        this.insertMenuHardBreak = new HardBreak({ menuType: "button", enable: true, huge: true });
        this.eventComponents.push(this.insertMenuHardBreak);

        this.insertMenuEmoji = new Emoji({ menuType: "popup", enable: true, huge: true, hideText: false });
        this.eventComponents.push(this.insertMenuEmoji);

        this.insertMenuSymbol = new Symbol({ menuType: "popup", enable: true, huge: true, hideText: false });
        this.eventComponents.push(this.insertMenuSymbol);

        this.insertMenuMath = new Math({ menuType: "button", enable: true, huge: true });
        this.eventComponents.push(this.insertMenuMath);

        this.insertMenuToc = new Toc({ menuType: "button", enable: true, huge: true });
        this.eventComponents.push(this.insertMenuToc);

        this.tableMenuInsertTable = new InsertTable({ menuType: "popup", enable: true, huge: true, hideText: false });
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

        this.tableMenuDeleteTable = new DeleteTable({ menuType: "button", enable: true, huge: true, hideText: false });
        this.eventComponents.push(this.tableMenuDeleteTable);

        this.toolsMenuDiagrams = new Diagrams({ menuType: "button", enable: true, huge: true, hideText: false });
        this.eventComponents.push(this.toolsMenuDiagrams);

        this.pageMenuToggleToc = new ToggleToc({ menuType: "button", enable: true, huge: true, hideText: false });
        this.eventComponents.push(this.pageMenuToggleToc);

        this.pageMenuBackgroundColor = new BackgroundColor({ menuType: "popup", enable: true, huge: true, hideText: false });
        this.eventComponents.push(this.pageMenuBackgroundColor);

        this.pageMenuWatermark = new Watermark({ menuType: "popup", enable: true, huge: true, hideText: false });
        this.eventComponents.push(this.pageMenuWatermark);

        this.exportMenuExportDocx = new ExportDocx({ menuType: "button", enable: true, huge: true, hideText: false });
        this.eventComponents.push(this.exportMenuExportDocx);

        this.exportMenuExportOdt = new ExportOdt({ menuType: "button", enable: true, huge: true, hideText: false });
        this.eventComponents.push(this.exportMenuExportOdt);

        this.exportMenuExportPdf = new ExportPdf({ menuType: "button", enable: true, huge: true, hideText: false });
        this.eventComponents.push(this.exportMenuExportPdf);

        this.exportMenuExportMarkdown = new ExportMarkdown({ menuType: "button", enable: true, huge: true, hideText: false });
        this.eventComponents.push(this.exportMenuExportMarkdown);

        this.exportMenuExportImage = new ExportImage({ menuType: "button", enable: true, huge: true, hideText: false });
        this.eventComponents.push(this.exportMenuExportImage);

        this.aiMenuToggleChat = new ToggleChat({ menuType: "button", enable: true, huge: true, hideText: false });
        this.eventComponents.push(this.aiMenuToggleChat);

        this.aiMenuToggleImage = new ToggleImage({ menuType: "button", enable: true, huge: true, hideText: false });
        this.eventComponents.push(this.aiMenuToggleImage);
    }

    /**
     * 创建基础菜单
     * @param event 
     * @param options 
     */
    createBaseMenu(event: EditorEvents["create"], _options: UAIEditorOptions) {
        this.ribbonMenuBaseGroup = document.createElement("div");
        this.ribbonMenuBaseGroup.classList.add("uai-ribbon-container");
        this.ribbonMenuBaseGroup.style.display = "flex";
        this.ribbonMenuBaseScrollable = new ScrollableDiv(this.ribbonMenuBaseGroup);
        this.ribbonMenuBaseScrollable.style.display = "none";
        this.ribbonScrollableContainer.appendChild(this.ribbonMenuBaseScrollable);

        const group1 = document.createElement("div");
        group1.classList.add("uai-ribbon-virtual-group");
        this.ribbonMenuBaseGroup.appendChild(group1);

        const group1row1 = document.createElement("div");
        group1row1.classList.add("uai-ribbon-virtual-group-row");
        group1.appendChild(group1row1);
        group1row1.appendChild(this.baseMenuUndo);
        group1row1.appendChild(this.baseMenuRedo);

        const group1row2 = document.createElement("div");
        group1row2.classList.add("uai-ribbon-virtual-group-row");
        group1.appendChild(group1row2);
        group1row2.appendChild(this.baseMenuFormatPainter);
        group1row2.appendChild(this.baseMenuClearFormat);

        const group2 = document.createElement("div");
        group2.classList.add("uai-ribbon-virtual-group");
        this.ribbonMenuBaseGroup.appendChild(group2);

        const group2row1 = document.createElement("div");
        group2row1.classList.add("uai-ribbon-virtual-group-row");
        group2.appendChild(group2row1);
        group2row1.appendChild(this.baseMenuFontFamily);
        group2row1.appendChild(this.baseMenuFontSize);
        group2row1.appendChild(this.baseMenuFontSizeIncrease);
        group2row1.appendChild(this.baseMenuFontSizeDecrease);

        const group2row2 = document.createElement("div");
        group2row2.classList.add("uai-ribbon-virtual-group-row");
        group2.appendChild(group2row2);
        group2row2.appendChild(this.baseMenuBold);
        group2row2.appendChild(this.baseMenuItalic);
        group2row2.appendChild(this.baseMenuUnderline);
        group2row2.appendChild(this.baseMenuStrike);
        group2row2.appendChild(this.baseMenuSubscript);
        group2row2.appendChild(this.baseMenuSuperscript);
        group2row2.appendChild(this.baseMenuFontColor);
        group2row2.appendChild(this.baseMenuHighlight);

        const group3 = document.createElement("div");
        group3.classList.add("uai-ribbon-virtual-group");
        this.ribbonMenuBaseGroup.appendChild(group3);

        const group3row1 = document.createElement("div");
        group3row1.classList.add("uai-ribbon-virtual-group-row");
        group3.appendChild(group3row1);
        group3row1.appendChild(this.baseMenuOrderedList);
        group3row1.appendChild(this.baseMenuBulletList);
        group3row1.appendChild(this.baseMenuTaskList);
        group3row1.appendChild(this.baseMenuIndent);
        group3row1.appendChild(this.baseMenuOutdent);
        group3row1.appendChild(this.baseMenuLineHeight);

        const group3row2 = document.createElement("div");
        group3row2.classList.add("uai-ribbon-virtual-group-row");
        group3.appendChild(group3row2);
        group3row2.appendChild(this.baseMenuAlignLeft);
        group3row2.appendChild(this.baseMenuAlignCenter);
        group3row2.appendChild(this.baseMenuAlignRight);
        group3row2.appendChild(this.baseMenuAlignJustify);
        group3row2.appendChild(this.baseMenuAlignDistributed);
        group3row2.appendChild(this.baseMenuBlockQuote);
        group3row2.appendChild(this.baseMenuCodeBlock);

        const group4 = document.createElement("div");
        group4.classList.add("uai-ribbon-virtual-group");
        this.ribbonMenuBaseGroup.appendChild(group4);

        const headingContainer = document.createElement("div");
        headingContainer.classList.add("uai-ribbon-heading-container")

        const headingList = document.createElement("div");
        headingList.classList.add("uai-ribbon-heading-list");

        const headingArrow = document.createElement("div");
        headingArrow.classList.add("uai-ribbon-heading-arrow");
        headingArrow.innerHTML = Icons.ArrowDown;
        headingArrow.addEventListener("click", () => {
            headingContainer.style.height = "104px";
        });
        document.addEventListener('click', (event) => {
            if (!headingContainer.contains(event.target as Node)) {
                headingContainer.style.height = "56px";
            }
        });

        this.headingOptions.forEach(headingOption => {
            const item = headingOption.element;
            item.classList.add("uai-ribbon-heading-item");

            const title = document.createElement("div");
            title.classList.add("uai-ribbon-heading-item-title");
            title.classList.add(headingOption.desc);
            title.innerHTML = headingOption.label;
            const subtitle = document.createElement("div");
            subtitle.classList.add("uai-ribbon-heading-item-subtitle");
            subtitle.innerHTML = headingOption.desc
            item.appendChild(title);
            item.appendChild(subtitle);
            item.addEventListener("click", () => {
                if (headingOption.value === 'paragraph') {
                    event.editor.chain().focus().setParagraph().run();
                } else {
                    event.editor.chain().focus().toggleHeading({ level: headingOption.value }).run();
                }
            });
            headingList.appendChild(item);
        })

        headingContainer.appendChild(headingList);
        headingContainer.appendChild(headingArrow);
        group4.appendChild(headingContainer);

        const group5 = document.createElement("div");
        group5.classList.add("uai-ribbon-virtual-group");
        this.ribbonMenuBaseGroup.appendChild(group5);
        group5.appendChild(this.baseMenuPrint);
    }

    /**
     * 创建插入菜单
     * @param event 
     * @param options 
     */
    createInsertMenu(_event: EditorEvents["create"], _options: UAIEditorOptions) {
        this.ribbonMenuInsertGroup = document.createElement("div");
        this.ribbonMenuInsertGroup.classList.add("uai-ribbon-container");
        this.ribbonMenuInsertGroup.style.display = "flex";
        this.ribbonMenuInsertScrollable = new ScrollableDiv(this.ribbonMenuInsertGroup);
        this.ribbonMenuInsertScrollable.style.display = "none";
        this.ribbonScrollableContainer.appendChild(this.ribbonMenuInsertScrollable);

        const group1 = document.createElement("div");
        group1.classList.add("uai-ribbon-virtual-group");
        this.ribbonMenuInsertGroup.appendChild(group1);
        group1.appendChild(this.insertMenuLink);
        group1.appendChild(this.insertMenuImage);
        group1.appendChild(this.insertMenuVideo);
        group1.appendChild(this.insertMenuAudio);

        const group2 = document.createElement("div");
        group2.classList.add("uai-ribbon-virtual-group");
        this.ribbonMenuInsertGroup.appendChild(group2);
        group2.appendChild(this.insertMenuHardBreak);
        group2.appendChild(this.insertMenuEmoji);
        group2.appendChild(this.insertMenuSymbol);
        group2.appendChild(this.insertMenuMath);

        const group3 = document.createElement("div");
        group3.classList.add("uai-ribbon-virtual-group");
        this.ribbonMenuInsertGroup.appendChild(group3);
        group3.appendChild(this.insertMenuToc);
    }

    /**
     * 创建表格菜单
     * @param event 
     * @param options 
     */
    createTableMenu(_event: EditorEvents["create"], _options: UAIEditorOptions) {
        this.ribbonMenuTableGroup = document.createElement("div");
        this.ribbonMenuTableGroup.classList.add("uai-ribbon-container");
        this.ribbonMenuTableGroup.style.display = "flex";
        this.ribbonMenuTableScrollable = new ScrollableDiv(this.ribbonMenuTableGroup);
        this.ribbonMenuTableScrollable.style.display = "none";
        this.ribbonScrollableContainer.appendChild(this.ribbonMenuTableScrollable);

        const group1 = document.createElement("div");
        group1.classList.add("uai-ribbon-virtual-group");
        this.ribbonMenuTableGroup.appendChild(group1);
        group1.appendChild(this.tableMenuInsertTable);

        const group2 = document.createElement("div");
        group2.classList.add("uai-ribbon-virtual-group");
        this.ribbonMenuTableGroup.appendChild(group2);

        const group2row1 = document.createElement("div");
        group2row1.classList.add("uai-ribbon-virtual-group-row");
        group2.appendChild(group2row1);
        group2row1.appendChild(this.tableMenuAddColumnBefore);
        group2row1.appendChild(this.tableMenuAddColumnAfter);
        group2row1.appendChild(this.tableMenuDeleteColumn);

        const group2row2 = document.createElement("div");
        group2row2.classList.add("uai-ribbon-virtual-group-row");
        group2.appendChild(group2row2);
        group2row2.appendChild(this.tableMenuAddRowBefore);
        group2row2.appendChild(this.tableMenuAddRowAfter);
        group2row2.appendChild(this.tableMenuDeleteRow);

        const group3 = document.createElement("div");
        group3.classList.add("uai-ribbon-virtual-group");
        this.ribbonMenuTableGroup.appendChild(group3);
        group3.appendChild(this.tableMenuDeleteTable);
    }

    /**
     * 创建工具菜单
     * @param event 
     * @param options 
     */
    createToolMenu(_event: EditorEvents["create"], _options: UAIEditorOptions) {
        this.ribbonMenuToolGroup = document.createElement("div");
        this.ribbonMenuToolGroup.classList.add("uai-ribbon-container");
        this.ribbonMenuToolGroup.style.display = "flex";
        this.ribbonMenuToolScrollable = new ScrollableDiv(this.ribbonMenuToolGroup);
        this.ribbonMenuToolScrollable.style.display = "none";
        this.ribbonScrollableContainer.appendChild(this.ribbonMenuToolScrollable);

        const group1 = document.createElement("div");
        group1.classList.add("uai-ribbon-virtual-group");
        this.ribbonMenuToolGroup.appendChild(group1);
        group1.appendChild(this.toolsMenuDiagrams);
    }

    /**
     * 创建页面菜单
     * @param event 
     * @param options 
     */
    createPageMenu(_event: EditorEvents["create"], _options: UAIEditorOptions) {
        this.ribbonMenuPageGroup = document.createElement("div");
        this.ribbonMenuPageGroup.classList.add("uai-ribbon-container");
        this.ribbonMenuPageGroup.style.display = "flex";
        this.ribbonMenuPageScrollable = new ScrollableDiv(this.ribbonMenuPageGroup);
        this.ribbonMenuPageScrollable.style.display = "none";
        this.ribbonScrollableContainer.appendChild(this.ribbonMenuPageScrollable);

        const group1 = document.createElement("div");
        group1.classList.add("uai-ribbon-virtual-group");
        this.ribbonMenuPageGroup.appendChild(group1);
        group1.appendChild(this.pageMenuToggleToc);

        const group2 = document.createElement("div");
        group2.classList.add("uai-ribbon-virtual-group");
        this.ribbonMenuPageGroup.appendChild(group2);
        group2.appendChild(this.pageMenuBackgroundColor);
        group2.appendChild(this.pageMenuWatermark);
    }

    /**
     * 创建导出菜单
     * @param event 
     * @param options 
     */
    createExportMenu(_event: EditorEvents["create"], _options: UAIEditorOptions) {
        this.ribbonMenuExportGroup = document.createElement("div");
        this.ribbonMenuExportGroup.classList.add("uai-ribbon-container");
        this.ribbonMenuExportGroup.style.display = "flex";
        this.ribbonMenuExportScrollable = new ScrollableDiv(this.ribbonMenuExportGroup);
        this.ribbonMenuExportScrollable.style.display = "none";
        this.ribbonScrollableContainer.appendChild(this.ribbonMenuExportScrollable);

        const group1 = document.createElement("div");
        group1.classList.add("uai-ribbon-virtual-group");
        this.ribbonMenuExportGroup.appendChild(group1);
        group1.appendChild(this.exportMenuExportDocx);
        group1.appendChild(this.exportMenuExportOdt);
        group1.appendChild(this.exportMenuExportPdf);
        group1.appendChild(this.exportMenuExportMarkdown);

        const group2 = document.createElement("div");
        group2.classList.add("uai-ribbon-virtual-group");
        this.ribbonMenuExportGroup.appendChild(group2);
        group2.appendChild(this.exportMenuExportImage);
    }

    /**
     * 创建人工智能菜单
     * @param event 
     * @param options 
     */
    createAIMenu(_event: EditorEvents["create"], _options: UAIEditorOptions) {
        this.ribbonMenuAIGroup = document.createElement("div");
        this.ribbonMenuAIGroup.classList.add("uai-ribbon-container");
        this.ribbonMenuAIGroup.style.display = "flex";
        this.ribbonMenuAIScrollable = new ScrollableDiv(this.ribbonMenuAIGroup);
        this.ribbonMenuAIScrollable.style.display = "none";
        this.ribbonScrollableContainer.appendChild(this.ribbonMenuAIScrollable);

        const group1 = document.createElement("div");
        group1.classList.add("uai-ribbon-virtual-group");
        this.ribbonMenuAIGroup.appendChild(group1);
        group1.appendChild(this.aiMenuToggleChat);
        group1.appendChild(this.aiMenuToggleImage);
    }
}
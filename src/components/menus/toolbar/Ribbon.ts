// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { EditorEvents } from "@tiptap/core";
import { UAIEditorEventListener, UAIEditorOptions } from "../../../core/UAIEditor.ts";

import { t } from "i18next";
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
                if (menu.value === "base") {
                    this.ribbonMenuBaseScrollable.style.display = "flex";
                }
                if (menu.value === "insert") {
                    this.ribbonMenuInsertScrollable.style.display = "flex";
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
    }
}
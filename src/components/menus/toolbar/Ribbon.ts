// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { EditorEvents } from "@tiptap/core";
import { UAIEditorEventListener, UAIEditorOptions } from "../../../core/UAIEditor.ts";

import { t } from "i18next";
import { ScrollableDiv } from "./ScrollableDiv";

import { FontSizeIncrease } from "../common/FontSizeIncrease.ts";
import { FontSizeDecrease } from "../common/FontSizeDecrease.ts";

import { Redo } from "./base/Redo";
import { Undo } from "./base/Undo";

import { FormatPainter } from "./base/FormatPainter";
import { ClearFormat } from "./base/ClearFormat";

import { FontFamily } from "./base/FontFamily";
import { FontSize } from "./base/FontSize";

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

    // 基础菜单
    baseMenuUndo!: Undo;
    baseMenuRedo!: Redo;
    baseMenuFormatPainter!: FormatPainter;
    baseMenuClearFormat!: ClearFormat;

    baseMenuFontFamily!: FontFamily;
    baseMenuFontSize!: FontSize;
    baseMenuFontSizeIncrease!: FontSizeIncrease;
    baseMenuFontSizeDecrease!: FontSizeDecrease;

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
                if (menu.value === "base") {
                    this.ribbonMenuBaseScrollable.style.display = "flex";
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

    }
}
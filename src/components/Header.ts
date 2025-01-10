// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { EditorEvents } from "@tiptap/core";

import { t } from "i18next";
import tippy, { Instance, Props } from "tippy.js";

import { InnerEditor, UAIEditorEventListener, UAIEditorOptions } from "../core/UAIEditor.ts";
import { Ribbon } from "./menus/toolbar/Ribbon.ts";
import { Classic } from "./menus/toolbar/Classic.ts";

import expandDownIcon from "../assets/icons/expand-down.svg";
import toolbarRibbon from "../assets/icons/toolbar-ribbon.svg";
import toolbarClassic from "../assets/icons/toolbar-classic.svg";
import toolbarSource from "../assets/icons/toolbar-source.svg";
import codeblock from "../assets/icons/codeblock.svg";

/**
 * 文档顶部菜单栏
 */
export class Header extends HTMLElement implements UAIEditorEventListener {
    toolbar!: HTMLElement;
    container!: HTMLElement;
    actions!: HTMLElement;

    defaultToolbarMenus!: Record<string, any>[];

    // 专业工具栏
    ribbonMenu!: Ribbon;
    // 经典工具栏
    classicMenu!: Classic;
    // 源码编辑器
    sourceMenu!: HTMLElement;

    // 菜单模式
    menuMode!: "ribbon" | "classic" | "source";
    tippyInstance!: Instance<Props>;

    constructor() {
        super();

        // 初始化所有菜单分组
        this.defaultToolbarMenus = [
            { label: t('toolbar.base'), value: 'base' },
            { label: t('toolbar.insert'), value: 'insert' },
            { label: t('toolbar.table'), value: 'table' },
            { label: t('toolbar.tools'), value: 'tools' },
            { label: t('toolbar.page'), value: 'page' },
            { label: t('toolbar.export'), value: 'export' },
            { label: t('toolbar.ai'), value: 'ai' },
        ];
        // 创建专业工具栏
        this.ribbonMenu = new Ribbon(this.defaultToolbarMenus);
        // 创建经典工具栏
        this.classicMenu = new Classic(this.defaultToolbarMenus);
        // 创建源码编辑器
        this.sourceMenu = document.createElement("div");
        this.sourceMenu.classList.add("uai-classic-scrollable-container");
        this.sourceMenu.innerHTML = `<img src="${codeblock}" width="20" />&nbsp;${t('toolbar.source')}`;
    }

    /**
     * 定义创建方法
     * @param event 
     * @param options 
     */
    onCreate(event: EditorEvents["create"], options: UAIEditorOptions) {
        // 创建工具栏
        this.toolbar = document.createElement("div");
        this.toolbar.classList.add("uai-toolbar");
        this.appendChild(this.toolbar);

        this.container = document.createElement("div");
        this.container.classList.add("uai-toolbar-container");
        this.toolbar.appendChild(this.container);

        // 初始化专业工具栏
        this.ribbonMenu.onCreate(event, options);
        // 初始化经典工具栏
        this.classicMenu.onCreate(event, options);

        this.container.appendChild(this.ribbonMenu);
        this.container.appendChild(this.classicMenu);
        this.container.appendChild(this.sourceMenu);

        // 添加工具栏切换菜单
        this.actions = document.createElement("div");
        this.actions.classList.add("uai-toolbar-actions");
        this.container.appendChild(this.actions);

        const actionsButton = document.createElement("div");
        actionsButton.classList.add("uai-toolbar-actions-button");
        this.actions.appendChild(actionsButton);

        const actionsButtonIcon = document.createElement("img");
        actionsButtonIcon.src = expandDownIcon;
        actionsButtonIcon.width = 12;
        actionsButton.appendChild(actionsButtonIcon);

        const actionsButtonText = document.createElement("span");
        actionsButtonText.classList.add("uai-button-text");
        actionsButtonText.innerHTML = ` ${t('toolbar.toggle')}`;
        actionsButton.appendChild(actionsButtonText);

        // 工具栏切换菜单
        this.tippyInstance = tippy(actionsButton, {
            content: this.createContainer(event, options),
            placement: 'bottom',
            trigger: 'click',
            interactive: true,
            arrow: false,
            onShow: () => {
            },
            onHidden: () => {
            },
        });

        if (options.header === "ribbon") {
            this.switchRibbonMenu(event);
        } else {
            this.switchClassicMenu(event);
        }
    }

    /**
     * 定义Transaction监听方法
     * @param event 
     * @param options 
     */
    onTransaction(event: EditorEvents["transaction"], options: UAIEditorOptions) {
        this.ribbonMenu.onTransaction(event, options);
        this.classicMenu.onTransaction(event, options);
    }

    onEditableChange(editable: boolean) {
        this.ribbonMenu.onEditableChange(editable);
        this.classicMenu.onEditableChange(editable);
    }

    /**
     * 切换专业工具栏
     * @param event 
     */
    switchRibbonMenu(event: EditorEvents["create"]) {
        this.ribbonMenu.style.display = "flex";
        this.classicMenu.style.display = "none";
        this.sourceMenu.style.display = "none";
        this.menuMode = "ribbon";
        (event.editor as InnerEditor).uaiEditor.switchEditor();
    }

    /**
     * 切换经典工具栏
     * @param event 
     */
    switchClassicMenu(event: EditorEvents["create"]) {
        this.ribbonMenu.style.display = "none";
        this.classicMenu.style.display = "flex";
        this.sourceMenu.style.display = "none";
        this.menuMode = "classic";
        (event.editor as InnerEditor).uaiEditor.switchEditor();
    }

    /**
     * 切换源码编辑器
     * @param event 
     */
    switchSourceMenu(event: EditorEvents["create"]) {
        this.ribbonMenu.style.display = "none";
        this.classicMenu.style.display = "none";
        this.sourceMenu.style.display = "flex";
        this.menuMode = "source";
        (event.editor as InnerEditor).uaiEditor.switchSource();
    }

    /**
     * 创建工具栏切换菜单选项提示框
     * @param event 
     * @param options 
     * @returns 
     */
    createContainer(event: EditorEvents["create"], options: UAIEditorOptions) {
        const container = document.createElement("div");
        container.classList.add("uai-popup-action-list");

        // 专业工具栏菜单
        const ribbon = document.createElement("div");
        ribbon.classList.add("uai-popup-action-item");
        ribbon.innerHTML = `<img src="${toolbarRibbon}" width="16" />&nbsp;${t('toolbar.ribbon')}`;
        // 点击切换到专业工具栏
        ribbon.addEventListener('click', () => {
            this.switchRibbonMenu(event);
            this.tippyInstance.hide();
        });
        container.appendChild(ribbon);

        // 经典工具栏菜单
        const classic = document.createElement("div");
        classic.classList.add("uai-popup-action-item");
        classic.innerHTML = `<img src="${toolbarClassic}" width="16" />&nbsp;${t('toolbar.classic')}`;
        // 点击切换到经典工具栏
        classic.addEventListener('click', () => {
            this.switchClassicMenu(event);
            this.tippyInstance.hide();
        });
        container.appendChild(classic);

        // 源码编辑器菜单
        const source = document.createElement("div");
        source.classList.add("uai-popup-action-item");
        source.innerHTML = `<img src="${toolbarSource}" width="16" />&nbsp;${t('toolbar.source')}`;
        // 点击切换到源码编辑器
        source.addEventListener('click', () => {
            this.switchSourceMenu(event);
            this.tippyInstance.hide();
        });
        container.appendChild(source);

        return container;
    }

    connectedCallback() {
    }
}
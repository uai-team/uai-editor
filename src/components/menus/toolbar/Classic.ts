// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { EditorEvents } from "@tiptap/core";
import { UAIEditorEventListener, UAIEditorOptions } from "../../../core/UAIEditor.ts";

import menuIcon from "../../../assets/icons/menu.svg";

/**
 * 传统菜单栏
 */
export class Classic extends HTMLElement implements UAIEditorEventListener {
    defaultToolbarMenus!: Record<string, any>[];
    eventComponents: UAIEditorEventListener[] = [];

    // 传统菜单栏容器
    classicMenu!: HTMLElement;
    classicScrollableContainer!: HTMLElement;

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
    }
}
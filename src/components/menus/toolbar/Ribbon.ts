// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { EditorEvents } from "@tiptap/core";
import { UAIEditorEventListener, UAIEditorOptions } from "../../../core/UAIEditor.ts";

import { t } from "i18next";

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
    }
}
// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { MenuButton, MenuButtonOptions } from "../../MenuButton.ts";
import icon from "../../../../assets/icons/page-background.svg";
import { t } from "i18next";
import { UAIEditorEventListener, UAIEditorOptions } from "../../../../core/UAIEditor.ts";
import { EditorEvents } from "@tiptap/core";
import tippy, { Instance, Props } from "tippy.js";

/**
 * 页面菜单：设置背景色
 */
export class BackgroundColor extends HTMLElement implements UAIEditorEventListener {
    // 按钮选项
    menuButtonOptions: MenuButtonOptions = {
        menuType: "popup",
        enable: true,
        icon: icon,
        hideText: true,
        text: t('page.bg.text'),
        tooltip: t('page.bg.text'),
    }

    // 功能按钮
    menuButton: MenuButton;
    // 背景色选项提示框
    tippyInstance!: Instance<Props>;

    constructor(options: MenuButtonOptions) {
        super();

        // 初始化功能按钮选项
        this.menuButtonOptions = { ...this.menuButtonOptions, ...options };

        // 创建功能按钮
        this.menuButton = new MenuButton(this.menuButtonOptions);
    }

    /**
     * 定义创建方法
     * @param event 
     * @param options 
     */
    onCreate(event: EditorEvents["create"], options: UAIEditorOptions) {
        this.menuButton.onCreate(event, options);
        this.appendChild(this.menuButton);

        // 创建背景色设置提示框
        if (this.menuButtonOptions.enable && this.menuButton.menuButtonArrow) {
            this.tippyInstance = tippy(this.menuButton.menuButton, {
                content: this.createContainer(event, options),
                appendTo: 'parent',
                placement: 'bottom',
                trigger: 'click',
                interactive: true,
                arrow: false,
                onShow: () => {
                    this.menuButton.tippyInstance?.disable();
                },
                onHidden: () => {
                    this.menuButton.tippyInstance?.enable();
                },
            });
        }
    }

    /**
     * 定义Transaction监听方法
     * @param event 
     * @param options 
     */
    onTransaction(event: EditorEvents["transaction"], options: UAIEditorOptions) {
        this.menuButton.onTransaction(event, options);
    }

    onEditableChange(editable: boolean) {
        this.menuButtonOptions.enable = editable;
        this.menuButton.onEditableChange(editable);
    }

    /**
     * 创建背景色设置提示框内容
     * @param event 
     * @param options 
     * @returns 
     */
    createContainer(event: EditorEvents["create"], options: UAIEditorOptions) {
        // 创建容器
        const container = document.createElement("div");
        container.classList.add("uai-background-container");

        // 设置所有可选背景色
        const backgrounds = [
            { label: t('page.bg.default'), value: '#FFF' },
            { label: t('page.bg.color1'), value: 'rgb(233, 246, 227)' },
            { label: t('page.bg.color2'), value: 'rgb(252, 242, 224)' },
            { label: t('page.bg.color3'), value: 'rgb(237, 244, 255)' },
            { label: t('page.bg.color4'), value: 'rgb(153, 205, 250)' },
            { label: t('page.bg.color5'), value: 'rgb(145, 145, 145)' },
        ]

        // 添加所有可选背景色
        backgrounds.forEach(background => {
            const item = document.createElement("div");
            item.classList.add("uai-background-item");
            item.style.backgroundColor = background.value;
            item.innerHTML = background.label;
            // 添加点击事件，设置页面背景色
            item.addEventListener("click", () => {
                (document.querySelector(".uai-zoomable-content") as HTMLElement).style.backgroundColor = background.value;
            })
            container.appendChild(item);
        })

        return container;
    }
}


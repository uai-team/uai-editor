// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { EditorEvents } from "@tiptap/core";
import tippy, { Instance, Props } from "tippy.js";
import { t } from "i18next";

import { UAIEditorEventListener, UAIEditorOptions } from "../../../../core/UAIEditor.ts";
import { MenuButton, MenuButtonOptions } from "../../MenuButton.ts";

import icon0 from "../../../../assets/icons/bullet-list.svg";
import icon1 from "../../../../assets/icons/bullet-list-disc.svg";
import icon2 from "../../../../assets/icons/bullet-list-circle.svg";
import icon3 from "../../../../assets/icons/bullet-list-square.svg";

/**
 * 基础菜单：无序列表
 */
export class BulletList extends HTMLElement implements UAIEditorEventListener {
    // 按钮选项
    menuButtonOptions: MenuButtonOptions = {
        menuType: "popup",
        enable: true,
        icon: icon0,
        hideText: true,
        text: t('list.bullet.text'),
        tooltip: t('list.bullet.text'),
        shortcut: "Ctrl+Shift+8",
    }

    // 功能按钮
    menuButton: MenuButton;
    // 选项提示实例
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

        // 定义按钮点击事件，切换无序列表状态
        this.menuButton.menuButtonContent.addEventListener("click", () => {
            if (this.menuButtonOptions.enable) {
                const listType = 'disc';
                if (event.editor.isActive('bulletList')) {
                    // 设置无序列表
                    if (event.editor.getAttributes('bulletList').listType === listType) {
                        event.editor.chain().focus().toggleBulletList().run();
                    } else {
                        event.editor.chain().focus().updateAttributes('bulletList', { listType }).run();
                    }
                } else {
                    // 切换无序列表
                    event.editor.chain().focus().toggleBulletList().updateAttributes('bulletList', { listType }).run();
                }
            }
        })

        // 下拉选择
        if (this.menuButtonOptions.enable && this.menuButton.menuButtonArrow) {
            this.tippyInstance = tippy(this.menuButton.menuButtonArrow, {
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
     * 创建下拉选项容器
     * @param event 
     * @param options 
     * @returns 
     */
    createContainer(event: EditorEvents["create"], options: UAIEditorOptions) {
        const container = document.createElement("div");
        container.classList.add("uai-ordered-list");

        const group = document.createElement("div");
        group.classList.add("uai-ordered-list-group");

        // 定义下拉选项
        const listOptions = [
            { label: t('list.bullet.disc'), value: 'disc', icon: icon1 },
            { label: t('list.bullet.circle'), value: 'circle', icon: icon2 },
            { label: t('list.bullet.square'), value: 'square', icon: icon3 }
        ]

        // 添加下拉选项
        listOptions.forEach(option => {
            const item = document.createElement("div");
            item.classList.add("uai-ordered-list-item");
            item.innerHTML = `<img src="${option.icon}" />`

            tippy(item, {
                appendTo: item,
                content: option.label,
                theme: 'uai-tips',
                placement: "top",
                arrow: true,
                interactive: true,
            });

            // 下拉选项添加点击事件，设置对应的无序列表样式
            item.addEventListener("click", () => {
                const listType = option.value;
                if (event.editor.isActive('bulletList')) {
                    if (event.editor.getAttributes('bulletList').listType === listType) {
                        event.editor.chain().focus().toggleBulletList().run();
                    } else {
                        event.editor.chain().focus().updateAttributes('bulletList', { listType }).run();
                    }
                } else {
                    event.editor.chain().focus().toggleBulletList().updateAttributes('bulletList', { listType }).run();
                }
                this.tippyInstance.hide();
            })

            group.appendChild(item);
        })

        container.appendChild(group);
        return container;
    }
}


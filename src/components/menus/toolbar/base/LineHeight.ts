// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { MenuButton, MenuButtonOptions } from "../../MenuButton.ts";

import icon from "../../../../assets/icons/line-height.svg";

import { t } from "i18next";
import { UAIEditorEventListener, UAIEditorOptions } from "../../../../core/UAIEditor.ts";
import { EditorEvents } from "@tiptap/core";
import tippy, { Instance, Props } from "tippy.js";

/**
 * 基础菜单：行高
 */
export class LineHeight extends HTMLElement implements UAIEditorEventListener {
    // 按钮选项
    menuButtonOptions: MenuButtonOptions = {
        menuType: "popup",
        enable: true,
        icon: icon,
        hideText: true,
        text: t('base.lineHeight.text'),
        tooltip: t('base.lineHeight.text'),
    }

    // 功能按钮
    menuButton: MenuButton;
    // 提示实例
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

        // 定义按钮点击事件，设置当前内容的行高为默认行高
        this.menuButton.menuButtonContent.addEventListener("click", () => {
            if (this.menuButtonOptions.enable) {
                const height = options.dicts?.lineHeights?.[0];
                if (height) {
                    event.editor.chain().focus().setLineHeight(+height.value).run();
                }
            }
        })

        // 添加可选的行高信息
        if (this.menuButtonOptions.enable && this.menuButton.menuButtonArrow) {
            this.tippyInstance = tippy(this.menuButton.menuButtonArrow, {
                content: this.createContainer(event, options),
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
     * 创建所有行高选项
     * @param event 
     * @param options 
     * @returns 
     */
    createContainer(event: EditorEvents["create"], options: UAIEditorOptions) {
        const container = document.createElement("div");
        container.classList.add("uai-popup-action-list");

        // 设置所有可选行高
        options.dicts?.lineHeights?.forEach(height => {
            const item = document.createElement("div");
            item.classList.add("uai-popup-action-item");
            item.innerHTML = `${height.label}`;
            // 添加点击事件，设置内容行高
            item.addEventListener('click', () => {
                event.editor.chain().focus().setLineHeight(+height.value).run();
                this.tippyInstance.hide();
            });
            container.appendChild(item);
        })

        return container;
    }
}


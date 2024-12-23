// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { MenuButton, MenuButtonOptions } from "../../MenuButton.ts";

import icon0 from "../../../../assets/icons/ordered-list.svg";
import icon1 from "../../../../assets/icons/ordered-list-decimal.svg";
import icon2 from "../../../../assets/icons/ordered-list-decimal-leading-zero.svg";
import icon3 from "../../../../assets/icons/ordered-list-lower-roman.svg";
import icon4 from "../../../../assets/icons/ordered-list-upper-roman.svg";
import icon5 from "../../../../assets/icons/ordered-list-lower-latin.svg";
import icon6 from "../../../../assets/icons/ordered-list-upper-latin.svg";
import icon7 from "../../../../assets/icons/ordered-list-trad-chinese-informal.svg";
import icon8 from "../../../../assets/icons/ordered-list-simp-chinese-formal.svg";

import { t } from "i18next";
import { UAIEditorEventListener, UAIEditorOptions } from "../../../../core/UAIEditor.ts";
import { EditorEvents } from "@tiptap/core";
import tippy, { Instance, Props } from "tippy.js";

/**
 * 基础菜单：有序列表
 */
export class OrderedList extends HTMLElement implements UAIEditorEventListener {
    // 按钮选项
    menuButtonOptions: MenuButtonOptions = {
        menuType: "popup",
        enable: true,
        icon: icon0,
        hideText: true,
        text: t('list.ordered.text'),
        tooltip: t('list.ordered.text'),
        shortcut: "Ctrl+Shift+7",
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

        // 定义按钮点击事件，切换有序列表状态
        this.menuButton.menuButtonContent.addEventListener("click", () => {
            if (this.menuButtonOptions.enable) {
                const listType = 'decimal';
                if (event.editor.isActive('orderedList')) {
                    // 设置有序列表
                    if (event.editor.getAttributes('orderedList').type === listType) {
                        event.editor.chain().focus().toggleOrderedList().run();
                    } else {
                        event.editor.chain().focus().updateAttributes('orderedList', { "type": listType }).run();
                    }
                } else {
                    // 切换有序列表
                    event.editor.chain().focus().toggleOrderedList().updateAttributes('orderedList', { "type": listType }).run();
                }
            }
        })

        // 下拉选择
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
            })
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
            { label: t('list.ordered.decimal'), value: 'decimal', icon: icon1 },
            { label: t('list.ordered.decimalLeadingZero'), value: 'decimal-leading-zero', icon: icon2 },
            { label: t('list.ordered.lowerRoman'), value: 'lower-roman', icon: icon3 },
            { label: t('list.ordered.upperRoman'), value: 'upper-roman', icon: icon4 },
            { label: t('list.ordered.lowerLatin'), value: 'lower-latin', icon: icon5 },
            { label: t('list.ordered.upperLatin'), value: 'upper-latin', icon: icon6 },
            { label: t('list.ordered.tradChineseInformal'), value: 'trad-chinese-informal', icon: icon7 },
            { label: t('list.ordered.simpChineseFormal'), value: 'simp-chinese-formal', icon: icon8 },
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

            // 下拉选项添加点击事件，设置对应的有序列表样式
            item.addEventListener("click", () => {
                const listType = option.value;
                if (event.editor.isActive('orderedList')) {
                    if (event.editor.getAttributes('orderedList').type === listType) {
                        event.editor.chain().focus().toggleOrderedList().run();
                    } else {
                        event.editor.chain().focus().updateAttributes('orderedList', { "type": listType }).run();
                    }
                } else {
                    event.editor.chain().focus().toggleOrderedList().updateAttributes('orderedList', { "type": listType }).run();
                }
                this.tippyInstance.hide();
            })

            group.appendChild(item);
        })

        container.appendChild(group);
        return container
    }
}


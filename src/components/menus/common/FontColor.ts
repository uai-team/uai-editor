// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { MenuButton, MenuButtonOptions } from "../MenuButton.ts";
import icon from "../../../assets/icons/color.svg";
import { t } from "i18next";
import { InnerEditor, UAIEditorEventListener, UAIEditorOptions } from "../../../core/UAIEditor.ts";
import { EditorEvents } from "@tiptap/core";
import tippy, { Instance, Props } from "tippy.js";
import { ColorPicker } from "../../popups/ColorPicker.ts";

/**
 * 公共菜单：设置字体颜色
 */
export class FontColor extends HTMLElement implements UAIEditorEventListener {
    // 按钮选项
    menuButtonOptions: MenuButtonOptions = {
        menuType: "color",
        enable: true,
        icon: icon,
        hideText: true,
        text: t('base.color'),
        tooltip: t('base.color'),
    }

    // 当前选中的颜色
    currentColor?: string

    // 功能按钮
    menuButton: MenuButton;

    // 颜色选择器
    colorPicker: ColorPicker;
    // 颜色显示器
    colorElement!: HTMLElement;

    constructor(options: MenuButtonOptions) {
        super();

        // 初始化功能按钮选项
        this.menuButtonOptions = { ...this.menuButtonOptions, ...options };

        // 创建功能按钮
        this.menuButton = new MenuButton(this.menuButtonOptions);

        // 创建颜色选择器
        this.colorPicker = new ColorPicker();
    }

    /**
     * 定义创建方法
     * @param event 
     * @param options 
     */
    onCreate(event: EditorEvents["create"], options: UAIEditorOptions) {
        this.menuButton.onCreate(event, options);
        // 初始化颜色展示器
        this.colorElement = this.menuButton.menuButtonContent.querySelector("#currentColor") as HTMLElement;

        // 初始化颜色选择器
        this.colorPicker.onCreate(event, options);
        this.colorPicker.element = this.colorElement;

        this.appendChild(this.menuButton);

        // 定义按钮点击事件，设置字体颜色
        this.menuButton.menuButtonContent.addEventListener("click", () => {
            if (this.menuButtonOptions.enable) {
                const color = this.colorElement.style.backgroundColor;
                if (color === '') {
                    event.editor.chain().focus().unsetColor().run();
                } else {
                    event.editor.chain().focus().setColor(color).run();
                }
            }
        })

        if (this.menuButtonOptions.enable && this.menuButton.menuButtonArrow) {
            const instance = tippy(this.menuButton.menuButtonArrow, {
                content: this.colorPicker,
                placement: 'bottom',
                trigger: 'click',
                interactive: true,
                arrow: false,
            })
            // 创建一个观察器实例并传入回调函数
            const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        // 这里可以执行你需要的操作
                        instance.hide();
                        const color = this.colorElement.style.backgroundColor;
                        if (color === '') {
                            event.editor.chain().focus().unsetColor().run();
                        } else {
                            event.editor.chain().focus().setColor(color).run();
                        }
                    }
                }
            });

            // 配置观察器选项
            const config = { attributes: true, attributeFilter: ['style'] };

            // 开始观察目标节点
            observer.observe(this.colorElement, config);
        }
    }

    /**
     * 定义Transaction监听方法
     * @param event 
     * @param options 
     */
    onTransaction(event: EditorEvents["transaction"], options: UAIEditorOptions) {
        this.menuButton.onTransaction(event, options);
        this.colorPicker.onTransaction(event, options);
        try {
            // 获取当前文字的字体颜色
            const color = `${event.editor.getAttributes('textStyle').color}`;
            // 颜色展示器切换到当前字体颜色
            if (color) {
                this.colorElement.style.backgroundColor = color;
            } else {
                this.colorElement.style.backgroundColor = "#000";
            }
        } catch (error) {
        }
    }

    onEditableChange(editable: boolean) {
        this.menuButtonOptions.enable = editable;
        this.menuButton.onEditableChange(editable);
    }
}


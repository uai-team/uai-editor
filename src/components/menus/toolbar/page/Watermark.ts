// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { EditorEvents } from "@tiptap/core";

import tippy, { Instance, Props } from "tippy.js";
import { t } from "i18next";
import domtoimage from 'dom-to-image-more';

import { UAIEditorEventListener, UAIEditorOptions } from "../../../../core/UAIEditor.ts";
import { MenuButton, MenuButtonOptions } from "../../MenuButton.ts";

import icon from "../../../../assets/icons/watermark.svg";

/**
 * 页面菜单：设置水印
 */
export class Watermark extends HTMLElement implements UAIEditorEventListener {
    // 按钮选项
    menuButtonOptions: MenuButtonOptions = {
        menuType: "popup",
        enable: true,
        icon: icon,
        hideText: true,
        text: t('page.watermark.text'),
        tooltip: t('page.watermark.text'),
    }

    // 功能按钮
    menuButton: MenuButton;
    // 水印样式提示框
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

        // 创建水印设置提示框
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
     * 创建水印设置提示框内容
     * @param event 
     * @param options 
     * @returns 
     */
    createContainer(event: EditorEvents["create"], options: UAIEditorOptions) {
        // 找到页面容器
        const content = document.querySelector(".uai-zoomable-content") as HTMLElement;
        const container = document.createElement("div");
        container.classList.add("uai-watermark-container");
        const type = document.createElement("div");
        type.classList.add("uai-watermark-type");
        container.appendChild(type);

        // 指定水印样式
        const watermarkers = ['compact', 'spacious'];

        // 添加可选水印样式
        watermarkers.forEach(watermarker => {
            // 水印选项
            const item = document.createElement("div");
            item.classList.add("item");
            item.classList.add(watermarker);

            // 水印背景图例
            const bg = document.createElement("div");
            bg.classList.add("bg");
            item.appendChild(bg);

            // 水印说明文本
            const span = document.createElement("span");
            span.innerHTML = t(`page.watermark.${watermarker}`);
            item.appendChild(span);

            // 添加鼠标点击事件，文档添加水印
            item.addEventListener("click", async () => {
                const { toBlob } = domtoimage;
                const watermark = document.createElement('div');
                watermark.innerText = "有爱文档";
                watermark.style.color = 'rgba(100, 100, 100, 0.3)';
                watermark.style.fontSize = '20px';
                watermark.style.fontFamily = 'Arial';
                watermark.style.justifyContent = 'center';
                watermark.style.alignItems = 'center';
                watermark.style.transform = 'rotate(-30deg)';

                const blob = await toBlob(watermark, { scale: 1 });
                const url = URL.createObjectURL(blob);

                content.style.backgroundImage = `url('${url}')`
                content.style.backgroundRepeat = `repeat`
            })
            type.appendChild(item);
        })

        // 清除水印按钮
        const clearButton = document.createElement("div");
        clearButton.classList.add("uai-clear-button");
        clearButton.innerHTML = t('page.watermark.clear');
        // 清除水印按钮添加点击事件，点击清除水印
        clearButton.addEventListener("click", () => {
            content.style.backgroundImage = '';
        });

        // 创建一个观察器实例并传入回调函数
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    if (content.style.backgroundImage === '') {
                        container.removeChild(clearButton);
                    } else {
                        container.appendChild(clearButton);
                    }
                }
            }
        });

        // 配置观察器选项
        const config = { attributes: true, attributeFilter: ['style'] };

        // 开始观察目标节点
        observer.observe(content, config);

        return container;
    }
}


// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { EditorEvents } from "@tiptap/core";

import { UAIEditorEventListener, UAIEditorOptions } from "../../../core/UAIEditor.ts";

/**
 * 可滚动容器
 */
export class ScrollableDiv extends HTMLElement implements UAIEditorEventListener {
    private container: HTMLElement;
    scrollLeftBtn: HTMLElement;
    content: HTMLElement;
    scrollRightBtn: HTMLElement;
    private scrollAmount: number = 50; // 每次滚动的像素数
    private transform: number = 0; // 当前transform值

    constructor(content: HTMLElement) {
        super();
        this.content = content;
        this.classList.add("uai-scrollable-control");

        this.scrollLeftBtn = document.createElement("div");
        this.scrollLeftBtn.classList.add("uai-scrollable-control-button");
        this.scrollLeftBtn.classList.add("uai-scrollable-control-button-left");
        this.scrollLeftBtn.innerHTML = "<strong><</strong>";
        this.scrollLeftBtn.style.display = "none";
        this.container = document.createElement("div");
        this.container.classList.add("uai-scrollable-control-content");
        this.container.appendChild(this.content);
        this.scrollRightBtn = document.createElement("div");
        this.scrollRightBtn.classList.add("uai-scrollable-control-button");
        this.scrollRightBtn.classList.add("uai-scrollable-control-button-right");
        this.scrollRightBtn.innerHTML = "<strong>></strong>";
        this.scrollRightBtn.style.display = "none";

        this.scrollLeftBtn.addEventListener('click', () => {
            if (this.transform < 0) {
                this.transform += Math.min(this.scrollAmount, 0 - this.transform);
            }
            this.renderTranslate();
            this.scrollButtonControl();
        });
        this.scrollRightBtn.addEventListener('click', () => {
            const scrollWidth = this.content.scrollWidth + this.transform - this.container.clientWidth;
            if (scrollWidth > 0) {
                this.transform -= Math.min(this.scrollAmount, scrollWidth);
            }
            this.renderTranslate();
            this.scrollButtonControl();
        });

        this.appendChild(this.scrollLeftBtn)
        this.appendChild(this.container)
        this.appendChild(this.scrollRightBtn)
    }

    onCreate(event: EditorEvents["create"], options: UAIEditorOptions) {
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (entry.target === this.content) {
                    this.scrollButtonControl();
                }
            }
        });

        resizeObserver.observe(this.content!);
    }

    onTransaction(event: EditorEvents["transaction"], options: UAIEditorOptions) {
    }

    onEditableChange(editable: boolean) {

    }

    scrollButtonControl() {
        if (this.transform < 0 && this.container.clientWidth > this.content.scrollWidth + this.transform) {
            this.transform = this.container.clientWidth - this.content.scrollWidth;
            this.content.style.transform = `translateX(${this.transform}px)`;
        }
        const shouldShowLeftButton = this.transform < 0;
        const shouldShowRightButton = this.container.scrollWidth > this.content.clientWidth;
        this.scrollLeftBtn.style.display = shouldShowLeftButton ? "flex" : "none";
        this.scrollRightBtn.style.display = shouldShowRightButton ? "flex" : "none";
        if (!shouldShowLeftButton && !shouldShowRightButton) {
            this.transform = 0;
            this.renderTranslate();
        }
    }

    renderTranslate() {
        this.content.style.transform = `translateX(${this.transform}px)`;
        // 更新所有tippy实例位置
        this.querySelectorAll('[data-tippy-root]').forEach((tip: any) => {
            tip._tippy?.popperInstance?.update();
        });
    }
}

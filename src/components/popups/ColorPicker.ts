// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { EditorEvents } from "@tiptap/core";

import { t } from "i18next";

import { UAIEditorEventListener, UAIEditorOptions } from "../../core/UAIEditor.ts";

/**
 * 所有可选颜色
 */
const colors = [
    "#FFF", "#000", "#4A5366", "#3B74EC", "#45A2EF", "#529867", "#CD4A3F", "#EA8D40", "#EEC543", "#8E45D0",
    "#F2F2F2", "#7F7F7F", "#F4F5F7", "#CBDCFC", "#E8F6FE", "#EDFAF2", "#FCEAE9", "#FDF3EC", "#FEF9E5", "#FAECFE",
    "#EEE", "#595959", "#C6CAD2", "#CEEBFD", "#CBDCFC", "#CBE9D7", "#F7CBC9", "#FADDC7", "#FDEEB5", "#EBCAFC",
    "#BFBFBF", "#3F3F3F", "#828B9D", "#A0BEFA", "#A7DCFC", "#A6D5B8", "#F2A19C", "#F5BC8C", "#FBE281", "#CB94F9",
    "#A5A5A5", "#262626", "#363B44", "#2452B2", "#3473A1", "#417A53", "#922B22", "#AD642A", "#9E8329", "#57297D",
    "#939393", "#0D0D0D", "#25272E", "#15316A", "#1C415A", "#284D34", "#511712", "#573213", "#635217", "#36194E",
]
/**
 * 所有标准颜色
 */
const standardColors = ['#B12318', '#EB3323', '#F6C143', '#FFFE55', '#A0CD63', '#4FAD5B', '#4CAFEA', '#2D70BA', '#06215C', '#68389B']

/**
 * 当前使用过的颜色
 */
const recentColors: string[] = []

/**
 * 颜色选取器
 */
export class ColorPicker extends HTMLElement implements UAIEditorEventListener {
    container!: HTMLElement;
    element!: HTMLElement;
    recentColorTitle!: HTMLElement;
    recentColorGroup!: HTMLElement;

    constructor() {
        super();
    }

    /**
     * 颜色选择监听，设置当前选取的颜色、渲染颜色展示
     * @param color 
     */
    colorClickListener(color: string) {
        this.listRecentColors(color);
        this.element.style.backgroundColor = "#000";
        this.element.style.backgroundColor = color;
    }

    /**
     * 更新界面，添加当前已选择过的颜色，展示在弹出框
     * @param color 
     */
    listRecentColors(color: string) {
        const index = recentColors.indexOf(color);
        if (index > -1) {
            recentColors.splice(index, 1);
        }
        recentColors.unshift(color);
        if (recentColors.length > 10) {
            recentColors.pop();
        }
        this.recentColorGroup.innerHTML = "";
        if (recentColors.length > 0) {
            this.recentColorTitle.style.display = "block";
            this.recentColorGroup.style.display = "flex";
        } else {
            this.recentColorTitle.style.display = "none";
            this.recentColorGroup.style.display = "none";
        }
        recentColors.forEach(color => {
            const item = document.createElement("div");
            item.classList.add("uai-color-picker-item");
            item.style.backgroundColor = color;
            this.recentColorGroup.appendChild(item);
            item.addEventListener("click", () => {
                this.colorClickListener(color);
            })
        })
    }

    /**
     * 定义创建方法
     * @param event 
     * @param options 
     */
    onCreate(event: EditorEvents["create"], options: UAIEditorOptions) {
        const parent = document.createElement("div");
        parent.classList.add("uai-color-picker");

        // 颜色选取容器
        this.container = document.createElement("div");
        this.container.classList.add("uai-color-picker-container");

        // 默认颜色按钮
        const defaultButtonDiv = document.createElement("div");
        defaultButtonDiv.classList.add("uai-color-picker-default-button");

        const defaultButton = document.createElement("div");
        defaultButton.classList.add("uai-button");
        defaultButton.innerHTML = t('colorPicker.default');
        // 添加点击事件，设置默认颜色
        defaultButton.addEventListener("click", () => {
            this.colorClickListener("");
        });
        defaultButtonDiv.appendChild(defaultButton);

        this.container.appendChild(defaultButtonDiv);

        // 可选颜色分组
        const colorsGroup = document.createElement("div");
        colorsGroup.classList.add("uai-color-picker-group");

        // 设置所有可选颜色
        colors.forEach(color => {
            const item = document.createElement("div");
            item.classList.add("uai-color-picker-item");
            item.style.backgroundColor = color;
            item.addEventListener("click", () => {
                this.colorClickListener(color);
            })
            colorsGroup.appendChild(item);
        })
        this.container.appendChild(colorsGroup);

        // 标准颜色容器
        const standardColor = document.createElement("div");
        standardColor.classList.add("uai-color-picker-group-title");
        standardColor.innerHTML = t('colorPicker.standard');
        this.container.appendChild(standardColor);

        // 标准颜色分组
        const standardColorsGroup = document.createElement("div");
        standardColorsGroup.classList.add("uai-color-picker-group");

        // 设置所有标准颜色
        standardColors.forEach(color => {
            const item = document.createElement("div");
            item.classList.add("uai-color-picker-item");
            item.style.backgroundColor = color;
            standardColorsGroup.appendChild(item);
            item.addEventListener("click", () => {
                this.colorClickListener(color);
            })
        })
        this.container.appendChild(standardColorsGroup);

        // 当前已使用过的颜色展示
        this.recentColorTitle = document.createElement("div");
        this.recentColorTitle.classList.add("uai-color-picker-group-title");
        this.recentColorTitle.innerHTML = t('colorPicker.recent');
        this.recentColorTitle.style.display = "none";
        this.container.appendChild(this.recentColorTitle);

        // 当前颜色分组
        this.recentColorGroup = document.createElement("div");
        this.recentColorGroup.classList.add("uai-color-picker-group");
        this.recentColorGroup.style.display = "none";
        this.container.appendChild(this.recentColorGroup);

        // 分割线
        const divider = document.createElement("div");
        divider.classList.add("uai-color-picker-divider");
        this.container.appendChild(divider);

        parent.appendChild(this.container);
        this.appendChild(parent);
    }

    /**
     * 定义Transaction监听方法
     * @param event 
     * @param options 
     */
    onTransaction(event: EditorEvents["transaction"], options: UAIEditorOptions) {

    }

    onEditableChange(editable: boolean) {

    }
}

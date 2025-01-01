// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { MenuButton, MenuButtonOptions } from "../../MenuButton.ts";
import icon from "../../../../assets/icons/table.svg";
import { t } from "i18next";
import { UAIEditorEventListener, UAIEditorOptions } from "../../../../core/UAIEditor.ts";
import { EditorEvents } from "@tiptap/core";
import tippy, { Instance, Props } from "tippy.js";

/**
 * 表格菜单：插入表格
 */
export class InsertTable extends HTMLElement implements UAIEditorEventListener {
    // 按钮选项
    menuButtonOptions: MenuButtonOptions = {
        menuType: "popup",
        enable: true,
        icon: icon,
        hideText: true,
        text: t('table.insert.text'),
        tooltip: t('table.insert.tip'),
    }

    // 功能按钮
    menuButton: MenuButton;
    tippyInstance!: Instance<Props>;

    // 表格大小设置
    selected = { rows: 0, cols: 0 }

    // 表格行数
    gridRows = 10;
    // 表格列数
    gridCols = 10;

    // 手工输入行数
    rowsInput!: HTMLInputElement;
    // 手工输入列数
    colsInput!: HTMLInputElement;
    // 是否包含标题行
    withHeaderRow!: HTMLInputElement;

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

        // 创建表格设置提示框
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
     * 渲染选择的行、列
     */
    renderSelected() {
        this.rowsInput.value = `${this.selected.rows}`;
        this.colsInput.value = `${this.selected.cols}`;
        // 为所有选中的行、列设置样式
        for (var i = 0; i < this.gridRows; i++) {
            for (var j = 0; j < this.gridCols; j++) {
                const cell = document.querySelector(`#uai-table-rows-${i}-cells-${j}`)
                cell?.classList.remove("selected");
                if (this.isSelected(i, j)) {
                    cell?.classList.add("selected");
                }
            }
        }
    }

    /**
     * 判断指定的行、列是否选中
     * @param rows 
     * @param cols 
     * @returns 
     */
    isSelected(rows: number, cols: number) {
        return (
            this.selected.rows &&
            this.selected.rows > rows &&
            this.selected.cols &&
            this.selected.cols > cols
        )
    }

    /**
     * 插入表格
     * @param event 
     * @param options 
     * @returns 
     */
    insertTable(event: EditorEvents["create"], options: UAIEditorOptions) {
        const { rows, cols } = this.selected;
        if (rows === 0 || rows > 1000 || cols === 0 || cols > 30) {
            return
        }
        event.editor.chain().focus().insertTable({ rows, cols, withHeaderRow: this.withHeaderRow.checked }).scrollIntoView().run();
        this.tippyInstance.hide();
    }

    /**
     * 创建表格设置容器
     * @param event 
     * @param options 
     * @returns 
     */
    createContainer(event: EditorEvents["create"], options: UAIEditorOptions) {
        const container = document.createElement("div");
        container.classList.add("uai-table-container");
        const grid = document.createElement("div");
        grid.classList.add("uai-table-grid");

        // 设置指定的行、列
        for (var i = 0; i < this.gridRows; i++) {
            const row = document.createElement("div");
            row.classList.add("row");
            for (var j = 0; j < this.gridCols; j++) {
                // 绘制单元格块
                const cell = document.createElement("div");
                cell.id = `uai-table-rows-${i}-cells-${j}`;
                cell.setAttribute("rows", `${i}`);
                cell.setAttribute("cols", `${j}`);
                cell.classList.add("cell");
                // 设置鼠标事件，设置所选行、列数
                cell.addEventListener("mouseover", () => {
                    this.selected.rows = +cell.getAttribute("rows")! + 1;
                    this.selected.cols = +cell.getAttribute("cols")! + 1;
                })
                // 设置鼠标点击事件，插入表格
                cell.addEventListener("click", () => {
                    this.insertTable(event, options);
                });
                row.appendChild(cell);
            }
            grid.appendChild(row);
        }
        // 设置鼠标事件，渲染单元格块
        grid.addEventListener("mousemove", () => {
            this.renderSelected();
        });
        // 设置鼠标事件，渲染单元格块
        grid.addEventListener("mouseleave", () => {
            this.selected.rows = 0;
            this.selected.cols = 0;
            this.renderSelected();
        });
        container.appendChild(grid);

        // 创建自定义表格行列数设置区
        const custom = document.createElement("div");
        custom.classList.add("uai-table-custom");

        const title = document.createElement("div");
        title.classList.add("uai-table-custom-title");
        title.innerHTML = t('table.insert.property');
        custom.appendChild(title);

        // 表格行数输入区
        const rowsDiv = document.createElement("div");
        rowsDiv.classList.add("uai-table-custom-input");
        rowsDiv.innerHTML = t('table.insert.rows');
        this.rowsInput = document.createElement("input");
        this.rowsInput.type = "number";
        this.rowsInput.min = "0";
        this.rowsInput.max = "100";
        this.rowsInput.placeholder = "请输入";
        this.rowsInput.addEventListener("input", () => {
            this.selected.rows = +this.rowsInput.value;
            this.renderSelected();
        });
        rowsDiv.appendChild(this.rowsInput);
        custom.appendChild(rowsDiv);

        // 表格列数输入区
        const colsDiv = document.createElement("div");
        colsDiv.classList.add("uai-table-custom-input");
        colsDiv.innerHTML = t('table.insert.cols');
        this.colsInput = document.createElement("input");
        this.colsInput.type = "number";
        this.colsInput.min = "0";
        this.colsInput.max = "100";
        this.colsInput.placeholder = "请输入";
        this.colsInput.addEventListener("input", () => {
            this.selected.cols = +this.colsInput.value;
            this.renderSelected();
        });
        colsDiv.appendChild(this.colsInput);
        custom.appendChild(colsDiv);

        this.rowsInput.value = `${this.selected.rows}`;
        this.colsInput.value = `${this.selected.cols}`;

        // 设置插入的表格是否带有标题行
        const withHeaderDiv = document.createElement("div");
        withHeaderDiv.classList.add("uai-table-custom-header");
        this.withHeaderRow = document.createElement("input");
        this.withHeaderRow.type = "checkbox";
        this.withHeaderRow.id = "withHeaderRow";
        this.withHeaderRow.checked = true;
        const withHeaderRowLabel = document.createElement('label');
        withHeaderRowLabel.htmlFor = 'withHeaderRow';
        withHeaderRowLabel.textContent = t('table.insert.withHeader');
        withHeaderDiv.appendChild(this.withHeaderRow);
        withHeaderDiv.appendChild(withHeaderRowLabel);
        custom.appendChild(withHeaderDiv);

        // 插入表格按钮
        const insertButton = document.createElement("div");
        insertButton.classList.add("uai-table-insert-button");
        insertButton.innerHTML = t('table.insert.create');
        // 添加鼠标点击事件，插入表格
        insertButton.addEventListener("click", () => {
            this.insertTable(event, options);
        });
        custom.appendChild(insertButton);

        container.appendChild(custom);
        return container;
    }
}


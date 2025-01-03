// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { MenuButton, MenuButtonOptions } from "../../MenuButton.ts";
import icon from "../../../../assets/icons/file-pdf.svg";
import { t } from "i18next";
import { UAIEditorEventListener, UAIEditorOptions, InnerEditor } from "../../../../core/UAIEditor.ts";
import { EditorEvents } from "@tiptap/core";

/**
 * 导出菜单：导出PDF
 */
export class ExportPdf extends HTMLElement implements UAIEditorEventListener {
    // 按钮选项
    menuButtonOptions: MenuButtonOptions = {
        menuType: "button",
        enable: true,
        icon: icon,
        hideText: true,
        text: t('export.pdf.text'),
        tooltip: t('export.pdf.title'),
    }

    // 功能按钮
    menuButton: MenuButton;

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

        // 定义按钮点击事件，导出文件
        this.addEventListener("click", () => {
            if (this.menuButtonOptions.enable) {
                event.editor.commands.blur();
                const iframe = document.createElement("iframe");
                iframe.classList.add("uai-print-iframe");
                document.body.appendChild(iframe);

                const printContent = `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <title>有爱文档（UAI-Editor）</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${Array.from(document.querySelectorAll('link, style')).map((item) => item.outerHTML).join('')}
      <style>
      body{
        overflow: auto;
        height: auto;
        background-color: #fff;
        -webkit-print-color-adjust: exact;
      }
      </style>
    </head>
    <body class="is-print">
      <div id="sprite-plyr" style="display: none;">
       ${document.querySelector('#sprite-plyr')?.innerHTML ?? ''}
      </div>
      <div class="uai-page-container">
          ${document.querySelector(`.uai-zoomable-container`)?.outerHTML ?? ''}
      </div>
      <script>
        document.addEventListener("DOMContentLoaded", (event) => {
          const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
              if (mutation.removedNodes) {
                Array.from(mutation.removedNodes).forEach(node => {
                  if (node?.classList?.contains('uai-page-watermark')) {
                    location.reload();
                  }
                });
              }
            });
          });
        });
      <\/script>
    </body>
    </html>`;
                // 内容渲染
                iframe.contentDocument?.open();
                iframe.contentDocument?.write(printContent);
                // 打印成PDF
                iframe.contentWindow?.print();
                document.body.removeChild(iframe);
            }
        })
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
}


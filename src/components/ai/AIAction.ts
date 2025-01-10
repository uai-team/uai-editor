// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { Editor, EditorEvents } from "@tiptap/core";
import { Slice } from "@tiptap/pm/model";

import tippy, { Instance, Props } from "tippy.js";
import { t } from "i18next";

import { InnerEditor, UAIEditorEventListener, UAIEditorOptions } from "../../core/UAIEditor";
import { markdownToHtml } from "../../utils/MarkdownUtil";
import { MenuButton, MenuButtonOptions } from "../menus/MenuButton";
import { AICommand } from "../../ai/config/AIConfig";
import { Icons } from "../Icons";

import iconTask from "../../assets/icons/task-list.svg";

/**
 * 抽象AI Action类
 */
export abstract class AbstractAIAction extends HTMLElement implements UAIEditorEventListener {
    editor!: Editor;
    aiActions: AICommand[] = [];
    // 按钮的选项设置信息
    menuButtonOptions: MenuButtonOptions = {
        menuType: "popup",
        enable: true,
        icon: iconTask,
        hideText: true,
    }

    // 按钮
    menuButton!: MenuButton;
    // 提示
    tippyInstance!: Instance<Props>;

    /**
     * 定义初始化方法，创建一个按钮
     */
    constructor() {
        super();
        this.menuButton = new MenuButton(this.menuButtonOptions);
    }

    /**
     * 定义创建方法
     * @param event 
     * @param options 
     */
    onCreate(event: EditorEvents["create"], options: UAIEditorOptions) {
        // 初始化变量信息
        this.editor = event.editor;
        this.menuButton.onCreate(event, options);
        // 界面上添加当前按钮
        this.appendChild(this.menuButton);

        // 定义按钮的提示信息
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

    onTransaction(event: EditorEvents["transaction"], options: UAIEditorOptions) {
    }

    onEditableChange(editable: boolean) {
    }

    /**
     * 定义容器的创建方法
     * @param event 
     * @param options 
     * @returns 
     */
    createContainer(event: EditorEvents["create"], options: UAIEditorOptions) {
        // 容器DIV
        const container = document.createElement("div");
        container.classList.add("uai-popup-action-list")

        // 在DIV中添加所有自定义的Action
        this.aiActions?.forEach(action => {
            const item = document.createElement("div");
            item.classList.add("uai-popup-action-item")
            item.innerHTML = `${action.icon ?? ""}&nbsp;${action.name}`;
            // 定义点击事件
            item.addEventListener('click', () => {
                // 调用Action定义个点击事件
                action.action?.call(this);
                this.tippyInstance.hide();
            });
            container.appendChild(item);
        })

        return container
    }
}

/**
 * 定义对话界面中用户请求内容的功能菜单
 */
export class AIRequestAction extends AbstractAIAction {
    sourceDivElement!: HTMLElement
    sourceInputElement!: HTMLElement

    // 默认的用户请求功能菜单项
    defaultAIActions: AICommand[] = [
        {
            // 编辑用户发送的请求内容
            icon: Icons.EditAction,
            name: `编辑`,
            action: () => {
                (this.sourceInputElement as HTMLTextAreaElement).value = this.sourceDivElement.innerText
                this.sourceInputElement.style.height = 'auto'
                this.sourceInputElement.style.height = this.sourceInputElement.scrollHeight + 'px'
            }
        },
        {
            // 追加内容到编辑器的当前光标位置
            icon: Icons.InsertAction,
            name: `追加`,
            action: () => {
                const {
                    state: { selection, tr },
                    view: { dispatch }
                } = this.editor;
                const content = (this.editor as InnerEditor).parseHtml(markdownToHtml(this.sourceDivElement.getAttribute("InnerContent")!));
                dispatch(tr.replace(selection.to, selection.to, new Slice(content, 0, 0)).scrollIntoView())
            }
        },
        {
            // 替换编辑器中选中的内容
            icon: Icons.ReplaceAction,
            name: `替换`,
            action: () => {
                const {
                    state: { tr },
                    view: { dispatch }
                } = this.editor
                const content = (this.editor as InnerEditor).parseHtml(markdownToHtml(this.sourceDivElement.getAttribute("InnerContent")!));
                dispatch(tr.replaceSelection(new Slice(content, 0, 0)).scrollIntoView())
            }
        }
    ]

    constructor() {
        super()
        this.aiActions = this.defaultAIActions.map((menu) => {
            return {
                ...menu,
                name: `${t(menu.name)}`
            }
        })
    }

    bindSourceElement(sourceDivElement: HTMLElement, sourceInputElement: HTMLElement) {
        this.sourceDivElement = sourceDivElement
        this.sourceInputElement = sourceInputElement
    }
}

/**
 * 定义对话界面中响应数据的功能菜单
 */
export class AIChatResponseAction extends AbstractAIAction {
    sourceDivElement!: HTMLElement
    sourceInputElement!: HTMLElement

    // 默认的菜单项
    defaultAIActions: AICommand[] = [
        {
            // 追加内容到编辑器的当前光标位置
            icon: Icons.InsertAction,
            name: `追加`,
            action: () => {
                const {
                    state: { selection, tr },
                    view: { dispatch }
                } = this.editor;
                const content = (this.editor as InnerEditor).parseHtml(markdownToHtml(this.sourceDivElement.getAttribute("InnerContent")!));
                dispatch(tr.replace(selection.to, selection.to, new Slice(content, 0, 0)).scrollIntoView())
            }
        },
        {
            // 替换编辑器中选中的内容
            icon: Icons.ReplaceAction,
            name: `替换`,
            action: () => {
                const {
                    state: { tr },
                    view: { dispatch }
                } = this.editor
                const content = (this.editor as InnerEditor).parseHtml(markdownToHtml(this.sourceDivElement.getAttribute("InnerContent")!));
                dispatch(tr.replaceSelection(new Slice(content, 0, 0)).scrollIntoView())
            }
        }
    ]

    constructor() {
        super()
        this.aiActions = this.defaultAIActions.map((menu) => {
            return {
                ...menu,
                name: `${t(menu.name)}`
            }
        })
    }

    bindSourceElement(sourceDivElement: HTMLElement, sourceInputElement: HTMLElement) {
        this.sourceDivElement = sourceDivElement
        this.sourceInputElement = sourceInputElement
    }
}

/**
 * 定义画图界面中响应数据的功能菜单
 */
export class AIImageResponseAction extends AbstractAIAction {
    sourceDivElement!: HTMLElement
    sourceInputElement!: HTMLElement

    // 默认的菜单项
    defaultAIActions: AICommand[] = [
        {
            // 追加图片内容到编辑器的当前光标位置
            icon: Icons.InsertAction,
            name: `追加`,
            action: () => {
                const {
                    state: { selection, tr },
                    view: { dispatch }
                } = this.editor
                const content = (this.editor as InnerEditor).parseHtml(markdownToHtml(this.sourceDivElement.innerHTML));
                dispatch(tr.replace(selection.to, selection.to, new Slice(content, 0, 0)).scrollIntoView())
            }
        },
        {
            // 替换编辑器中选中的内容
            icon: Icons.ReplaceAction,
            name: `替换`,
            action: () => {
                const {
                    state: { tr },
                    view: { dispatch }
                } = this.editor!
                const content = (this.editor as InnerEditor).parseHtml(markdownToHtml(this.sourceDivElement.innerHTML));
                dispatch(tr.replaceSelection(new Slice(content, 0, 0)).scrollIntoView())
            }
        }
    ]

    constructor() {
        super()
        this.aiActions = this.defaultAIActions.map((menu) => {
            return {
                ...menu,
                name: `${t(menu.name)}`
            }
        })
    }

    bindSourceElement(sourceDivElement: HTMLElement, sourceInputElement: HTMLElement) {
        this.sourceDivElement = sourceDivElement
        this.sourceInputElement = sourceInputElement
    }
}

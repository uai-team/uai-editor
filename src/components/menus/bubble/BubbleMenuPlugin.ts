// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import {
    Editor, isNodeSelection, posToDOMRect,
} from '@tiptap/core'
import { EditorState, Plugin, PluginKey } from '@tiptap/pm/state'
import { EditorView } from '@tiptap/pm/view'

import tippy, { Instance, Props } from 'tippy.js'

export type BubbleMenuPluginOptions = {
    /**
     * 插件Key值
     * @type {PluginKey | string}
     * @default 'bubbleMenu'
     */
    pluginKey: PluginKey | string

    /**
     * 编辑器实例
     */
    editor?: Editor;

    /**
     * 显示浮动菜单的元素
     * @type {HTMLElement}
     * @default null
     */
    element: HTMLElement;

    view?: EditorView;

    /**
     * 浮动菜单选项实例
     */
    tippyOptions?: Partial<Props>;

    /**
     * 用来判断当前浮动菜单是否显示
     */
    shouldShow?: ((props: {
        editor: Editor
        view: EditorView
        state: EditorState
        oldState?: EditorState
        from: number
        to: number
    }) => boolean);
}

export class BubbleMenuView {
    public editor: Editor;

    public element: HTMLElement;

    public view: EditorView;

    public tippy: Instance | undefined;

    public tippyOptions?: Partial<Props>;

    public shouldShow?: (props: {
        editor: Editor
        view: EditorView
        state: EditorState
        oldState?: EditorState
        from: number
        to: number
    }) => boolean;

    constructor({
        editor,
        element,
        view,
        tippyOptions = {},
        shouldShow,
    }: BubbleMenuPluginOptions) {
        this.editor = editor!;
        this.element = element;
        this.view = view!;
        this.tippyOptions = tippyOptions;
        this.shouldShow = shouldShow;

        this.element.remove();
        this.element.style.visibility = 'visible';
    }

    createTooltip() {
        const { element: editorElement } = this.editor.options;
        const editorIsAttached = !!editorElement.parentElement;

        if (this.tippy || !editorIsAttached) {
            return;
        }

        this.tippy = tippy(editorElement, {
            duration: 0,
            getReferenceClientRect: null,
            content: this.element,
            interactive: true,
            trigger: 'manual',
            ...this.tippyOptions,
        });
    }

    update(view: EditorView, oldState?: EditorState) {
        const selectionChanged = !oldState?.selection.eq(view.state.selection);
        const docChanged = !oldState?.doc.eq(view.state.doc);

        const { state, composing } = view;
        const { selection } = state;

        const isSame = !selectionChanged && !docChanged;

        if (composing || isSame) {
            return;
        }

        this.createTooltip();

        const { ranges } = selection;
        const from = Math.min(...ranges.map(range => range.$from.pos));
        const to = Math.max(...ranges.map(range => range.$to.pos));

        const shouldShow = this.shouldShow?.({
            editor: this.editor,
            view,
            state,
            oldState,
            from,
            to,
        });

        if (!shouldShow) {
            this.tippy?.hide();
            return;
        }

        this.tippy?.setProps({
            getReferenceClientRect:
                this.tippyOptions?.getReferenceClientRect
                || (() => {
                    if (isNodeSelection(state.selection)) {
                        let node = view.nodeDOM(from) as HTMLElement;

                        const nodeViewWrapper = node.dataset.nodeViewWrapper ? node : node.querySelector('[data-node-view-wrapper]');

                        if (nodeViewWrapper) {
                            node = nodeViewWrapper.firstChild as HTMLElement;
                        }

                        if (node) {
                            return node.getBoundingClientRect();
                        }
                    }

                    return posToDOMRect(view, from, to);
                }),
        })

        this.tippy?.show();
    }
}

export const BubbleMenuPlugin = (options: BubbleMenuPluginOptions) => {
    return new Plugin({
        key:
            typeof options.pluginKey === 'string' ? new PluginKey(options.pluginKey) : options.pluginKey,
        view: view => new BubbleMenuView({ view, ...options }),
    });
}

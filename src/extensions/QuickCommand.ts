// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { Extension } from '@tiptap/core';

import Suggestion, { SuggestionOptions, SuggestionProps } from '@tiptap/suggestion';
import tippy, { Instance } from 'tippy.js';
import { InnerEditor } from '../core/UAIEditor.ts';
import { AICommand } from '../ai/config/AIConfig.ts';
import OpenAI from "openai";
import { markdownToHtml } from '../utils/MarkdownUtil.ts';
import { uuid } from '../utils/UUID.ts';

export type QuickCommandOptions = {
    HTMLAttributes?: Record<string, any>;
    suggestion: Omit<SuggestionOptions, 'editor'>;
}

/**
 * 定义快捷命令
 */
export default Extension.create<QuickCommandOptions>({
    name: 'quickCommand',
    addOptions() {
        return {
            suggestion: {
                char: '/',
                command: ({ editor, range, props }) => {
                    editor.chain().focus().deleteRange(range).run();
                    const from = editor.state.selection.to;
                    const type = props.type;
                    const command = props.command as AICommand;
                    const options = (editor as InnerEditor).uaiEditor.options;
                    const actionKey = "uai_waiting_action";

                    const selectedText = editor.state.selection.$head.parent.textContent;
                    if (type === "chat") {
                        // 模型对话命令
                        var models = Object.keys(options.ai?.chat?.models ?? {});
                        if (models.length > 0) {
                            var model = command.model ?? "auto";
                            if (model === "auto") {
                                model = models[0];
                            }
                            const modelConfig = options.ai!.chat!.models![model];
                            const client = new OpenAI({
                                baseURL: modelConfig.baseUrl,
                                apiKey: modelConfig.apiKey,
                                dangerouslyAllowBrowser: true,
                            });

                            client.chat.completions.create({
                                model: modelConfig.model ?? "o1",
                                stream: true,
                                max_tokens: modelConfig.max_tokens,
                                temperature: modelConfig.temperature,
                                top_p: modelConfig.top_p,
                                frequency_penalty: modelConfig.frequency_penalty,
                                messages: [
                                    { "role": "system", "content": command.prompt ?? "你是一个很有帮助的人工智能助手。" },
                                    { "role": "user", "content": selectedText }
                                ],
                            }).then(async response => {
                                for await (var chunk of response) {
                                    var content = chunk.choices[0]?.delta?.content || '';
                                    editor.view.dispatch(editor.state.tr.insertText(content));
                                }
                                const end = editor.state.selection.to;
                                const insertedText = editor.state.doc.textBetween(from, end);
                                editor.view.dispatch(editor.state.tr.replaceWith(from, end, (editor as InnerEditor).parseHtml(markdownToHtml(insertedText))).scrollIntoView());
                            });
                        }
                    } else if (type === "text2image") {
                        // 文生图命令
                        var models = Object.keys(options.ai?.image?.models?.text2image ?? {});
                        const id = uuid()
                        if (models.length > 0) {
                            var model = command.model ?? "auto";
                            if (model === "auto") {
                                model = models[0];
                            }
                            const modelConfig = options.ai!.image!.models!.text2image![model];
                            const client = new OpenAI({
                                baseURL: modelConfig.baseUrl,
                                apiKey: modelConfig.apiKey,
                                dangerouslyAllowBrowser: true,
                            });
                            editor.view.dispatch(editor.state.tr.setMeta(actionKey, {
                                type: "add",
                                id,
                                pos: editor.state.tr.selection.from,
                            }));
                            client.images.generate({
                                "model": modelConfig.model ?? "dall-e-3",
                                "prompt": `${command.prompt ?? ""}${selectedText}`,
                                "size": "1024x1024",
                            }).then(response => {
                                editor.view.dispatch(editor.state.tr.setMeta(actionKey, { type: "remove", id }));
                                const previewType = "image";
                                const type = "image";

                                editor.commands.insertContentAt(editor.state.tr.selection.from, {
                                    type: type,
                                    attrs: {
                                        ['src']: response.data[0].url,
                                        type,
                                        previewType,
                                    },
                                });
                            });
                        }
                    }
                },
                render: () => {
                    let container: HTMLElement;
                    let popup: Instance;

                    return {
                        onStart: (props: SuggestionProps) => {
                            container = document.createElement("div");
                            container.classList.add("uai-popup-action-list");
                            (props.editor as InnerEditor).uaiEditor.options.ai?.chat?.commands?.forEach(command => {
                                const item = document.createElement("div");
                                item.classList.add("uai-popup-action-item");
                                item.innerHTML = `${command.icon}&nbsp;&nbsp;${command.name}`;
                                item.addEventListener('click', () => {
                                    props.command({
                                        type: "chat",
                                        command: command
                                    })
                                });
                                container.appendChild(item);
                            })

                            container.appendChild(document.createElement("hr"));

                            (props.editor as InnerEditor).uaiEditor.options.ai?.image?.commands?.forEach(command => {
                                const item = document.createElement("div");
                                item.classList.add("uai-popup-action-item");
                                item.innerHTML = `${command.icon}&nbsp;&nbsp;${command.name}`;
                                item.addEventListener('click', () => {
                                    props.command({
                                        type: "text2image",
                                        command: command
                                    })
                                });
                                container.appendChild(item);
                            })

                            // @ts-ignore
                            popup = tippy('body', {
                                appendTo: props.editor.options.element,
                                getReferenceClientRect: props.clientRect,
                                content: container,
                                showOnCreate: true,
                                interactive: true,
                                allowHTML: true,
                                trigger: 'manual',
                                placement: 'right',
                                arrow: false,
                            })[0]
                        },
                        onUpdate(props) {
                            if (!props.clientRect) {
                                return;
                            }
                            popup.setProps({
                                getReferenceClientRect: props.clientRect as any,
                            })
                        },
                        onKeyDown(props) {
                            if (props.event.key === 'Escape') {
                                popup.hide();
                                return true;
                            }
                            return false;
                        },
                        onExit() {
                            popup.hide();
                            container.remove();
                        },
                    }
                },
            }
        }
    },
    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion,
            }),
        ]
    },
})
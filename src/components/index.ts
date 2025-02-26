// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { defineCustomElement } from "../utils/DefineCustomElement.ts";

import { Header } from "../components/Header.ts";
import { Editor } from "../components/Editor.ts";
import { Footer } from "../components/Footer.ts";

import { ChatContainer } from "../components/containers/ChatContainer.ts";
import { ImageContainer } from "../components/containers/ImageContainer.ts";
import { TocContainer } from "../components/containers/TocContainer.ts";

import { Ribbon } from "./menus/toolbar/Ribbon.ts";
import { Classic } from "./menus/toolbar/Classic.ts";

import { ScrollableDiv } from "./menus/toolbar/ScrollableDiv.ts";
import { MenuButton } from "./menus/MenuButton.ts";
import { ColorPicker } from "./popups/ColorPicker.ts";

import { AlignLeft } from "./menus/common/AlignLeft.ts";
import { AlignCenter } from "./menus/common/AlignCenter.ts";
import { AlignRight } from "./menus/common/AlignRight.ts";
import { AlignJustify } from "./menus/common/AlignJustify.ts";
import { AlignDistributed } from "./menus/common/AlignDistributed.ts";

import { FontSizeIncrease } from "./menus/common/FontSizeIncrease.ts";
import { FontSizeDecrease } from "./menus/common/FontSizeDecrease.ts";

import { Bold } from "./menus/common/Bold.ts";
import { Italic } from "./menus/common/Italic.ts";
import { Underline } from "./menus/common/Underline.ts";
import { Strike } from "./menus/common/Strike.ts";
import { Subscript } from "./menus/common/Subscript.ts";
import { Superscript } from "./menus/common/Superscript.ts";

import { FontColor } from "./menus/common/FontColor.ts";
import { Highlight } from "./menus/common/Highlight.ts";

import { NodeDelete } from "./menus/common/NodeDelete.ts";

import { Undo } from "./menus/toolbar/base/Undo.ts";
import { Redo } from "./menus/toolbar/base/Redo.ts";
import { FormatPainter } from "./menus/toolbar/base/FormatPainter.ts";
import { ClearFormat } from "./menus/toolbar/base/ClearFormat.ts";

import { FontFamily } from "./menus/toolbar/base/FontFamily.ts";
import { FontSize } from "./menus/toolbar/base/FontSize.ts";

import { OrderedList } from "./menus/toolbar/base/OrderedList.ts";
import { BulletList } from "./menus/toolbar/base/BulletList.ts";
import { TaskList } from "./menus/toolbar/base/TaskList.ts";
import { Indent } from "./menus/toolbar/base/Indent.ts";
import { Outdent } from "./menus/toolbar/base/Outdent.ts";
import { LineHeight } from "./menus/toolbar/base/LineHeight.ts";

import { BlockQuote } from "./menus/toolbar/base/BlockQuote.ts";
import { CodeBlock } from "./menus/toolbar/base/CodeBlock.ts";

import { Print } from "./menus/toolbar/base/Print.ts";

import { Link } from "./menus/toolbar/insert/Link.ts";
import { Image } from "./menus/toolbar/insert/Image.ts";
import { Video } from "./menus/toolbar/insert/Video.ts";
import { Audio } from "./menus/toolbar/insert/Audio.ts";
import { File } from "./menus/toolbar/insert/File.ts";
import { HardBreak } from "./menus/toolbar/insert/HardBreak.ts";
import { Emoji } from "./menus/toolbar/insert/Emoji.ts";
import { Symbol } from "./menus/toolbar/insert/Symbol.ts";
import { Math } from "./menus/toolbar/insert/Math.ts";
import { Toc } from "./menus/toolbar/insert/Toc.ts";

import { InsertTable } from "./menus/toolbar/table/InsertTable.ts";
import { AddColumnAfter } from "./menus/toolbar/table/AddColumnAfter.ts";
import { AddColumnBefore } from "./menus/toolbar/table/AddColumnBefore.ts";
import { AddRowAfter } from "./menus/toolbar/table/AddRowAfter.ts";
import { AddRowBefore } from "./menus/toolbar/table/AddRowBefore.ts";
import { DeleteColumn } from "./menus/toolbar/table/DeleteColumn.ts";
import { DeleteRow } from "./menus/toolbar/table/DeleteRow.ts";
import { DeleteTable } from "./menus/toolbar/table/DeleteTable.ts";

import { Diagrams } from "./menus/toolbar/tools/Diagrams.ts";

import { ToggleToc } from "./menus/toolbar/page/ToggleToc.ts";
import { BackgroundColor } from "./menus/toolbar/page/BackgroundColor.ts";
import { Watermark } from "./menus/toolbar/page/Watermark.ts";

import { ExportDocx } from "./menus/toolbar/export/ExportDocx.ts";
import { ExportOdt } from "./menus/toolbar/export/ExportOdt.ts";
import { ExportPdf } from "./menus/toolbar/export/ExportPdf.ts";
import { ExportMarkdown } from "./menus/toolbar/export/ExportMarkdown.ts";
import { ExportImage } from "./menus/toolbar/export/ExportImage.ts";

import { ToggleChat } from "./menus/toolbar/ai/ToggleChat.ts";
import { ToggleImage } from "./menus/toolbar/ai/ToggleImage.ts";

import { TextSelectionBubbleMenu } from "./menus/bubble/TextSelectionBubbleMenu.ts";

import { ImageBubbleMenu } from "./menus/bubble/ImageBubbleMenu.ts";
import { ImageFlipX } from "./menus/bubble/image/ImageFlipX.ts";
import { ImageFlipY } from "./menus/bubble/image/ImageFlipY.ts";

import { VideoBubbleMenu } from "./menus/bubble/VideoBubbleMenu.ts";

import { AudioBubbleMenu } from "./menus/bubble/AudioBubbleMenu.ts";

import { FileBubbleMenu } from "./menus/bubble/FileBubbleMenu.ts";

import { CharacterCount } from "./menus/statusbar/CharacterCount.ts";

import { Fullscreen } from "./menus/statusbar/Fullscreen.ts";
import { Feedback } from "./menus/statusbar/Feedback.ts";
import { PoweredBy } from "./menus/statusbar/PoweredBy.ts";

import { AIRequestAction, AIChatResponseAction, AIImageResponseAction } from "./ai/AIAction.ts";

// 注册组件
defineCustomElement('uai-editor-header', Header);
defineCustomElement('uai-editor-editor', Editor);
defineCustomElement('uai-editor-footer', Footer);

defineCustomElement('uai-editor-chat-container', ChatContainer);
defineCustomElement('uai-editor-image-container', ImageContainer);
defineCustomElement('uai-editor-toc-container', TocContainer);

defineCustomElement('uai-editor-ribbon-menu', Ribbon);
defineCustomElement('uai-editor-classic-menu', Classic);

defineCustomElement('uai-editor-scrollable-div', ScrollableDiv);
defineCustomElement('uai-editor-menu-button', MenuButton);
defineCustomElement('uai-editor-popup-color-picker', ColorPicker);

defineCustomElement('uai-editor-common-menu-align-left', AlignLeft);
defineCustomElement('uai-editor-common-menu-align-center', AlignCenter);
defineCustomElement('uai-editor-common-menu-align-right', AlignRight);
defineCustomElement('uai-editor-common-menu-align-justify', AlignJustify);
defineCustomElement('uai-editor-common-menu-align-distributed', AlignDistributed);

defineCustomElement('uai-editor-common-menu-font-size-increase', FontSizeIncrease);
defineCustomElement('uai-editor-common-menu-font-size-decrease', FontSizeDecrease);

defineCustomElement('uai-editor-common-menu-bold', Bold);
defineCustomElement('uai-editor-common-menu-italic', Italic);
defineCustomElement('uai-editor-common-menu-underline', Underline);
defineCustomElement('uai-editor-common-menu-strike', Strike);
defineCustomElement('uai-editor-common-menu-subscript', Subscript);
defineCustomElement('uai-editor-common-menu-superscript', Superscript);

defineCustomElement('uai-editor-common-menu-font-color', FontColor);
defineCustomElement('uai-editor-common-menu-highlight', Highlight);

defineCustomElement('uai-editor-common-menu-node-delete', NodeDelete);

defineCustomElement('uai-editor-base-menu-undo', Undo);
defineCustomElement('uai-editor-base-menu-redo', Redo);
defineCustomElement('uai-editor-base-menu-format-painter', FormatPainter);
defineCustomElement('uai-editor-base-menu-clear-format', ClearFormat);

defineCustomElement('uai-editor-base-menu-font-family', FontFamily);
defineCustomElement('uai-editor-base-menu-font-size', FontSize);

defineCustomElement('uai-editor-base-menu-ordered-list', OrderedList);
defineCustomElement('uai-editor-base-menu-bullet-list', BulletList);
defineCustomElement('uai-editor-base-menu-task-list', TaskList);
defineCustomElement('uai-editor-base-menu-indent', Indent);
defineCustomElement('uai-editor-base-menu-outdent', Outdent);
defineCustomElement('uai-editor-base-menu-lineheight', LineHeight);

defineCustomElement('uai-editor-base-menu-blockquote', BlockQuote);
defineCustomElement('uai-editor-base-menu-codeblock', CodeBlock);

defineCustomElement('uai-editor-base-menu-print', Print);

defineCustomElement('uai-editor-insert-menu-link', Link);
defineCustomElement('uai-editor-insert-menu-image', Image);
defineCustomElement('uai-editor-insert-menu-video', Video);
defineCustomElement('uai-editor-insert-menu-audio', Audio);
defineCustomElement('uai-editor-insert-menu-file', File);
defineCustomElement('uai-editor-insert-menu-hard-break', HardBreak);
defineCustomElement('uai-editor-insert-menu-emoji', Emoji);
defineCustomElement('uai-editor-insert-menu-symbol', Symbol);
defineCustomElement('uai-editor-insert-menu-math', Math);
defineCustomElement('uai-editor-insert-menu-toc', Toc);

defineCustomElement('uai-editor-table-menu-insert-table', InsertTable);
defineCustomElement('uai-editor-table-menu-add-column-after', AddColumnAfter);
defineCustomElement('uai-editor-table-menu-add-column-before', AddColumnBefore);
defineCustomElement('uai-editor-table-menu-delete-column', DeleteColumn);
defineCustomElement('uai-editor-table-menu-add-row-after', AddRowAfter);
defineCustomElement('uai-editor-table-menu-add-row-before', AddRowBefore);
defineCustomElement('uai-editor-table-menu-delete-row', DeleteRow);
defineCustomElement('uai-editor-table-menu-delete-table', DeleteTable);

defineCustomElement('uai-editor-tools-menu-diagrams', Diagrams);

defineCustomElement('uai-editor-page-menu-toggle-toc', ToggleToc);
defineCustomElement('uai-editor-page-menu-background-color', BackgroundColor);
defineCustomElement('uai-editor-page-menu-watermark', Watermark);

defineCustomElement('uai-editor-export-menu-docx', ExportDocx);
defineCustomElement('uai-editor-export-menu-odt', ExportOdt);
defineCustomElement('uai-editor-export-menu-pdf', ExportPdf);
defineCustomElement('uai-editor-export-menu-markdown', ExportMarkdown);
defineCustomElement('uai-editor-export-menu-image', ExportImage);

defineCustomElement('uai-editor-ai-menu-toggle-chat', ToggleChat);
defineCustomElement('uai-editor-ai-menu-toggle-image', ToggleImage);

defineCustomElement('uai-editor-statusbar-menu-character-count', CharacterCount);

defineCustomElement('uai-editor-statusbar-menu-fullscreen', Fullscreen);
defineCustomElement('uai-editor-statusbar-menu-feedback', Feedback);
defineCustomElement('uai-editor-statusbar-menu-powered-by', PoweredBy);

defineCustomElement('uai-editor-bubble-menu-text-selection', TextSelectionBubbleMenu);

defineCustomElement('uai-editor-bubble-menu-image', ImageBubbleMenu);
defineCustomElement('uai-editor-bubble-menu-image-flip-x', ImageFlipX);
defineCustomElement('uai-editor-bubble-menu-image-flip-y', ImageFlipY);

defineCustomElement('uai-editor-bubble-menu-video', VideoBubbleMenu);

defineCustomElement('uai-editor-bubble-menu-audio', AudioBubbleMenu);

defineCustomElement('uai-editor-bubble-menu-file', FileBubbleMenu);

defineCustomElement('uai-editor-ai-action-request-action', AIRequestAction);
defineCustomElement('uai-editor-ai-action-chat-response-action', AIChatResponseAction);
defineCustomElement('uai-editor-ai-action-image-response-action', AIImageResponseAction);

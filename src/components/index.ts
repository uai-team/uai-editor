// Copyright (c) 2024-present AI-Labs

import { defineCustomElement } from "../utils/DefineCustomElement.ts";
import { Header } from "../components/Header.ts";
import { Editor } from "../components/Editor.ts";
import { Footer } from "../components/Footer.ts";

import { Ribbon } from "./menus/toolbar/Ribbon.ts";
import { Classic } from "./menus/toolbar/Classic.ts";

import { ScrollableDiv } from "./menus/toolbar/ScrollableDiv.ts";
import { MenuButton } from "./menus/MenuButton.ts";
import { ColorPicker } from "./popups/ColorPicker.ts";

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

// 注册组件
defineCustomElement('uai-editor-header', Header);
defineCustomElement('uai-editor-editor', Editor);
defineCustomElement('uai-editor-footer', Footer);

defineCustomElement('uai-editor-ribbon-menu', Ribbon);
defineCustomElement('uai-editor-classic-menu', Classic);

defineCustomElement('uai-editor-scrollable-div', ScrollableDiv);
defineCustomElement('uai-editor-menu-button', MenuButton);
defineCustomElement('uai-editor-popup-color-picker', ColorPicker);

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

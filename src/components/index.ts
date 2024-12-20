// Copyright (c) 2024-present AI-Labs

import { defineCustomElement } from "../utils/DefineCustomElement.ts";
import { Header } from "../components/Header.ts";
import { Editor } from "../components/Editor.ts";
import { Footer } from "../components/Footer.ts";

import { Ribbon } from "./menus/toolbar/Ribbon.ts";
import { Classic } from "./menus/toolbar/Classic.ts";

import { ScrollableDiv } from "./menus/toolbar/ScrollableDiv.ts";
import { MenuButton } from "./menus/MenuButton.ts";

import { Undo } from "./menus/toolbar/base/Undo.ts";
import { Redo } from "./menus/toolbar/base/Redo.ts";
import { FormatPainter } from "./menus/toolbar/base/FormatPainter.ts";
import { ClearFormat } from "./menus/toolbar/base/ClearFormat.ts";

// 注册组件
defineCustomElement('uai-editor-header', Header);
defineCustomElement('uai-editor-editor', Editor);
defineCustomElement('uai-editor-footer', Footer);

defineCustomElement('uai-editor-ribbon-menu', Ribbon);
defineCustomElement('uai-editor-classic-menu', Classic);

defineCustomElement('uai-editor-scrollable-div', ScrollableDiv);
defineCustomElement('uai-editor-menu-button', MenuButton);

defineCustomElement('uai-editor-base-menu-undo', Undo);
defineCustomElement('uai-editor-base-menu-redo', Redo);
defineCustomElement('uai-editor-base-menu-format-painter', FormatPainter);
defineCustomElement('uai-editor-base-menu-clear-format', ClearFormat);

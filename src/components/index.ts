// Copyright (c) 2024-present AI-Labs

import { defineCustomElement } from "../utils/DefineCustomElement.ts";
import { Header } from "../components/Header.ts";
import { Editor } from "../components/Editor.ts";
import { Footer } from "../components/Footer.ts";

import { Ribbon } from "./menus/toolbar/Ribbon.ts";
import { Classic } from "./menus/toolbar/Classic.ts";


// 注册组件
defineCustomElement('uai-editor-header', Header);
defineCustomElement('uai-editor-editor', Editor);
defineCustomElement('uai-editor-footer', Footer);

defineCustomElement('uai-editor-ribbon-menu', Ribbon);
defineCustomElement('uai-editor-classic-menu', Classic);

// ==UserScript==
// @id awace
// @name Arch Wiki Ace
// @namespace https://github.com/lahwaacz/awace
// @author Jakub Klinkovský <j.l.k@gmx.com>
// @version 0.2
// @description Ajax.org Cloud9 Editor brought to the Arch wiki
// @website https://github.com/lahwaacz/awace
// @supportURL https://github.com/lahwaacz/awace/issues
// @updateURL https://raw.githubusercontent.com/lahwaacz/awace/master/awace.meta.js
// @downloadURL https://raw.githubusercontent.com/lahwaacz/awace/master/awace.user.js
// @match https://wiki.archlinux.org/*
// @require https://raw.githubusercontent.com/lahwaacz/awace/master/ace-build/ace.js
// @require https://raw.githubusercontent.com/lahwaacz/awace/master/ace-build/theme-chrome.js
// @require https://raw.githubusercontent.com/lahwaacz/awace/master/ace-build/mode-mediawiki.js
// @require https://raw.githubusercontent.com/lahwaacz/awace/master/ace-build/keybinding-vim.js
// @require https://raw.githubusercontent.com/lahwaacz/awace/master/ace-build/ext-themelist.js
// @require https://raw.githubusercontent.com/lahwaacz/awace/master/util.js
// ==/UserScript==

var createOption = function(value, text) {
    option = document.createElement("option");
    option.setAttribute("value", value);
    option.innerHTML = text;
    return option;
}

var createUI = function(oldTextArea) {
    // Simply replacing the existing <textarea> element will break MediaWiki's
    // form buttons ("Save page", "Show preview", "Show changes"), so we need
    // to create our own editor element and transfer the text.
    // Note that Ace currently cannot convert <textarea> elements anyway,
    // see https://github.com/ajaxorg/ace/issues/2016 for details.

    oldTextArea.style.display = "none";

    GM_addStyle("#awace-textarea {width: 100%; height: 600px; position: relative; border: 1px solid silver;} " +
                "#awace-config-toolbar {padding: 0.3em 1em; background-color: #f0f0f0; border: 1px solid silver; border-bottom: none;} " +
                "#awace-config-toolbar label:not(:first-child) {margin-left: 1em;} " +
                "#awace-config-toolbar select {margin: 0 0.5em;}");

    // new text area
    var aceTextArea = document.createElement("div");
    aceTextArea.setAttribute("id", "awace-textarea");
    oldTextArea.parentNode.insertBefore(aceTextArea, oldTextArea);

    // configuration toolbar
    var configToolbar = document.createElement("div");
    configToolbar.setAttribute("id", "awace-config-toolbar");
    aceTextArea.parentNode.insertBefore(configToolbar, aceTextArea);

    var themeLabel = document.createElement("label");
    themeLabel.innerHTML = "Theme";
    themeLabel.setAttribute("for", "awaceThemeSelect");
    configToolbar.appendChild(themeLabel);

    var themeSelect = document.createElement("select");
    themeSelect.setAttribute("id", "awaceThemeSelect");
    configToolbar.appendChild(themeSelect);

    var keybindingLabel = document.createElement("label");
    keybindingLabel.innerHTML = "Keybinding";
    keybindingLabel.setAttribute("for", "awaceKeybindingSelect");
    configToolbar.appendChild(keybindingLabel);

    var keybindingSelect = document.createElement("select");
    keybindingSelect.setAttribute("id", "awaceKeybindingSelect");
    configToolbar.appendChild(keybindingSelect);

    keybindingSelect.appendChild(createOption("ace", "Ace"));
    keybindingSelect.appendChild(createOption("vim", "Vim"));
    keybindingSelect.appendChild(createOption("emacs", "Emacs"));
}

var mwTextArea = document.getElementById("wpTextbox1");

if (mwTextArea) {
    createUI(mwTextArea);

    // initialize Ace
    var editor = ace.edit("awace-textarea");
    var themelist = ace.require("ace/ext/themelist");

//    var bindDropdown = ace.bindDropdown;
//    var fillDropdown = ace.fillDropdown;

    var themeSelect = document.getElementById("awaceThemeSelect");
    var keybindingSelect = document.getElementById("awaceKeybindingSelect");

    // bind theme & keybinding selectors
    themelist.themes.forEach(function(x){ x.value = x.theme });
    fillDropdown(themeSelect, {
        Bright: themelist.themes.filter(function(x){return !x.isDark}),
        Dark: themelist.themes.filter(function(x){return x.isDark}),
    });

    bindDropdown("awaceThemeSelect", function(value) {
        if (!value)
            return;
        editor.setTheme(value);
        themeSelect.selectedValue = value;
    });

    var keybindings = {
        ace: null, // Null = use "default" keymapping
        vim: ace.require("ace/keyboard/vim").handler,
        emacs: "ace/keyboard/emacs",
    };

    bindDropdown("awaceKeybindingSelect", function(value) {
        editor.setKeyboardHandler(keybindings[value]);
    });

    // should be saved & restored
//    editor.setTheme("ace/theme/chrome");
//    editor.setKeyboardHandler("ace/keyboard/vim");

    editor.getSession().setMode("ace/mode/mediawiki");
    editor.getSession().setTabSize(4);
    editor.getSession().setUseSoftTabs(true);
    editor.getSession().setUseWrapMode(true);
    editor.setShowPrintMargin(false);

    // set text
    editor.setValue(mwTextArea.value);
    editor.gotoLine(1);

    // onsubmit handler - we need to copy changed text back into mwTextArea before submitting!
    document.getElementById("editform").onsubmit = function() {
        mwTextArea.value = editor.getValue();
    }
}

// ==UserScript==
// @id awace
// @name Arch Wiki Ace
// @namespace https://github.com/lahwaacz/awace
// @author Jakub Klinkovský <j.l.k@gmx.com>
// @version 0.1
// @description Ajax.org Cloud9 Editor brought to the Arch wiki
// @website https://github.com/lahwaacz/awace
// @supportURL https://github.com/lahwaacz/awace/issues
// @updateURL https://raw.githubusercontent.com/lahwaacz/awace/master/awace.meta.js
// @downloadURL https://raw.githubusercontent.com/lahwaacz/awace/master/awace.user.js
// @match https://wiki.archlinux.org/*
// @require https://raw.githubusercontent.com/ajaxorg/ace-builds/master/src-noconflict/ace.js
// @require https://raw.githubusercontent.com/ajaxorg/ace-builds/master/src-noconflict/theme-github.js
// @require https://raw.githubusercontent.com/ajaxorg/ace-builds/master/src-noconflict/mode-javascript.js
// @require https://raw.githubusercontent.com/ajaxorg/ace-builds/master/src-noconflict/keybinding-vim.js
// ==/UserScript==

var mwTextArea = document.getElementById("wpTextbox1");

if (mwTextArea) {
    // Simply replacing the existing <textarea> element will break MediaWiki's
    // form buttons ("Save page", "Show preview", "Show changes"), so we need
    // to create our own editor element and transfer the text.
    // Note that Ace currently cannot convert <textarea> elements anyway,
    // see https://github.com/ajaxorg/ace/issues/2016 for details.

    mwTextArea.style.display = "none";

    var aceTextArea = document.createElement('div');
    aceTextArea.setAttribute("id", "awace-textarea");
    GM_addStyle("#awace-textarea {width: 100%; height: 600px; position: relative; border: 1px solid silver;}");

    mwTextArea.parentNode.insertBefore(aceTextArea, mwTextArea);

    // initialize Ace
    var editor = ace.edit("awace-textarea");
    editor.setTheme("ace/theme/github");
    editor.getSession().setMode("ace/mode/javascript");
    editor.getSession().setTabSize(4);
    editor.setKeyboardHandler("ace/keyboard/vim");

    // set text
    editor.setValue(mwTextArea.value);
    editor.gotoLine(1);

    // onsubmit handler - we need to copy changed text back into mwTextArea before submitting!
    document.getElementById("editform").onsubmit = function() {
        mwTextArea.value = editor.getValue();
    }
}

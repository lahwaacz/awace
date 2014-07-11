ace.define("ace/mode/mediawiki_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var MediawikiHighlightRules = function() {
    this.$rules = {
        start: [
            {
                token: "support.function",
                regex: "^ [\\s\\S]*$"
            },
            {
                token: "mediawiki.table",
                regex: "{\\|",
                push: "table"
            },
            {
                token: "keyword",
                regex: "^#redirect",
                caseInsensitive: true
            },
            {
                token: ["markup.list", "list", "markup.list", "list"],
                regex: "^(;[\\s*])(.*)([\\s*]:[\\s*])(.*)$"
            },
            {
                token: "markup.list",
                regex: "^(#|\\*|\\:+|;)[\\s]*",
                push: "list"
            },
            {
                token: "markup.heading",
                regex: "^(={1,6})(?!=)[^=]*(\\1)(\\s*$)"
            },
            {
                token: "keyword",
                regex: "^-{4,}"
            },
            {include: "basic"}
        ],
        
        basic: [
            {
                token: "constant.character",
                regex: "&([a-z]+|#[1-9][0-9]{1,3}|#x[a-z0-9]{1,4});",
            },
            {
                token: "comment",
                regex: "<\\!--.*?-->"
            },
            {
                token: ["tag.nowiki", "comment", "tag.nowiki"],
                regex: "(<nowiki>)(.*)(</nowiki>)"
            },
            {
                token: "keyword",
                regex: "(~{3,5})|"+     // signatures
                       "(__(FORCE|NO)?TOC__)|"+     // table of content
                       "({{DISPLAYTITLE:[^{}]+}})"
            },
            {
                token: "markup.bold",
                regex: "([']{5}(?=\\S))(.*?\\S[*_]*)(\\1)"
            },
            {
                token: "markup.bold",
                regex: "([']{3}(?=\\S))(.*?\\S[*_]*)(\\1)"
            },
            {
                token: "markup.italic",
                regex: "([']{2}(?=\\S))(.*?\\S[*_]*)(\\1)"
            },
            {
                token: ["markup.bold", "variable", "punctuation.operator", "variable.parameter", "markup.bold"],
                regex: "(\\[\\[)([^\\[\\]\\|]+)(\\|)?([^\\[\\]]*)?(\\]\\])"
            },
            {
                token: ["markup.bold", "string.underline", "string", "markup.bold"],
                regex: "(\\[)([^\\[\\] ]+)([^\\[\\]]*)(\\])"
            },
            {
                token: "string.underline",
                regex: "(?:https?|ftp|irc):[^'\">\\s\\(\\)]+"+
                       "|"+
                       "(?:mailto:)?[-.\\w]+\\@[-a-z0-9]+(?:\\.[-a-z0-9]+)*\\.[a-z]+"
            },
            {
                token: ["markup.bold", "storage.template", "markup.bold"],
                regex: "({{)([^|{}]+)(}})"
            },
            { 
                token: ["markup.bold", "storage.template", "punctuation.operator", "keyword.operator"],
                regex: "({{)([^\\|{}]+)(\\|)(\\w+=)?",
                push: "template"
            },
        ],
        
        table: [
            {
                token: "keyword.operator",
                regex: "\\|}",
                next: "pop"
            },
            {
                token: "keyword.operator",
                regex: "(\\!\\!)|(^\\!)|(^\\|-)|(\\|\\|)|(^\\|)"
            },
            {include: "basic"},
            {defaultToken: "text"}
        ],
        
        list: [
            {
                regex: "$",
                next: "pop"
            },
            {include: "basic"},
            {defaultToken: "list"}
        ],
        
        template: [
            {
                token: "markup.bold",
                regex: "}}",
                next: "pop"
            },
            {
                token: ["punctuation.operator", "keyword.operator"],
                regex: "(\\|)(\\w+=)?"
            },
            {include: "start"},
            {defaultToken: "text"}
        ]
    };
    
    this.normalizeRules();
};

oop.inherits(MediawikiHighlightRules, TextHighlightRules);

exports.MediawikiHighlightRules = MediawikiHighlightRules;
});

ace.define("ace/mode/mediawiki",["require","exports","module","ace/lib/oop","ace/mode/text","ace/tokenizer","ace/mode/mediawiki_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var Tokenizer = require("../tokenizer").Tokenizer;
var MediawikiHighlightRules = require("./mediawiki_highlight_rules").MediawikiHighlightRules;

var Mode = function() {
    this.HighlightRules = MediawikiHighlightRules;
};
oop.inherits(Mode, TextMode);

exports.Mode = Mode;
});

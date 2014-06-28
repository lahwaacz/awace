ace.define("ace/mode/mediawiki_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var MediawikiHighlightRules = function() {
    this.$rules = {
        start: [
            {
                token: "markup.raw",
                regex: "^ [\\s\\S]*$"
            },
            {
                token: "mediawiki.table",
                regex: "{\\|",
                next: "table"
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
                next: "list"
            },
            {
                token: "markup.heading",
                regex: "^(={1,6})(?!=)[^=]*(\\1)(\\s*$)"
            },
            {include: "basic"}
        ],
        
        basic: [
            {
                token: "constant",
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
                token: "string.strong_emphasis",
                regex: "([']{5}(?=\\S))(.*?\\S[*_]*)(\\1)"
            },
            {
                token: "string.strong",
                regex: "([']{3}(?=\\S))(.*?\\S[*_]*)(\\1)"
            },
            {
                token: "string.emphasis",
                regex: "([']{2}(?=\\S))(.*?\\S[*_]*)(\\1)"
            },
            {
                token: "wikilink",
                regex: "\\[\\[[^\\[\\]]*\\]\\]"
            },
            {
                token : "externallink",
                regex : "\\[[^\\[\\]]*\\]"
            },
            {
                token: "externallink",
                regex: "(?:https?|ftp|irc):[^'\">\\s]+[^\\(\\)\\.]"+
                       "|"+
                       "(?:mailto:)?[-.\\w]+\\@[-a-z0-9]+(?:\\.[-a-z0-9]+)*\\.[a-z]+"
            },
            {
                token: "template",
                regex: "{{[^|{}]+}}"
            },
            { 
                token : "template",
                regex : "{{[^\\|{}]+(?=(.*\\|)+.*}})",
                next : "template"
            },
        ],
        
        list: [
            {
                regex : "$",
                next  : "start"
            },
            {include: "basic"},
            {defaultToken: "list"}
        ],
        
        template : [
            {include : "start"},
            {defaultToken: "template"}
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

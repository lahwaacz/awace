define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var MediawikiHighlightRules = function() {
    // regexp must not have capturing parentheses
    // regexps are ordered -> the first match is used

    // MediaWiki markup specification: https://www.mediawiki.org/wiki/Markup_spec
    // JavaScript regular expressions: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
    this.$rules = {
        start: [
            // special blocks start with " " | "{|" | "#" | ";" | ":" | "*" | "="
            
            // code blocks
            {
                token: "markup.raw",
                regex: "^ [\\s\\S]*$"
            },
            
            // tables
            // TODO: do the internals
            {
                token: "mediawiki.table",
                regex: "{\\|",
                next: "table"
            },
            
            // redirect link (needs to be defined before ordered lists!)
            {
                token: "keyword",
                regex: "^#redirect",
                caseInsensitive: true
            },
            
            // definition lists
            {
                token: ["markup.list", "list", "markup.list", "list"],
                regex: "^(;[\\s*])(.*)([\\s*]:[\\s*])(.*)$"
            },
            
            // ordered/unordered lists, indentations, definition terms without definitions
            {
                token: "markup.list",
                regex: "^(#|\\*|\\:+|;)[\\s]*",
                next: "list"
            },
            
            // headings
            {
                token: "markup.heading",
                regex: "^(={1,6})(?!=)[^=]*(\\1)(\\s*$)"
            },
            
            // fallback to normal text
            {include: "basic"}
        ],
        
        basic: [
            // HTML entities
            {
                token: "constant",
                regex: "&([a-z]+|#[1-9][0-9]{1,3}|#x[a-z0-9]{1,4});",
            },
            
            // HTML comments
            {
                token: "comment",
                regex: "<\\!--.*?-->"
            },
            
            // TODO: inline HTML tags
            
            // <nowiki> tags
            {
                token: ["tag.nowiki", "comment", "tag.nowiki"],
                regex: "(<nowiki>)(.*)(</nowiki>)"
            },
            
            // magic words
            // see https://www.mediawiki.org/wiki/Help:Magic_words for the full set
            {
                token: "keyword",
                regex: "(~{3,5})|"+     // signatures
                       "(__(FORCE|NO)?TOC__)|"+     // table of content
                       "({{DISPLAYTITLE:[^{}]+}})"
            },
            
            // bold, italics, bold italics (ordered by precedence!)
            // FIXME: this is too optimistic, see https://www.mediawiki.org/wiki/Markup_spec/BNF/Inline_text#Formatting
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
            
            // internal links
            {
                token: "wikilink",
                regex: "\\[\\[[^\\[\\]]*\\]\\]"
            },
            
            // external links (in single square brackets)
            {
                token : "externallink",
                regex : "\\[[^\\[\\]]*\\]"
            },
            
            // external links (plain url in text)
            {
                token: "externallink",
                regex: "(?:https?|ftp|irc):[^'\">\\s]+[^\\(\\)\\.]"+
                       "|"+
                       "(?:mailto:)?[-.\\w]+\\@[-a-z0-9]+(?:\\.[-a-z0-9]+)*\\.[a-z]+"
            },
            
            // templates without arguments
            {
                token: "template",
                regex: "{{[^|{}]+}}"
            },
            
            // templates with arguments
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

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
                token: "support.function",
                regex: "^ [\\s\\S]*$"
            },
            
            // tables
            {
                token: "keyword.operator",
                regex: "{\\|",
                push: "table"
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
                push: "list"
            },
            
            // headings
            {
                token: "markup.heading",
                regex: "^(={1,6})(?!=)[^=]*(\\1)(\\s*$)"
            },

            // horizontal line
            {
                token: "keyword",
                regex: "^-{4,}"
            },
            
            // fallback to normal text
            {include: "basic"}
        ],
        
        basic: [
            // HTML entities
            {
                token: "constant.character",
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
            
            // internal links
            {
                token: ["markup.bold", "variable", "punctuation.operator", "variable.parameter", "markup.bold"],
                regex: "(\\[\\[)([^\\[\\]\\|]+)(\\|)?([^\\[\\]]*)?(\\]\\])"
            },
            
            // external links (in single square brackets)
            {
                token: ["markup.bold", "string.underline", "string", "markup.bold"],
                regex: "(\\[)([^\\[\\] ]+)([^\\[\\]]*)(\\])"
            },
            
            // external links (plain url in text)
            // FIXME: to do it properly, negative lookbehind would be necessary (url does not end with punctuation)
            {
                token: "string.underline",
                regex: "(?:https?|ftp|irc):[^'\">\\s\\(\\)]+"+
                       "|"+
                       "(?:mailto:)?[-.\\w]+\\@[-a-z0-9]+(?:\\.[-a-z0-9]+)*\\.[a-z]+"
            },
            
            // templates without arguments
            {
                token: ["markup.bold", "storage.template", "markup.bold"],
                regex: "({{)([^|{}]+)(}})"
            },
            
            // templates with arguments
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

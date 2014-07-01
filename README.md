## awace

[Ajax.org Cloud9 Editor](http://ace.c9.io/) brought to the Arch wiki

### About

_awace_ is a [Greasemonkey](https://en.wikipedia.org/wiki/Greasemonkey) userscript that replaces the default, simple editor on [Arch wiki](https://wiki.archlinux.org/) with a more powerful editor.

__Warning:__ this project is currently just a __proof of concept__, please double-check after each wiki edit that the script did what you expected!

### Vim mode and pentadactyl

[Pentadactyl](http://5digits.org/pentadactyl/)'s handling of `<ESC>` key conflicts with awace: when Vim mode is selected in awace and insert mode activated, both pentadactyl and awace are in insert mode. Pressing `<ESC>` is passed to pentadactyl, to leave insert mode in awace you need to enter pass-through first (`<C-v>` by default) and then `<ESC>` is passed to awace.

A helpful trick is to add `<ESC>` into `passkeys`:

    set passkeys+=wiki.archlinux.org:<ESC>

This will practically switch the behaviour as the first `<ESC>` will be passed to awace and `<C-v><ESC>` to pentadactyl.

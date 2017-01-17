![](https://raw.githubusercontent.com/Janne252/scar/master/images/promo_logo.png)
# SCAR - Language support for [Relic](http://www.relic.com/)'s SCAR Scripting Language
(Company of Heroes 2)

## Build & Install
 - Build: `vsce package`
 - Install: `code --install-extension scar-0.0.1.vsix`
 
## Features
 - [x] Lua syntax check (based on [oxyc/luaparse](https://github.com/oxyc/luaparse))
 - [x] Autocompletion
    - [x] SCARDOC functions
    - [x] SCARDOC enums
    - [x] LuaConstsAuto.scar blueprints
    - [x] Current document words
    - [x] Lua standard library functions
    - [x] Workspace user-defined function
         - [x] Workspace user-defined function documentation parsing (based on [LDoc](https://github.com/stevedonovan/LDoc) format)
 - [x] Intellisense (function parameter autocompletion)
    - [x] SCARDOC functions
    - [x] Lua standard library functions
    - [x] Workspace user-defined functions
 - [x] Dynamic syntax highlighting
    - [x] SCARDOC functions
    - [x] SCARDOC enums
    - [x] LuaConstsAuto.scar blueprints
    - [x] Lua standard library functions
    - [x] Workspace user-defined functions 
 - [x] Misc 
    - [x] Reload workspace user-defined functions
    - [x] Find LuaConstsAuto.scar blueprint 

## Syntax Highlighting
![](https://raw.githubusercontent.com/Janne252/scar/master/images/promo_highlight.png)

## Autocompletion
![](https://raw.githubusercontent.com/Janne252/scar/master/images/promo_autocompletion.png)

## Intellisense
![](https://raw.githubusercontent.com/Janne252/scar/master/images/promo_intellisense.png)

## User-defined documentation parsing
![](https://raw.githubusercontent.com/Janne252/scar/master/images/promo_workspacedoc.png)
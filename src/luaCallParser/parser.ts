'use strict';

import * as vscode from 'vscode';
import LuaFunctionCallCollection from './luaFunctionCallCollection';
import LuaFunctionCall from './luaFunctionCall';
import LuaFunctionCallParameter from './luaFunctionCallParameter';
import LuaFunctionCallInfo from './luaFunctionCallInfo';

/**
 * Parser that extracts function calls from a lua source code, used to provide accurate signature help.
 * Does not care about syntax errors. Probably the only horrific piece of code this extension contains.
 * 
 * Is coded to fully understand ALL the possible lua structures and should always return the correct function name and parameter index,
 * as long as the provided code is syntactically correct. Minor errors like additional comma at the end of a parameter list, e.g.
 * MyFunction(foo, bar,) do not matter. 
 */
export default class LuaCallParser
{
    public luaFunctionCallCollection:LuaFunctionCallCollection = new LuaFunctionCallCollection();
    
    private singleQuote:boolean = false;
    private doubleQuote:boolean = false;
    private doubleBracket:boolean = false;
    private doubleBracketSpecial:boolean = false;
    private multiLineComment:boolean = false;
    private multiLineCommentSpecial:boolean = false;
   
    private doubleBracketSpecialLength:number = 0;
    private multiLineCommentSpecialLength:number = 0;
    
    private brackets:number = 0;
    private curlyBrackets:number = 0;
    private angleBrackets:number = 0;
    
    private lineCharIndex:number;
    private lineIndex:number;
    private offset:number = 0;
    
    private isFunctionDefinitionLine:boolean = false;
    private isFunctionCall:boolean = false;
    
    private namebuilder:string = "";
    
    private currentFunction:LuaFunctionCall;
    
    /*
        Resets and prepares the Parser for the parsing operation.
    */
    private reset():void
    {
        this.singleQuote = false;
        this.doubleQuote = false;
        this.doubleBracket = false;
        this.doubleBracketSpecial = false;
        this.doubleBracketSpecialLength = 0;
        this.multiLineComment = false;
        this.multiLineCommentSpecial = false;
        this.multiLineCommentSpecialLength = 0;
        this.brackets = 0;
        this.curlyBrackets = 0;
        this.angleBrackets = 0;
        this.offset = 0;
        this.isFunctionDefinitionLine = false;
        this.isFunctionCall = false;
        
        this.luaFunctionCallCollection.clear();
    }
    /*
        Parses the provided string.
    */
    private parseLine(line:string, lineIndex:number)
    {
        this.isFunctionDefinitionLine = false;
        let lastIndex = line.length - 1;
        
        for (this.lineCharIndex = 0; this.lineCharIndex <= lastIndex; this.lineCharIndex++)
        {
            let c:string = line.charAt(this.lineCharIndex);
            let prev = (this.lineCharIndex > 0 ? line.charAt(this.lineCharIndex -1) : "");
            let next = (this.lineCharIndex < lastIndex ? line.charAt(this.lineCharIndex + 1) : "");
            
            if (!this.doubleQuote && !this.doubleBracket && !this.doubleBracketSpecial && !this.multiLineComment && c == "'" && prev != "\\")
            {
                this.singleQuote = !this.singleQuote;
            }
            else if (!this.singleQuote && !this.doubleBracket && !this.doubleBracketSpecial && !this.multiLineComment && c == "\"" && prev != "\\")
            {
                this.doubleQuote = !this.doubleQuote;
            }
            else if (!this.singleQuote && !this.doubleQuote && !this.doubleBracket && !this.doubleBracketSpecial && !this.multiLineComment && c == "-" && next == "-")
            {
                if (this.lineCharIndex <= lastIndex - 3 && line.charAt(this.lineCharIndex + 2) == '[' && line.charAt(this.lineCharIndex + 3) == '[')
                {
                    this.multiLineComment = true;
                }
                else if (!this.multiLineCommentSpecial && this.lineCharIndex <= lastIndex - 3 && line.charAt(this.lineCharIndex + 2) == '[' && line.charAt(this.lineCharIndex + 3) == '=')
                {
                    this.multiLineCommentSpecialLength = 0;
                    let isValid = false;
                    for (let j = this.lineCharIndex + 3; j <= lastIndex; j++)
                    {
                        let _c = line.charAt(j);
                        if (_c == '=')
                        {
                            this.multiLineCommentSpecialLength++;
                        }
                        else if (_c == '[') //Text must be [====[ (number of = may vary)
                        {
                            isValid = true;
                            break;
                        }
                    }

                    if (isValid)
                    {
                        this.multiLineCommentSpecial = true;
                        this.multiLineComment = true;
                    }
                }                
                else //Finish parsing line, found a comment
                {
                    this.offset = this.offset + (lastIndex + 1 - this.lineCharIndex);
                    break;
                }
            }
            else if (!this.singleQuote && !this.doubleQuote && !this.doubleBracket && !this.doubleBracketSpecial && this.multiLineComment && !this.multiLineCommentSpecial && c == ']' && next == ']')
            {
                this.multiLineComment = false;
                this.lineCharIndex = this.lineCharIndex + 1;
                this.offset = this.offset + 1;
            }
            else if (!this.singleQuote && !this.doubleQuote && !this.doubleBracket && !this.doubleBracketSpecial && this.multiLineComment && this.multiLineCommentSpecial && c == ']' && next == '=')
            {
                let checkMultiLineComemntSPecialLength = 0;
                let isValid = false;
                for (let j = this.lineCharIndex + 1; j <= lastIndex; j++)
                {
                    let _c = line.charAt(j);
                    if (_c == '=')
                    {
                        checkMultiLineComemntSPecialLength++;
                    }
                    else if (_c == ']') //Text must be ]====] (number of = may vary)
                    {
                        isValid = true;
                        break;
                    }
                }

                if (isValid && checkMultiLineComemntSPecialLength == this.multiLineCommentSpecialLength)
                {
                    this.multiLineComment = false;
                    this.multiLineCommentSpecial = false;
                    this.multiLineCommentSpecialLength = 0;
                    let jump = checkMultiLineComemntSPecialLength + 1;
                    this.lineCharIndex = this.lineCharIndex + jump;
                    this.offset = this.offset + jump;
                }
            }
            else if (!this.singleQuote && !this.doubleQuote && !this.doubleBracket && !this.doubleBracketSpecial && !this.multiLineComment && c == '[' && next == '[')
            {
                this.doubleBracket = true;
            }
            else if (!this.singleQuote && !this.doubleQuote && this.doubleBracket && !this.doubleBracketSpecial && !this.multiLineComment && c == ']' && next == ']')
            {
                this.doubleBracket = false;
                this.lineCharIndex = this.lineCharIndex + 1;
                this.offset = this.offset + 1;
            }
            else if (!this.singleQuote && !this.doubleQuote && !this.doubleBracket && !this.doubleBracketSpecial && !this.multiLineComment && c == '[' && next == '=')
            {
                this.doubleBracketSpecialLength = 0;
                let isValid:boolean = false;
                for (let j = this.lineCharIndex + 1; j <= lastIndex; j++)
                {
                    let _c = line.charAt(j);
                    if (_c == '=')
                    {
                        this.doubleBracketSpecialLength++;
                    }
                    else if (_c == '[') //Text must be [====[ (number of = may vary)
                    {
                        isValid = true;
                        break;
                    }
                }

                if (isValid)
                {
                    this.doubleBracketSpecial = true;
                }
            }
            else if (!this.singleQuote && !this.doubleQuote && !this.doubleBracket && this.doubleBracketSpecial && !this.multiLineComment && c == ']' && next == '=')
            {
                let checkDoubleBracketSpecialLength = 0;
                let isValid = false;
                for (let j = this.lineCharIndex + 1; j <= lastIndex; j++)
                {
                    let _c = line.charAt(j);
                    if (_c == '=')
                    {
                        checkDoubleBracketSpecialLength++;
                    }
                    else if (_c == ']') //Text must be ]====] (number of = may vary)
                    {
                        isValid = true;
                        break;
                    }
                }

                if (isValid && checkDoubleBracketSpecialLength == this.doubleBracketSpecialLength)
                {
                    this.doubleBracketSpecial = false;
                    let jump = checkDoubleBracketSpecialLength + 1;
                    this.lineCharIndex = this.lineCharIndex + jump;
                    this.offset = this.offset + jump;
                }
            }
            else if (!this.singleQuote && !this.doubleQuote && !this.doubleBracket && !this.doubleBracketSpecial && !this.multiLineComment)
            {
                let isValidChar = (c.match(/[a-z0-9]/i) || c == '_' || c == ':' || c == '.') && !/\s/.test(c); // "/\s/" = whitespace
                if (isValidChar)
                {
                    this.namebuilder = this.namebuilder + c;
                }
                
                if (!isValidChar || this.lineCharIndex == lastIndex)
                {
                    if (this.namebuilder.length > 0)
                    {
                        let name = this.namebuilder;

                        if (this.isFunctionDefinitionLine)
                        {
                            this.isFunctionDefinitionLine = false;
                        }
                        else if (c == '(' && name != "function") // Skip function definitions
                        {
                            this.isFunctionCall = true;
                            this.currentFunction = this.luaFunctionCallCollection.open(name, this.offset - 1 - name.length);
                        }

                        if (name == "function") // Skip anonymous function definitions
                        {
                            this.isFunctionDefinitionLine = true;
                        }
                        
                        this.namebuilder = "";
                    }
                    switch (c)
                    {
                        case '(':
                            if (this.currentFunction == null)
                                this.brackets++;
                            else
                                this.currentFunction.luaBracketCounter.bracket++;
                                
                            break;
                        case ')':
                            if (this.currentFunction == null)
                                this.brackets--;
                            else
                                this.currentFunction.luaBracketCounter.bracket--;
                            
                            if (this.isFunctionCall && this.currentFunction.luaBracketCounter.bracket == 0)
                            {
                                this.luaFunctionCallCollection.close(this.offset);
                                this.currentFunction = this.luaFunctionCallCollection.findOpen();
                                
                                this.isFunctionCall = this.luaFunctionCallCollection.openCount > 0;
                            }
                            
                            break;
                        case '[':
                            if (this.currentFunction == null)
                                this.angleBrackets++;
                            else
                                this.currentFunction.luaBracketCounter.angle++;
                                
                            break;
                        case ']':
                            if (this.currentFunction == null)
                                this.angleBrackets--;
                            else
                                this.currentFunction.luaBracketCounter.angle--;
                                
                            break;
                        case '{':
                            if (this.currentFunction == null)
                                this.curlyBrackets++;
                            else
                                this.currentFunction.luaBracketCounter.curly++;
                                
                            break;
                        case '}':
                            if (this.currentFunction == null)
                                this.curlyBrackets--;
                            else
                                this.currentFunction.luaBracketCounter.curly--;
                                
                            break;
                        case ',':
                            if (
                                this.isFunctionCall && 
                                this.currentFunction != null && 
                                this.currentFunction.luaBracketCounter.bracket == 1 && 
                                this.currentFunction.luaBracketCounter.angle + this.currentFunction.luaBracketCounter.curly == 0
                            )
                            {
                                this.luaFunctionCallCollection.closeParameter(this.offset);
                            }
                            
                            break;
                    }
                }
            }

            this.offset = this.offset + 1;
        }
    } 
    /*
        Parses a vscode TextDocument line by line.
        Finds all the LuaFunctionCalls.
    */
    public parseFromTextDocument(document:vscode.TextDocument)
    {
        console.time('luaCallParser');
        this.reset();
        
        for (let i = 0; i < document.lineCount; i++)
        {
            this.parseLine(document.lineAt(i).text, i);
            this.offset = this.offset + 2;
        }
        console.timeEnd('luaCallParser');
    }
    /*
        Finds the LuaFunctionCall that contains the provided offset. If a matching function cannot be found, null is returned instead.
    */
    public getFunctionInfoAt(offset:number):LuaFunctionCallInfo
    {
        let call:LuaFunctionCall;
        
        let paramIndex = 0;
        let lastIndex = this.luaFunctionCallCollection.items.length - 1;

        for (let i = lastIndex; i >= 0; i--)
        {
            call = this.luaFunctionCallCollection.items[i];
            paramIndex = call.getParameterCount() - 1;
            if (offset >= call.startIndex && offset <= call.endIndex)
            {
                let param:LuaFunctionCallParameter;
                let paramIndexFound = false;
                for (let j = 0; j < call.getParameterCount(); j++)
                {
                    param = call.parameters[j];

                    if (offset >= param.startIndex && offset <= param.endIndex)
                    {
                        paramIndexFound = true;
                        paramIndex = j;
                        break;
                    }
                }
                if (paramIndexFound)
                {
                    return new LuaFunctionCallInfo(call, paramIndex);
                }
            }
        }

        return undefined;
    }
}
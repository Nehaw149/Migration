{
var word_Obj= {};
var word_alnum_Obj= {};
var word_alnumsp_Obj= {};
var dir_Obj= {};
var ElementDec_Obj= {};
var UI_Element_Obj= {};
var UI_Val_Obj= {};
var word_Count =0;
var word_alnum_Count =0;
var word_alnumsp_Count =0;
var dir_Count = -1;
var ElementDec_Count =0;
var UI_Element_Count = -1;
var UI_Val_Count = -1;
var begin_Count = -1;
var end_Count = -1;
var child_Count = -1;
var children_Count = -1;
var flag = 0;
}
startRule  = dir:Directive* nl* Block_elements:Block_element nl* Ending:EOL {if(begin_Count === end_Count){return {Parsed_RC:{Directive_Obj:dir,Block_elements_Obj:Block_elements,ENDING:Ending}}}else{return "Incorrect .RC file"}}
Directive = "#" d:word space* v:word_alnumsp nl+ {dir_Count++; dir_Obj = {['Directive_'+dir_Count]:{"Dir": d, "_text":v}}; return dir_Obj;}
Block_element = (Element Looping)*
Looping = (LoopStart LoopEnd*)*
LoopStart = beg child:Element+ {begin_Count++; children_Count++; child_Count++; return {['LoopStart_'+ begin_Count]:begin_Count,['child_'+ children_Count]:child}}
LoopEnd = end {end_Count++; child_Count--; return {['LoopEnd_'+ end_Count]:end_Count};}
Element = UI_Element (UI_Val)* nl+ 
UI_Element = space* Block_element_name:word_alnumsp {if(Block_element_name==='BEGIN'){begin_Count++;children_Count++; child_Count++;return {['LoopStart_'+ begin_Count]:begin_Count}} if(Block_element_name==='END'){end_Count++; child_Count--; return {['LoopEnd_'+ end_Count]:end_Count};} if(child_Count<0){flag = 1;} UI_Element_Count++; UI_Element_Obj = {['UI_Element_Obj'+UI_Element_Count]:Block_element_name}; return UI_Element_Obj;}
UI_Val = space+ Element_val:word_comma* {UI_Val_Count++; UI_Val_Obj = {['_attributes_Obj'+ UI_Val_Count]:Element_val}; return UI_Val_Obj}
word_comma = word_alnumsp comma?

word = wo:letter+ {return wo.join("")}
word_alnum = al:alnum+ {return al.join("")}
word_alnumsp = alsp:alnumsp+ {return alsp.join("")}


beg = space* ([{]) space* nl+
end = space* ([}]) space* nl+
comma = space* [,] space* {return ","}

letter = [a-zA-Z]
alnum = [a-zA-Z0-9]
alnumsp = [a-zA-Z0-9"'&._()\\|+:]
space = " "
nl = '\n' {UI_Val_Count = -1; return "NL"}
EOL = !. {return "EOF"}
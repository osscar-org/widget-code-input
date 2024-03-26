import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { indentUnit } from '@codemirror/language';
import { bracketMatching, defaultHighlightStyle, foldGutter, foldKeymap, indentOnInput, syntaxHighlighting } from '@codemirror/language'
import { lintKeymap } from '@codemirror/lint'
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search'
import { EditorState,Compartment } from '@codemirror/state'
import { crosshairCursor, drawSelection, dropCursor, EditorView,gutter, highlightActiveLine, highlightActiveLineGutter, highlightSpecialChars, keymap, lineNumbers, rectangularSelection } from '@codemirror/view'
import * as _ from 'underscore';
import { nord } from 'cm6-theme-nord'
import { solarizedLight } from 'cm6-theme-solarized-light'
import { basicLight } from 'cm6-theme-basic-light'
// Import the css for the CodeMirror themes
// import '../css/midnight.css';
// import '../css/monokai.css';
// import '../css/eclipse.css';
// import '../css/material.css';
// import '../css/solarized.css';
// import '../css/idea.css';
// import '../css/nord.css';



/** @param {{ model: DOMWidgetModel, el: HTMLElement }} context */

function render(context) {
    let el = context.el; // this is the view
	let model = context.model; // this is widgetmodel


    model.attributes={function_body_id:'fid'}

    // Note: I think this inadvertanly changes the code cells inside the entire notebook
    const cssStyles =
      '<style>\
            .forced-indent {width: 4em;}\
            .CodeMirror {border: 1px solid #aaa; height: auto;}\
            .CodeMirror.widget-code-input-signature {border-bottom: 0px;}\
            .CodeMirror.widget-code-input-docstring {border-top: 0px;}\
            .CodeMirror.widget-code-input-body {border-top: 0px;}\
        </style>';
    


    const theTextareaId = model.attributes['function_body_id'];
    let textArea = document.createElement("textArea");
    el.appendChild(textArea)
    
    textArea.outerHTML =  cssStyles +
      '<textarea id="' +
      theTextareaId +
      '-signature" class="textwidgetclassname"></textarea>' +
      '<textarea id="' +
      theTextareaId +
      '-docstring"></textarea>' +
      '<textarea id="' +
      theTextareaId +
        '-body"></textarea>';

    
    function editorFromTextArea(textarea, extensions) {
        let view = new EditorView({state: EditorState.create({doc: textarea.value, extensions})})
        textarea.parentNode.insertBefore(view.dom, textarea)
        textarea.style.display = "none"
        if (textarea.form) textarea.form.addEventListener("submit", () => {
            textarea.value = view.state.doc.toString()
        })
        return view
    }


    _.defer(() => {

        var guttercomp = new Compartment; // allow dynamic changing of line numbers

        var theme_compartment_sig = new Compartment;
        var theme_compartment_doc = new Compartment;
        var theme_compartment_body = new Compartment;
        

        const mySignatureCodeMirror = editorFromTextArea(document.getElementById(theTextareaId + '-signature'), [EditorState.readOnly.of(true),lineNumbers(),indentUnit.of("    ")
, 
      history(),
      drawSelection(),
      dropCursor(),
      EditorState.allowMultipleSelections.of(true),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      bracketMatching(),
      closeBrackets(),
      autocompletion(),
      rectangularSelection(),
      crosshairCursor(),
                                                                                                                 highlightSelectionMatches(),
                                                                                                                 theme_compartment_sig.of(basicLight),
      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...searchKeymap,
        ...historyKeymap,
        ...foldKeymap,
        ...completionKeymap,
        ...lintKeymap,
      ])]
        
                                                         
                                                        );

        var myDocstringCodeMirror = editorFromTextArea(document.getElementById(theTextareaId + '-docstring'), [lineNumbers(), EditorState.readOnly.of(true), EditorView.editorAttributes.of({class:"widget-code-input-docstring"}), gutter({class:"forced-indent"}), guttercomp.of(lineNumbers()),
                                                                                                               
      history(),
      drawSelection(),
      dropCursor(),
      EditorState.allowMultipleSelections.of(true),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      bracketMatching(),
      closeBrackets(),
      autocompletion(),
      rectangularSelection(),
      crosshairCursor(),
      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...searchKeymap,
        ...historyKeymap,
        ...foldKeymap,
        ...completionKeymap,
        ...lintKeymap,
      ]), python(), indentUnit.of("    "), theme_compartment_doc.of(basicLight)]);

        // event listener for changes to function body

        var bodyUpdateListenerCompartment = new Compartment;


        
        var myBodyCodeMirror = editorFromTextArea(document.getElementById(theTextareaId + '-body'), [guttercomp.of(lineNumbers()),gutter({class:"forced-indent"}), bodyUpdateListenerCompartment.of([]),                                                          
      history(),
      drawSelection(),
      dropCursor(),
      EditorState.allowMultipleSelections.of(true),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      bracketMatching(),
      closeBrackets(),
      autocompletion(),
      crosshairCursor(),
      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...searchKeymap,
        ...historyKeymap,
        ...foldKeymap,
        ...completionKeymap,
        ...lintKeymap,
      ]),python(),indentUnit.of("    "), theme_compartment_body.of(basicLight)]);


        let bodyUpdateListenerExtension = EditorView.updateListener.of((update) => {
            if (update.docChanged) {
                // Handle the event here

                model.set("function_body",myBodyCodeMirror.state.doc.toString());
                model.save_changes();
                console.log("BodyChange event registered.");
            }
        });

        myBodyCodeMirror.dispatch({
            effects: bodyUpdateListenerCompartment.reconfigure(
                bodyUpdateListenerExtension)
        });



function  signatureValueChanged() {
    // Set the value from python into the CodeMirror widget in the
    // frontend.
    const newSignature =
      'def ' +
      model.get('function_name') +
      '(' +
      model.get('function_parameters') +
      '):';
      if (newSignature !== mySignatureCodeMirror.state.doc.toString() ) {
          mySignatureCodeMirror.dispatch({
  changes: {from: 0, to: mySignatureCodeMirror.state.doc.length, insert: newSignature}
})
    }
  }


 function updateLineNumbers() {
     const linesSignature = mySignatureCodeMirror.state.doc.toString().split('\n').length;
     const linesDocstring = myDocstringCodeMirror.state.doc.toString().split('\n').length;


     // increment line numbers in docstring text area by the number of lines in the signature
     myDocstringCodeMirror.dispatch({
 effects: guttercomp.reconfigure(
     lineNumbers({ formatNumber: n=>linesSignature+n }))
     });

     myBodyCodeMirror.dispatch({
 effects: guttercomp.reconfigure(
     lineNumbers({ formatNumber: n=>linesSignature+linesDocstring+n}))
     });

 }
        function  docstringValueChanged() {
            console.log("updating docstring");
            // Set the value from python into the CodeMirror widget in the
            // frontend.

            const newDocstring = '"""' + model.get('docstring') + '"""';

            if (newDocstring !== myDocstringCodeMirror.state.doc.toString()) {
                myDocstringCodeMirror.dispatch({
  changes: {from: 0, to: myDocstringCodeMirror.state.doc.length, insert: newDocstring}
})
//      myDocstringCodeMirror.setValue(newDocstring);
    }
   updateLineNumbers();
  }

function  bodyValueChanged() {
    // Set the value from python into the CodeMirror widget in the
    // frontend. Update it only if the content has changed:
    // typing re-fires this event, that would then change the content
    // of the widget, moving the cursor back to the top of the cell
      if (model.get('function_body') !==myBodyCodeMirror.state.doc.toString()) {
          myBodyCodeMirror.dispatch({
              changes: {from: 0, to: myBodyCodeMirror.state.doc.length, insert: model.get('function_body') }
          })
      }
}


        function themeChanged() {

            var theme;
            var theme_string = model.get("code_theme")

            var themeMap = {
                "nord": nord,
                "solarizedlight": solarizedLight,
                "basicLight": basicLight
            };

            if (theme_string in themeMap){
                theme=themeMap[theme_string];
            } else {
                throw new Error("Specified code theme is not supported.");
            }

            console.log("theme changed, theme= %s",theme_string)
            mySignatureCodeMirror.dispatch({
                effects: theme_compartment_sig.reconfigure(theme)
            })
            myDocstringCodeMirror.dispatch({
                effects: theme_compartment_doc.reconfigure(theme)
            })
            myBodyCodeMirror.dispatch({
                effects: theme_compartment_body.reconfigure(theme)
            })
        }

        
        signatureValueChanged();
        docstringValueChanged();
        bodyValueChanged();
        themeChanged();
        
        model.on("change:docstring", () => {
        console.log("docstring changed")
        docstringValueChanged();

        });
        model.on("change:function_body", () => {bodyValueChanged();});
   


        
      
        model.on('change:code_theme', () => {
            console.log("theme change event");
            themeChanged();});


    });

}
export default { render };

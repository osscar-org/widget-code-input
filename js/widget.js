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
import './widget.css';

function generateRandomString(length) {
    let result = "";
    while (result.length < length) {
      result += Math.random().toString(36).substring(2);
    }
    return result.substring(0, length);
  }


export default{
 initialize({ model }) {
// 	/* (optional) model initialization logic */

 },

/** @param {{ model: DOMWidgetModel, el: HTMLElement }} context */

    render({model,el}) {

        var unique_funcbody_id = generateRandomString(6)

        var docstring_present = 0;
        

        model.attributes={function_body_id:unique_funcbody_id}
        const theTextareaId = model.attributes['function_body_id'];
        const docstringId = theTextareaId + '-docstring';
        let docstringTextArea = null; // Define it at a higher scope
        


        // print the value of docstring to the console
        console.log("docstring = %s",model.get('docstring'));
        
        
    // Note: I think this inadvertanly changes the code cells inside the entire notebook
    const cssStyles =
      '<style>\
            .forced-indent {width: 4em;}\
            .CodeMirror {border: 1px solid #aaa; height: auto;}\
            widget-code-input-signature {border-bottom: 0px solid #aaa;}\
            widget-code-input-docstring {border-top: 0px solid #aaa;}\
            .widget-code-input-body { border-top: 1px solid #aaa;}\
        </style>';
    




        console.log("theTextareaId = %s",theTextareaId);
    let textArea = document.createElement("textArea");
    el.appendChild(textArea)



        
        // if docstring is not empty, create outer html with docstring
        if (model.get('docstring') !== '') {
            docstring_present = 1;
    textArea.outerHTML =  cssStyles +
      '<textarea id="' +
      theTextareaId +
      '-signature" class="CodeMirror.widget-code-input-signature"></textarea>' +
      '<textarea id="' +
      theTextareaId +
      '-docstring" class="CodeMirror.widget-code-input-docstring"></textarea>' +
      '<textarea id="' +
      theTextareaId +
                '-body" class="CodeMirror.widget-code-input-body"></textarea>';

            // const docstringId = theTextareaId + '-docstring';

     } else {
            // if docstring is empty, create outer html without docstring
            textArea.outerHTML = cssStyles +
                '<textarea id="' +
                theTextareaId +
                '-signature" class="CodeMirror.widget-code-input-signature"></textarea>' +
                '<textarea id="' +
                theTextareaId +
                '-body" class="CodeMirror.widget-code-input-body"></textarea>';
     }


        
        docstringTextArea = document.getElementById(docstringId);
        console.log("docstringTextArea = %s",docstringTextArea);
    // textArea.outerHTML =  cssStyles +
    //   '<textarea id="' +
    //   theTextareaId +
    //   '-signature" class="CodeMirror.widget-code-input-signature"></textarea>' +
    //   '<textarea id="' +
    //   theTextareaId +
    //   '-docstring" class="CodeMirror.widget-code-input-docstring"></textarea>' +
    //   '<textarea id="' +
    //   theTextareaId +
    //     '-body" class="CodeMirror.widget-code-input-body"></textarea>';
    
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
        var myDocstringCodeMirror;

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

        mySignatureCodeMirror.dom.classList.add("widget-code-input-signature")


        if (model.get('docstring') !== '') {

        myDocstringCodeMirror = editorFromTextArea(document.getElementById(theTextareaId + '-docstring'), [lineNumbers(), EditorState.readOnly.of(true), EditorView.editorAttributes.of({class:"widget-code-input-docstring"}), gutter({class:"forced-indent"}), guttercomp.of(lineNumbers()),
                                                                                                               
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
        }

             //         if (model.get('docstring') !== '') {
             //     console.log("docstring is not empty")
             //     document.getElementById(theTextareaId + '-docstring').style.display = "block";
             // } else {
             //     console.log("docstring is empty")
             //     document.getElementById(theTextareaId + '-docstring').style.display = "none";
             // }


        mySignatureCodeMirror.dom.classList.add("widget-code-input-signature"); // add css for border to docstring element
        
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

        myBodyCodeMirror.dom.classList.add("widget-code-input-body")

        let bodyUpdateListenerExtension = EditorView.updateListener.of((update) => {
            if (update.docChanged) {
                // Handle the event here

                model.set("function_body",myBodyCodeMirror.state.doc.toString());
                model.save_changes();
                console.log("BodyChange event registered!");
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
     var docstring = '';
     var linesDocstring = 0;
     console.log("update line numbers. docstring_present = %s",docstring_present);
     console.log("myDocstringcodemirror = %s",myDocstringCodeMirror);
      if (model.get('docstring') !== '' && myDocstringCodeMirror) {
           docstring = myDocstringCodeMirror.state.doc.toString();
          linesDocstring = docstring.split('\n').length;


          console.log("dispatch docstring linum update.");
          // increment line numbers in docstring text area by the number of lines in the signature

     myDocstringCodeMirror.dispatch({
       effects: guttercomp.reconfigure(
         lineNumbers({ formatNumber: n=> linesDocstring == 0 ? "" : linesSignature+n}))
     });
      }
     console.log("linesSignature = %s",linesSignature);
        console.log("linesDocstring = %s",linesDocstring);
     myBodyCodeMirror.dispatch({
       effects: guttercomp.reconfigure(
         lineNumbers({ formatNumber: n=>linesSignature+linesDocstring+n}))
     });

 }

        
        function  docstringValueChanged() {
            console.log("updating docstring");
            // Set the value from python into the CodeMirror widget in the
            // frontend.

            const newDocstring = model.get('docstring');
            const docstringElement = document.getElementById(theTextareaId + '-docstring');

            console.log("docstring_present = %s",docstring_present);
            // if user has changed the docstring from empty to non-empty, add the 

            docstringTextArea = document.getElementById(docstringId);

                console.log("docstring is present");
                console.log("newDocstring = %s",newDocstring);
                if (newDocstring == '') {
                    console.log("New docstring is None");
                    docstring_present == 0;
                    if(docstringTextArea){
                        console.log("docstringTextareaId = %s",docstringId);
                        
//                        docstringTextArea.remove(); // remove docstring text area
                        myDocstringCodeMirror.destroy();
                        console.log("destroyed docstring");
                        if (docstringElement && docstringElement.parentNode) {
                            console.log("removing docstring element");
                             docstringElement.parentNode.removeChild(docstringElement);
                             console.log("removed docstring element");
    }

    // Clear the reference
                        myDocstringCodeMirror = null;
                        console.log("cleared docstring");
                        docstringTextArea = null;
                        console.log("cleared docstring textarea");

                    }

                } else if (docstringTextArea==null) { // 
                    // add back docstring text area
                    // Find the sibling element (body) and insert the new docstring before it
                    
            const signatureTextArea = document.getElementById(`${theTextareaId}-signature`);

            if (signatureTextArea) {
                // Create the new docstring textarea
                const docstringTextArea = document.createElement('textarea');
                docstringTextArea.id = `${theTextareaId}-docstring`;
                docstringTextArea.classList.add('widget-code-input-docstring');
                signatureTextArea.insertAdjacentElement('beforebegin', docstringTextArea);

                // apply old theme
                var theme;
                var theme_string = model.get("code_theme")

                var themeMap = {
                "nord": nord,
                "solarizedLight": solarizedLight,
                "basicLight": basicLight
            };

            if (theme_string in themeMap){
                theme=themeMap[theme_string];
            } else {
                throw new Error("Specified code theme is not supported.");
            }


                // Initialize CodeMirror for the new textarea
                myDocstringCodeMirror = editorFromTextArea(docstringTextArea, [
                    lineNumbers(),
                    EditorState.readOnly.of(true),
                    EditorView.editorAttributes.of({ class: 'widget-code-input-docstring' }),
                    gutter({ class: 'forced-indent' }),guttercomp.of(lineNumbers()),
                    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
                    python(),
                    indentUnit.of('    '),
                    theme_compartment_doc.of(theme),
                ]);

                // Set the initial value for the new editor
                myDocstringCodeMirror.dispatch({
                    changes: { from: 0, to: myDocstringCodeMirror.state.doc.length, insert: newDocstring },
                });

                docstring_present = 1;
            }

             //               docstring_present = 1;
    // textArea.outerHTML =  cssStyles +
    //   '<textarea id="' +
    //   theTextareaId +
    //   '-signature" class="CodeMirror.widget-code-input-signature"></textarea>' +
    //   '<textarea id="' +
    //   theTextareaId +
    //   '-docstring" class="CodeMirror.widget-code-input-docstring"></textarea>' +
    //   '<textarea id="' +
    //   theTextareaId +
    //             '-body" class="CodeMirror.widget-code-input-body"></textarea>';

     
    //                         myDocstringCodeMirror = editorFromTextArea(document.getElementById(theTextareaId + '-docstring'), [lineNumbers(), EditorState.readOnly.of(true), EditorView.editorAttributes.of({class:"widget-code-input-docstring"}), gutter({class:"forced-indent"}), guttercomp.of(lineNumbers()),
                                                                                                               
    //   history(),
    //   drawSelection(),
    //   dropCursor(),
    //   EditorState.allowMultipleSelections.of(true),
    //   syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    //   bracketMatching(),
    //   closeBrackets(),
    //   autocompletion(),
    //   rectangularSelection(),
    //   crosshairCursor(),
    //   keymap.of([
    //     ...closeBracketsKeymap,
    //     ...defaultKeymap,
    //     ...searchKeymap,
    //     ...historyKeymap,
    //     ...foldKeymap,
    //     ...completionKeymap,
    //     ...lintKeymap,
    //   ]), python(), indentUnit.of("    "), theme_compartment_doc.of(basicLight)]);
    //     }


                }     else {

//                    if   (newDocstring !== myDocstringCodeMirror.state.doc.toString()) {
                        console.log("dispatch docstring update");
                myDocstringCodeMirror.dispatch({
  changes: {from: 0, to: myDocstringCodeMirror.state.doc.length, insert: newDocstring}
})
  //  }
// Add docstring now
//                const docstringId = theTextareaId + '-docstring';
//            let docstringTextArea = document.getElementById(docstringId);
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
                "solarizedLight": solarizedLight,
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
            if (model.get('docstring') !== '') {
            myDocstringCodeMirror.dispatch({
                effects: theme_compartment_doc.reconfigure(theme)
            })
            }
            myBodyCodeMirror.dispatch({
                effects: theme_compartment_body.reconfigure(theme)
            })

            mySignatureCodeMirror.dom.classList.add("widget-code-input-signature") // reapply css styling
            myBodyCodeMirror.dom.classList.add("widget-code-input-body") // after theme update
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
}

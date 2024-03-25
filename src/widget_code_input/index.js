import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'

import { bracketMatching, defaultHighlightStyle, foldGutter, foldKeymap, indentOnInput, syntaxHighlighting } from '@codemirror/language'
import { lintKeymap } from '@codemirror/lint'
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search'
import { EditorState,Compartment } from '@codemirror/state'
import { crosshairCursor, drawSelection, dropCursor, EditorView, highlightActiveLine, highlightActiveLineGutter, highlightSpecialChars, keymap, lineNumbers, rectangularSelection } from '@codemirror/view'
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


/** @param {{ model: DOMWidgetModel }} context */
// function initialize({ model }) {
// 	/* (optional) model initialization logic */
// //    const attributes ={fid:'ffid'}


//     console.log(model.attributes);
//     //console.log(model.attributes['function_body_id'])
//     var theme = model.get('code_theme');

// }
/** @param {{ model: DOMWidgetModel, el: HTMLElement }} context */

function render(context) {
    let el = context.el; // this is the view
	let model = context.model; // this is widgetmodel

        model.attributes={function_body_id:'fid'}

    // Note: I think this inadvertanly changes the code cells inside the entire notebook
    const cssStyles =
      '<style>\
            .forced-indent {width: 40em;}\
            .CodeMirror {border: 1px solid #aaa; height: auto;}\
            .CodeMirror.widget-code-input-signature {border-bottom: 0px;}\
            .CodeMirror.widget-code-input-docstring {border-top: 0px;}\
            .CodeMirror.widget-code-input-body {border-top: 0px;}\
        </style>';
    

    //        const theTextareaId = model.get('function_body_id');
    const theTextareaId = model.attributes['function_body_id'];
    let textArea = document.createElement("textArea");
    // maybe this should be a blank element to add the textarea to?
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

    
    console.log(el)


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
            const HTMLTextAreaElement =   document.querySelector("#fid-signature");//     document.getElementById(theTextareaId + '-signature')
    const htextArea = HTMLTextAreaElement;

        var gutter = new Compartment; // allow dynamic changing of line numbers


        var theme_compartment_sig = new Compartment;
        var theme_compartment_doc = new Compartment;
        var theme_compartment_body = new Compartment;
        
    console.log(htextArea);
        const mySignatureCodeMirror = editorFromTextArea(document.getElementById(theTextareaId + '-signature'), [EditorState.readOnly.of(true),lineNumbers()
, highlightActiveLineGutter(),
      highlightSpecialChars(),
      history(),
      foldGutter(),
      drawSelection(),
      dropCursor(),
      EditorState.allowMultipleSelections.of(true),
      indentOnInput(),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      bracketMatching(),
      closeBrackets(),
      autocompletion(),
      rectangularSelection(),
      crosshairCursor(),
      highlightActiveLine(),
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

        var myDocstringCodeMirror = editorFromTextArea(document.getElementById(theTextareaId + '-docstring'), [lineNumbers(), EditorState.readOnly.of(true), highlightActiveLineGutter(), EditorView.editorAttributes.of({class:"widget-code-input-docstring"}), gutter.of(lineNumbers()),
    //  highlightActiveLineGutter(),
      highlightSpecialChars(),
      history(),
      foldGutter(),
      drawSelection(),
      dropCursor(),
      EditorState.allowMultipleSelections.of(true),
      indentOnInput(),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      bracketMatching(),
      closeBrackets(),
      autocompletion(),
      rectangularSelection(),
      crosshairCursor(),
     // highlightActiveLine(),
      highlightSelectionMatches(),
      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...searchKeymap,
        ...historyKeymap,
        ...foldKeymap,
        ...completionKeymap,
        ...lintKeymap,
      ]), python(),theme_compartment_doc.of(basicLight)]);

        // event listener for changes to function body

        var bodyUpdateListenerCompartment = new Compartment;


        
        var myBodyCodeMirror = editorFromTextArea(document.getElementById(theTextareaId + '-body'), [gutter.of(lineNumbers()), bodyUpdateListenerCompartment.of([]), highlightActiveLineGutter(),
      highlightActiveLineGutter(),
      highlightSpecialChars(),
      history(),
      foldGutter(),
      drawSelection(),
      dropCursor(),
      EditorState.allowMultipleSelections.of(true),
      indentOnInput(),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      bracketMatching(),
      closeBrackets(),
      autocompletion(),
      rectangularSelection(),
      crosshairCursor(),
      highlightActiveLine(),
      highlightSelectionMatches(),
      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...searchKeymap,
        ...historyKeymap,
        ...foldKeymap,
        ...completionKeymap,
        ...lintKeymap,
      ]),python(),theme_compartment_body.of(basicLight)]);
//        console.log(Object.getOwnPropertyNames(myDocstringCodeMirror));

        let bodyUpdateListenerExtension = EditorView.updateListener.of((update) => {
            if (update.docChanged) {
                // Handle the event here

                console.log(myBodyCodeMirror.state.doc.toString());
                model.set("function_body",myBodyCodeMirror.state.doc.toString());
                model.save_changes();
//                           myBodyCodeMirror.dispatch({
//   changes: {from: 0, to: myBodyCodeMirror.state.doc.length, insert: model.get('function_body') }
// })
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

     console.log("linessig=%d",linesSignature)
     console.log("linesdoc=%d",linesDocstring)

     // increment line numbers in docstring text area by the number of lines in the signature
     myDocstringCodeMirror.dispatch({
 effects: gutter.reconfigure(
     lineNumbers({ formatNumber: n=>linesSignature+n }))
     });

     myBodyCodeMirror.dispatch({
 effects: gutter.reconfigure(
     lineNumbers({ formatNumber: n=>linesSignature+linesDocstring+n}))
     });

 }
        function  docstringValueChanged() {
            console.log("updating docstring");
    // Set the value from python into the CodeMirror widget in the
            // frontend.
            //cm.state.doc.toString()
            const newDocstring = '"""' + model.get('docstring') + '"""';
            console.log("newDocstring=%s",newDocstring)
            console.log("myDocstringCodeMirror.state.doc.toString()=%s",myDocstringCodeMirror.state.doc.toString())
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
//      myBodyCodeMirror.setValue(model.get('function_body'));
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
            // if (theme_string=="nord"){
            //     theme=nord;
            // } else if 
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

//        myBodyCodeMirror._backboneView=el // I think this should be widgetcodeview (i.e. domwidgetview subclass)
  //         themeChanged() {
  //   theme = model.get('code_theme');
  //   mySignatureCodeMirror.setOption('theme', theme);
  //   myDocstringCodeMirror.setOption('theme', theme);
  //   myBodyCodeMirror.setOption('theme', theme);
  // }

  // bodyChange(instance: any, changeObj: any) {
  //   // On change of the text in the code widget, send back the content
  //   // to python.
  //   // Note that this event is triggered by backbone, so "this" is
  //   // NOT this class but the window; I need to access the view by
  //   // instance._backboneView that I attached when rendering.
  //   const currentFunctionBody = instance.getValue();
  //   instance._backboneView.model.set('function_body', currentFunctionBody);
  //   instance._backboneView.touch();
  //   console.log('Done');
  // }


        var theme = model.get("code_theme")
        console.log("theme is")
        console.log(theme)
        // this must now be based on dynamic reconfiguration like in the following https://codemirror.net/examples/config/


        // Using Fetch API
        var cssText;
        //         var themecss_path='../'+theme+'.css';
//         console.log(themecss_path)
// fetch(themecss_path)
//   .then(response => {
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     return response.text();
//   })
//   .then(cssText => {
//     // Now you have the CSS text in the 'cssText' variable
//     console.log(cssText);
//   })
//   .catch(error => {
//     console.error('Error during fetch operation:', error);
//   });

        console.log(cssText)
        


        
//        setTheme(myBodyCodeMirror,nord);

        
        //      myDocstringCodeMirror.setOption('theme', this.theme);

        //     this.myBodyCodeMirror._backboneView = this; = el (the view)??





    });


    
//    model.prototype.initialize.apply(this, [attributes, options]);
//     const initialText = 'console.log("hello, world")';
//     console.log(theTextareaId);
//const targetElement = document.querySelector('#editor')!

//  class WidgetCodeModel {
//      defaults() {
                 
//     return {

//       _model_name: model.model_name,

//       value: 'Hello World',
//     };
//      }
//      initialize(){
// //         console.log(model._model_name);
//      }
//  }

//new WidgetCodeModel();
    
// new EditorView({
//   parent: el,
//   state: EditorState.create({
// //    doc: initialText,
//     extensions: [
//       lineNumbers(),
//       highlightActiveLineGutter(),
//       highlightSpecialChars(),
//       history(),
//       foldGutter(),
//       drawSelection(),
//       dropCursor(),
//       EditorState.allowMultipleSelections.of(true),
//       indentOnInput(),
//       syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
//       bracketMatching(),
//       closeBrackets(),
//       autocompletion(),
//       rectangularSelection(),
//       crosshairCursor(),
//       highlightActiveLine(),
//       highlightSelectionMatches(),
//       keymap.of([
//         ...closeBracketsKeymap,
//         ...defaultKeymap,
//         ...searchKeymap,
//         ...historyKeymap,
//         ...foldKeymap,
//         ...completionKeymap,
//         ...lintKeymap,
//       ]),
//       javascript(),
//     ],
//   }),
// })

}
export default { render };
//export default { initialize,render };
// import * as CodeMirror from 'codemirror'
// import * as lang_javascript from '@codemirror/lang-javascript'
// import * as estate from '@codemirror/state'
// // import 'codemirror/mode/css/csss';
// // import 'codemirror/mode/javascript/javascript';

//   function render({ model, el }) {
       
//               const ev  =  new CodeMirror.EditorView({doc:"test",extensions: [CodeMirror.basicSetup, lang_javascript.javascript()],
// parent: el});  

//       const newState = estate.EditorState.create({doc:"hello world!!!"})
//     ev.setState(newState)

  
//     }
// 	export default { render };

var widgets = require('@jupyter-widgets/base');
var _ = require('lodash');

// When serialiazing the entire widget state for embedding, only values that
// differ from the defaults will be specified.
var WidgetCodeModel = widgets.DOMWidgetModel.extend({
    defaults: _.extend(widgets.DOMWidgetModel.prototype.defaults(), {
        _model_name : 'WidgetCodeModel',
        _view_name : 'WidgetCodeView',
        _model_module : 'widget-code-input',
        _view_module : 'widget-code-input',
        _model_module_version : '0.1.0',
        _view_module_version : '0.1.0',
        function_name : '',
        function_parameters : '',
        docstring : '',
        function_body : '',
    }),
    initialize: function() {
        // Assign a Unique ID to this textarea; we will use it later
        // to be sure that we activate CodeMirror on the correct textarea
        widgets.DOMWidgetModel.prototype.initialize.apply(this, arguments);
        this.attributes['function_body_id'] = _.uniqueId('function_body');
    }
});

// Custom View for the textarea(s).
var WidgetCodeView = widgets.DOMWidgetView.extend({
    render: function() {

        var cssStyles = "<style>\
            .forced-indent {width: 4em;}\
            .CodeMirror {border: 1px solid #aaa; height: auto;}\
            .CodeMirror.widget-code-input-signature {border-bottom: 0px; background-color: #f7f7f7;}\
            .CodeMirror.widget-code-input-docstring {border-top: 0px; background-color: #f7f7f7;}\
            .CodeMirror.widget-code-input-body {border-top: 0px;}\
        </style>"

        var theTextareaId = this.model.get('function_body_id');
        this.el.innerHTML = 
            cssStyles +
            '<textarea id="' + theTextareaId + '-signature"></textarea>' +
            '<textarea id="' + theTextareaId + '-docstring"></textarea>' +
            '<textarea id="' + theTextareaId + '-body"></textarea>';

        var _this = this; // Backbone.js view object

        // With _.defer, we run this function after the browser had a chance 
        // to redraw what is in the DOM (the <textarea>)
        _.defer(function() {
            // Store the CodeMirror objects into the View object for future reference
            _this.mySignatureCodeMirror = CodeMirror.fromTextArea (
                document.getElementById(theTextareaId + '-signature'), {
                    lineNumbers: true,
                    firstLineNumber: 1,
                    mode: {
                        name: "python",
                        version: 3,
                        singleLineStringErrors: true,
                        matchBrackets: true
                    },
                    readOnly: true,
                    indentUnit: 4,
                    indentWithTabs: false,
                }
            );
            // Add CSS
            _this.mySignatureCodeMirror.display.wrapper.classList.add("widget-code-input-signature");
                
            _this.myDocstringCodeMirror = CodeMirror.fromTextArea (
                document.getElementById(theTextareaId + '-docstring'), {
                    lineNumbers: true,
                    //firstLineNumber: // This will be set later by changing the content, that 
                                       // indirectly calls the function to update the line numbers
                    mode: {
                        name: "python",
                        version: 3,
                        singleLineStringErrors: true,
                        matchBrackets: true
                    },
                    readOnly: true,
                    indentUnit: 4,
                    indentWithTabs: false,
                    gutters: ["CodeMirror-linenumbers", "forced-indent"],
                }
            );
            // Add CSS
            _this.myDocstringCodeMirror.display.wrapper.classList.add("widget-code-input-docstring");

            _this.myBodyCodeMirror = CodeMirror.fromTextArea (
                document.getElementById(theTextareaId + '-body'), { 
                    lineNumbers: true,
                    //firstLineNumber: // This will be set later by changing the content, that 
                                       // indirectly calls the function to update the line numbers
                    mode: {
                        name: "python", 
                        version: 3, 
                        singleLineStringErrors: true, 
                        matchBrackets: true
                    }, 
                    readOnly: false, 
                    indentUnit: 4, 
                    indentWithTabs: false, 
                    gutters: ["CodeMirror-linenumbers", "forced-indent"],
                }
            );
            // Add CSS
            _this.myBodyCodeMirror.display.wrapper.classList.add("widget-code-input-body");
            // I need to attach the backboneView, since I'm going to use
            // a CodeMirror event rather than a backboneView, but 
            // bodyChange needs to access the Backbone.js View
            _this.myBodyCodeMirror._backboneView = _this;


            // Set the initial values of the cells
            _this.signatureValueChanged();
            _this.docstringValueChanged();
            _this.bodyValueChanged();

            // When the value is changed in python, update the value in the widget
            // I set this in the 'defer' so that bodyValueChanged is called only
            // when the CodeWidget has been  rendered.
            _this.model.on('change:function_name', _this.signatureValueChanged, _this);  
            _this.model.on('change:function_parameters', _this.signatureValueChanged, _this);
            _this.model.on('change:docstring', _this.docstringValueChanged, _this);        
            _this.model.on('change:function_body', _this.bodyValueChanged, _this);        

            // For a proper CodeMirror functioning, we use CodeMirror events
            // rather than Backbone.js events.
            // Only the function_body is not read-only, so we need only this 
            // event
            _this.myBodyCodeMirror.on("change", _this.bodyChange);
        });
    },

    bodyChange: function(instance, changeObj) {
        // On change of the text in the code widget, send back the content 
        // to python.
        // Note that this event is triggered by backbone, so "this" is 
        // NOT this class but the window; I need to access the view by
        // instance._backboneView that I attached when rendering.
        var currentFunctionBody = instance.getValue();
        instance._backboneView.model.set('function_body', currentFunctionBody);
        instance._backboneView.touch();  
        console.log("Done");
    },

    signatureValueChanged: function() {
        // Set the value from python into the CodeMirror widget in the
        // frontend.
        var newSignature = "def " + this.model.get('function_name') + 
            "(" + this.model.get('function_parameters') + "):";
        if(newSignature != this.mySignatureCodeMirror.getValue()) {
            this.mySignatureCodeMirror.setValue(newSignature);
        }
        this.updateLineNumbers();
    },

    docstringValueChanged: function() {
        // Set the value from python into the CodeMirror widget in the
        // frontend.
        var newDocstring='"""'+ this.model.get('docstring') + '"""';
        if(newDocstring != this.myDocstringCodeMirror.getValue()) {
            this.myDocstringCodeMirror.setValue(newDocstring);
        }
        this.updateLineNumbers();
    },

    bodyValueChanged: function() {
        // Set the value from python into the CodeMirror widget in the
        // frontend. Update it only if the content has changed: 
        // typing re-fires this event, that would then change the content
        // of the widget, moving the cursor back to the top of the cell
        if(this.model.get('function_body') != this.myBodyCodeMirror.getValue()) {
            this.myBodyCodeMirror.setValue(this.model.get('function_body'));
        }
    },

    updateLineNumbers: function() {
        linesSignature = this.mySignatureCodeMirror.getValue().split('\n').length;
        linesDocstring = this.myDocstringCodeMirror.getValue().split('\n').length;
        this.myDocstringCodeMirror.setOption('firstLineNumber', linesSignature + 1);
        this.myBodyCodeMirror.setOption('firstLineNumber', linesDocstring + linesSignature + 1);
    }
});


module.exports = {
    WidgetCodeModel : WidgetCodeModel,
    WidgetCodeView : WidgetCodeView
};

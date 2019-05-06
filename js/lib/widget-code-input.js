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
        function_body : ''
    }),
    initialize: function() {
        widgets.DOMWidgetModel.prototype.initialize.apply(this, arguments);
        // console.log('THEID', this);
        this.attributes['function_body_id'] = _.uniqueId('function_body');
    }
});


// Custom View. Renders the widget model.
var WidgetCodeView = widgets.DOMWidgetView.extend({
    render: function() {
        var theTextareaId = this.model.get('function_body_id');
        this.el.innerHTML = '<textarea id="' + theTextareaId + '" class="function-body"></textarea>';

        var _this = this; // View object

        // Run this function after the browser had a chance to redraw
        // what is in the DOM (the <textarea>)
        _.defer(function() {
            // Store the CodeMirror object into the View object for future reference
            _this.myBodyCodeMirror = CodeMirror.fromTextArea (document.getElementById(theTextareaId), { 
                lineNumbers: true,
                firstLineNumber: 1, 
                mode: {name: "python", 
                   version: 3, 
                   singleLineStringErrors: true, 
                   matchBrackets: true}, 
                readOnly: false, 
                indentUnit: 4, 
                indentWithTabs: false, 
                gutters: ["CodeMirror-linenumbers", "forced-indent"],
            });
            // I need to attach the backboneView, since I'm going to use
            // a CodeMirror event rather than a backboneView, but 
            // bodyChange needs to access the Backbone.js View
            _this.myBodyCodeMirror._backboneView = _this;

            // Set the initial value
            _this.myBodyCodeMirror.setValue(_this.model.get('function_body'));

            // For a proper CodeMirror functioning, we use CodeMirror events
            // rather than Backbone.js events.
            _this.myBodyCodeMirror.on("change", _this.bodyChange);

            // When the value is changed in python, update the value in the widget
            // I set this in the 'defer' so that valueChanged is called only
            // when the CodeWidget has been  rendered.
            _this.model.on('change:function_body', _this.valueChanged, _this);        
        });
    },

    bodyChange: function(instance, changeObj) {
        // On change of the text in the code widget, send back the content 
        // to python.
        // Note that this event is triggered by backbone, so "this" is 
        // NOT this class but the window; I need to access the view by
        // instance._backboneView that I attached when rendering.
        var currentFunctionBody = instance.getValue();
        console.log('bodyChange', currentFunctionBody, this, instance._backboneView);
        instance._backboneView.model.set('function_body', currentFunctionBody);
        instance._backboneView.touch();  
        console.log("Done");
    },

    valueChanged: function() {
        // Set the value from python into the CodeMirror widget in the
        // frontend
        if(this.model.get('function_body') != this.myBodyCodeMirror.getValue()) {
            this.myBodyCodeMirror.setValue(this.model.get('function_body'));
        }
    }
});


module.exports = {
    WidgetCodeModel : WidgetCodeModel,
    WidgetCodeView : WidgetCodeView
};

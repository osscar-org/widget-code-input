// Copyright (c) Dou Du
// Distributed under the terms of the Modified BSD License.

import {
  DOMWidgetModel,
  DOMWidgetView,
  ISerializers,
} from '@jupyter-widgets/base';

import { MODULE_NAME, MODULE_VERSION } from './version';

// Import the CSS
import '../css/widget.css';

import * as _ from 'underscore';

// Import the CodeMirror library
import CodeMirror from 'codemirror';
import 'codemirror/mode/css/css';
import 'codemirror/mode/javascript/javascript';

// Import the css for the CodeMirror themes
import '../css/midnight.css';
import '../css/monokai.css';
import '../css/eclipse.css';
import '../css/material.css';
import '../css/solarized.css';
import '../css/idea.css';
import '../css/nord.css';

import 'codemirror/mode/python/python.js';

export class WidgetCodeModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: WidgetCodeModel.model_name,
      _model_module: WidgetCodeModel.model_module,
      _model_module_version: WidgetCodeModel.model_module_version,
      _view_name: WidgetCodeModel.view_name,
      _view_module: WidgetCodeModel.view_module,
      _view_module_version: WidgetCodeModel.view_module_version,
      value: 'Hello World',
    };
  }

  initialize() {
    DOMWidgetModel.prototype.initialize.apply(this, arguments as any);
    this.attributes['function_body_id'] = _.uniqueId('function_body');
  }

  static serializers: ISerializers = {
    ...DOMWidgetModel.serializers,
    // Add any extra serializers here
  };

  static model_name = 'WidgetCodeModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'WidgetCodeView'; // Set to null if no view
  static view_module = MODULE_NAME; // Set to null if no view
  static view_module_version = MODULE_VERSION;
}

export class WidgetCodeView extends DOMWidgetView {
  private mySignatureCodeMirror: any;
  private myDocstringCodeMirror: any;
  private myBodyCodeMirror: any;
  private theme: string = this.model.get('code_theme');
  
  render() {
    const cssStyles =
      '<style>\
            .forced-indent {width: 4em;}\
            .CodeMirror {border: 1px solid #aaa; height: auto;}\
            .CodeMirror.widget-code-input-signature {border-bottom: 0px;}\
            .CodeMirror.widget-code-input-docstring {border-top: 0px;}\
            .CodeMirror.widget-code-input-body {border-top: 0px;}\
        </style>';

    const theTextareaId = this.model.get('function_body_id');

    this.el.innerHTML =
      cssStyles +
      '<textarea id="' +
      theTextareaId +
      '-signature"></textarea>' +
      '<textarea id="' +
      theTextareaId +
      '-docstring"></textarea>' +
      '<textarea id="' +
      theTextareaId +
      '-body"></textarea>';

    const _this = this; // Backbone.js view object

    _.defer(() => {
      _this.mySignatureCodeMirror = CodeMirror.fromTextArea(
        <HTMLTextAreaElement>(
          document.getElementById(theTextareaId + '-signature')
        ),
        {
          lineNumbers: true,
          firstLineNumber: 1,
          mode: {
            name: 'python',
            version: 3,
            singleLineStringErrors: true,
            matchBrackets: true,
          },
          readOnly: true,
          indentUnit: 4,
          indentWithTabs: false,
        }
      );

      _this.mySignatureCodeMirror.setOption('theme', _this.theme);
      _this.mySignatureCodeMirror.display.wrapper.classList.add(
        'widget-code-input-signature'
      );

      _this.myDocstringCodeMirror = CodeMirror.fromTextArea(
        <HTMLTextAreaElement>(
          document.getElementById(theTextareaId + '-docstring')
        ),
        {
          lineNumbers: true,
          //firstLineNumber: // This will be set later by changing the content, that
          // indirectly calls the function to update the line numbers
          mode: {
            name: 'python',
            version: 3,
            singleLineStringErrors: true,
            matchBrackets: true,
          },
          readOnly: true,
          indentUnit: 4,
          indentWithTabs: false,
          gutters: ['CodeMirror-linenumbers', 'forced-indent'],
        }
      );
      // Add CSS
      _this.myDocstringCodeMirror.setOption('theme', _this.theme);
      _this.myDocstringCodeMirror.display.wrapper.classList.add(
        'widget-code-input-docstring'
      );

      _this.myBodyCodeMirror = CodeMirror.fromTextArea(
        <HTMLTextAreaElement>document.getElementById(theTextareaId + '-body'),
        {
          lineNumbers: true,
          //firstLineNumber: // This will be set later by changing the content, that
          // indirectly calls the function to update the line numbers
          mode: {
            name: 'python',
            version: 3,
            singleLineStringErrors: true,
            matchBrackets: true,
          },
          readOnly: false,
          indentUnit: 4,
          indentWithTabs: true,
          gutters: ['CodeMirror-linenumbers', 'forced-indent'],
        }
      );

      // Add CSS
      _this.myBodyCodeMirror.setOption('theme', _this.theme);
      _this.myBodyCodeMirror.display.wrapper.classList.add(
        'widget-code-input-body'
      );
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
      _this.model.on(
        'change:function_name',
        _this.signatureValueChanged,
        _this
      );
      _this.model.on(
        'change:function_parameters',
        _this.signatureValueChanged,
        _this
      );
      _this.model.on('change:docstring', _this.docstringValueChanged, _this);
      _this.model.on('change:function_body', _this.bodyValueChanged, _this);
      _this.model.on('change:code_theme', _this.themeChanged, _this);

      // For a proper CodeMirror functioning, we use CodeMirror events
      // rather than Backbone.js events.
      // Only the function_body is not read-only, so we need only this
      // event
      _this.myBodyCodeMirror.on('change', _this.bodyChange);
    });
  }

  themeChanged() {
    this.theme = this.model.get('code_theme');
    this.mySignatureCodeMirror.setOption('theme', this.theme);
    this.myDocstringCodeMirror.setOption('theme', this.theme);
    this.myBodyCodeMirror.setOption('theme', this.theme);
  } 

  bodyChange(instance: any, changeObj: any) {
    // On change of the text in the code widget, send back the content
    // to python.
    // Note that this event is triggered by backbone, so "this" is
    // NOT this class but the window; I need to access the view by
    // instance._backboneView that I attached when rendering.
    const currentFunctionBody = instance.getValue();
    instance._backboneView.model.set('function_body', currentFunctionBody);
    instance._backboneView.touch();
    console.log('Done');
  }

  signatureValueChanged() {
    // Set the value from python into the CodeMirror widget in the
    // frontend.
    const newSignature =
      'def ' +
      this.model.get('function_name') +
      '(' +
      this.model.get('function_parameters') +
      '):';
    if (newSignature !== this.mySignatureCodeMirror.getValue()) {
      this.mySignatureCodeMirror.setValue(newSignature);
    }
  }

  docstringValueChanged() {
    // Set the value from python into the CodeMirror widget in the
    // frontend.
    const newDocstring = '"""' + this.model.get('docstring') + '"""';
    if (newDocstring !== this.myDocstringCodeMirror.getValue()) {
      this.myDocstringCodeMirror.setValue(newDocstring);
    }
    this.updateLineNumbers();
  }

  bodyValueChanged() {
    // Set the value from python into the CodeMirror widget in the
    // frontend. Update it only if the content has changed:
    // typing re-fires this event, that would then change the content
    // of the widget, moving the cursor back to the top of the cell
    if (this.model.get('function_body') !== this.myBodyCodeMirror.getValue()) {
      this.myBodyCodeMirror.setValue(this.model.get('function_body'));
    }
  }

  updateLineNumbers() {
    const linesSignature = this.mySignatureCodeMirror
      .getValue()
      .split('\n').length;
    const linesDocstring = this.myDocstringCodeMirror
      .getValue()
      .split('\n').length;
    this.myDocstringCodeMirror.setOption('firstLineNumber', linesSignature + 1);
    this.myBodyCodeMirror.setOption(
      'firstLineNumber',
      linesDocstring + linesSignature + 1
    );
  }
}

var widget-code-input = require('./index');
var base = require('@jupyter-widgets/base');

module.exports = {
  id: 'widget-code-input',
  requires: [base.IJupyterWidgetRegistry],
  activate: function(app, widgets) {
      widgets.registerWidget({
          name: 'widget-code-input',
          version: widget-code-input.version,
          exports: widget-code-input
      });
  },
  autoStart: true
};


import ipywidgets as widgets
from traitlets import Unicode

@widgets.register
class WidgetCodeInput(widgets.DOMWidget):
    """A widget to input code in a text box, validate it and run in in a sandboxed environment."""
    _view_name = Unicode('WidgetCodeView').tag(sync=True)
    _model_name = Unicode('WidgetCodeModel').tag(sync=True)
    _view_module = Unicode('widget-code-input').tag(sync=True)
    _model_module = Unicode('widget-code-input').tag(sync=True)
    _view_module_version = Unicode('^0.1.0').tag(sync=True)
    _model_module_version = Unicode('^0.1.0').tag(sync=True)
    function_body = Unicode('').tag(sync=True)

    def __init__(self, function_body=''):
        """
        Creates a new widget
        """
        super(WidgetCodeInput, self).__init__()
        self.function_body = function_body

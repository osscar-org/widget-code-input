from __future__ import absolute_import
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
    function_name = Unicode('example').tag(sync=True)
    function_parameters = Unicode('').tag(sync=True) # TODO: validate these (these could allow for code injection)
    docstring = Unicode('\n').tag(sync=True)
    function_body = Unicode('').tag(sync=True)

    def __init__(self, function_name, function_parameters='', docstring='\n', function_body=''):
        """
        Creates a new widget to show a box to enter code.

        :param function_signature: the full function signature, for instance
           ``def test(a, b=1)``.
        :param docstring: the docstring of the function.
        :param function_body: the content of the function body.
        """
        from .utils import is_valid_variable_name

        super(WidgetCodeInput, self).__init__()

        if not is_valid_variable_name(function_name):
            raise SyntaxError("Invalid variable name '{}'".format(self.function_name))

        self.function_name = function_name
        self.function_parameters = function_parameters
        self.docstring = docstring
        self.function_body = function_body
    
    # TODO: make this property observable
    @property
    def full_function_code(self):
        from .utils import build_function

        return build_function(self.function_signature, self.docstring, self.function_body)

    # TODO: make this property observable
    @property
    def function_signature(self):
        from .utils import build_signature

        return build_signature(self.function_name, self.function_parameters)

    def get_function_object(self):
        """
        Return the compiled function object.

        This can be assigned to a variable and then called, for instance::

          func = widget.get_function_object() # This can raise a SyntaxError
          retval = func(parameters)

        :raise SyntaxError: if the function code has syntax errors (or if
          the function name is not a valid identifier)
        """
        from .utils import is_valid_variable_name

        globals_dict = {
            '__builtins__': globals()['__builtins__'],
            '__name__': '__main__',
            '__doc__': None,
            '__package__': None
        }
        
        if not is_valid_variable_name(self.function_name):
            raise SyntaxError("Invalid function name '{}'".format(self.function_name))

        # Optionally one could do a ast.parse here already, to check syntax before execution    
        exec(compile(self.function_code, __name__, 'exec', dont_inherit=True), globals_dict) 
        return globals_dict[self.function_name]

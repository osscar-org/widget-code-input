#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Dou Du.
# Distributed under the terms of the Modified BSD License.


from __future__ import absolute_import
from functools import wraps
import ipywidgets as widgets 
from ipywidgets import DOMWidget 
from traitlets import Unicode, validate, TraitError
from ._frontend import module_name, module_version 
from .utils import (
    CodeValidationError,
    build_function,
    build_signature,
    is_valid_variable_name,
    format_syntax_error_msg,
    format_generic_error_msg,
)


@widgets.register
class WidgetCodeInput(DOMWidget):
    """A widget to input code in a text box, validate it and run in in a sandboxed environment."""

    _model_name = Unicode('WidgetCodeModel').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)
    _view_name = Unicode('WidgetCodeView').tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)
    function_name = Unicode('example').tag(sync=True)
    function_parameters = Unicode('').tag(sync=True)
    docstring = Unicode('\n').tag(sync=True)
    function_body = Unicode('').tag(sync=True)
    code_theme = Unicode('').tag(sync=True)  

    @validate('function_name')
    def _valid_function_name(self, function_name):
        """
        Validate that the function name is a valid python variable name
        """
        if not is_valid_variable_name(function_name["value"]):
            raise TraitError(
                "Invalid variable name '{}'".format(function_name["value"])
            )
        return function_name["value"]

    @validate('function_parameters')
    def _valid_function_parameters(self, function_parameters):
        """
        Validate that the function parameters do not contain newlines

        These might allow string injection, and would be difficult to indent
        properly.
        """
        if '\n' in function_parameters['value']:
            raise TraitError("The function parameters cannot contain newlines")
        return function_parameters['value']

    @validate('docstring')
    def _valid_docstring(self, docstring):
        """
        Validate that the docstring do not contain triple double quotes
        """
        if '"""' in docstring['value']:
            raise TraitError('The docstring cannot contain triple double quotes (""")')
        return docstring['value']

    def __init__(  # pylint: disable=too-many-arguments
        self,
        function_name,
        function_parameters="",
        docstring="\n",
        function_body="",
        code_theme="nord",
    ):
        """
        Creates a new widget to show a box to enter code.

        :param function_name: the name of the function
        :param function_parameters: the parameters of the function (whatever
            would be within brackets in the function signature line).
            It MUST be on a single line.
        :param docstring: the docstring of the function. It cannot contain
            triple double quotes (").
        :param function_body: the content of the function body.
        :param code_theme: the code theme of the code input box.
        """
        super(WidgetCodeInput, self).__init__()
        self.function_name = function_name
        self.function_parameters = function_parameters
        self.docstring = docstring
        self.function_body = function_body
        self.code_theme = code_theme
    
    @property
    def full_function_code(self):
        """
        The full code of this function (with a default indentation of 4 spaces)
        including signature, docstring and body
        """
        return build_function(
            self.function_signature, self.docstring, self.function_body
        )

    @property
    def function_signature(self):
        """
        The function signature (first line of the function, containing 'def')
        """
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
        globals_dict = {
            "__builtins__": globals()["__builtins__"],
            "__name__": "__main__",
            "__doc__": None,
            "__package__": None,
        }

        if not is_valid_variable_name(self.function_name):
            raise SyntaxError("Invalid function name '{}'".format(self.function_name))

        # Optionally one could do a ast.parse here already, to check syntax before execution
        try:
            exec(
                compile(self.full_function_code, __name__, "exec", dont_inherit=True),
                globals_dict,
            )
        except SyntaxError as exc:
            raise CodeValidationError(
                format_syntax_error_msg(exc), orig_exc=exc
            ) from exc

        function_object = globals_dict[self.function_name]

        def catch_exceptions(func):
            @wraps(func)
            def wrapper(*args, **kwargs):
                """Wrap and check exceptions to return a longer and clearer exception."""

                try:
                    return func(*args, **kwargs)
                except Exception as exc:
                    err_msg = format_generic_error_msg(exc, code_widget=self)
                    raise CodeValidationError(err_msg, orig_exc=exc) from exc

            return wrapper

        return catch_exceptions(function_object)

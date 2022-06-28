import ast
import sys
import traceback


class CodeValidationError(Exception):
    """Class raised when there is an exception within a WidgetCodeInput."""

    def __init__(self, msg, orig_exc):
        super().__init__(msg)
        self.orig_exc = orig_exc


def is_valid_variable_name(name):
    """
    Check if the value specified is a valid variable name (e.g. to
    validate the function name)

    :return: True if the name is valid, False otherwise
    """
    try:
        ast.parse("{} = None".format(name))
        return True
    except (SyntaxError, ValueError, TypeError):
        return False


def prepend_indent(string, indent_level):
    """
    Add a given indent before every line of the string

    :string: string to which we want to append the indent
    :indent_level: integer number of spaces to prepend
    """
    indented = "".join(
        "{}{}\n".format(" " * indent_level, line) for line in string.splitlines()
    )
    return indented


def build_pre_body(signature, docstring, indent_level=4):
    """
    Prepare the part of the function before the function body
    (function signature and unindented docstring)

    :param signature: the signature line
    :param docstring: the (unindented) docstring
    :param indent_level: integer number of spaces to prepend to the docstring
    """
    if '"""' in docstring:
        raise ValueError('Triple double quotes (""") not allowed in docstring')

    return "{}\n{}".format(
        signature,
        prepend_indent('"""{}"""'.format(docstring), indent_level=indent_level),
    )


def build_function(signature, docstring, body, indent_level=4):
    """
    Return the full function content

    :param signature: the signature line
    :param docstring: the (unindented) docstring
    :param docstring: the (unindented) function body
    :param indent_level: integer number of spaces to prepend to the docstring and function body
    """
    # I don't append a "\n" inbetween becuase prepend_indent (called internally)
    # adds already a \n at the end of each line
    return "{}{}".format(
        build_pre_body(signature, docstring, indent_level=indent_level),
        prepend_indent(body, indent_level=indent_level),
    )


def build_signature(function_name, function_parameters):
    """
    Given the function name and function parameters, returns the signature line

    :param function_name: the name of the function
    :param function_parameters: the parameters of the function (whatever would be
      within the brackets)
    """
    return "def {}({}):".format(function_name, function_parameters)


def format_syntax_error_msg(exc):
    """
    Return a string reproducing the output of a SyntaxError.

    :param exc: The exception that is being processed.
    """
    se_args = exc.args[1]
    return f"""SyntaxError in code input: {exc.args[0]}
File "{se_args[0]}", line {se_args[1]}
{se_args[3]}{' ' * max(0, se_args[2] - 1)}^
"""


def format_generic_error_msg(exc, code_widget):
    """
    Return a string reproducing the traceback of a typical error.
    This includes line numbers, as well as neighboring lines.

    It will require also the code_widget instance, to get the actual source code.

    :note: this must be called from withou the exception, as it will get the current traceback state.

    :param exc: The exception that is being processed.
    :param code_widget: the instance of the code widget with the code that raised the exception.
    """
    error_class, _, tb = sys.exc_info()
    line_number = traceback.extract_tb(tb)[-1][1]
    code_lines = code_widget.full_function_code.splitlines()

    err_msg = f"{error_class.__name__} in code input: {str(exc)}\n"
    if line_number > 2:
        err_msg += f"     {line_number - 2:4d} {code_lines[line_number - 3]}\n"
    if line_number > 1:
        err_msg += f"     {line_number - 1:4d} {code_lines[line_number - 2]}\n"
    err_msg += f"---> {line_number:4d} {code_lines[line_number - 1]}\n"
    if line_number < len(code_lines):
        err_msg += f"     {line_number + 1:4d} {code_lines[line_number]}\n"
    if line_number < len(code_lines) - 1:
        err_msg += f"     {line_number + 2:4d} {code_lines[line_number + 1]}\n"

    return err_msg

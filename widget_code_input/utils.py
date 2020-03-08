import ast
#from xml.sax.saxutils import escape

def is_valid_variable_name(name):
    """
    Check if the value specified is a valid variable name (e.g. to 
    validate the function name)

    :return: True if the name is valid, False otherwise
    """
    try:
        ast.parse('{} = None'.format(name))
        return True
    except (SyntaxError, ValueError, TypeError):
        return False

def prepend_indent(string, indent_level):
    """
    Add a given indent before every line of the string

    :string: string to which we want to append the indent
    :indent_level: integer number of spaces to prepend
    """
    indented = "".join("{}{}\n".format(" "*indent_level, line) for line in string.splitlines())
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
        prepend_indent(body, indent_level=indent_level)
    )

def build_signature(function_name, function_parameters):
    """
    Given the function name and function parameters, returns the signature line

    :param function_name: the name of the function
    :param function_parameters: the parameters of the function (whatever would be
      within the brackets)
    """
    return "def {}({}):".format(function_name, function_parameters)

# def build_function_signature(function_name, args, defaults=None, varargs=None, keywords=None):
#     """
#     For the following function:
    
#     def fn(a, b, c=1, d="a", *args):
#         pass
        
#     we have:
    
#     - function_name = "fn"
#     - args = ['a', 'b', 'c', 'd']
#     - defaults = [1, 'a']
#     - varargs = 'args'
#     - keywords = None
    
#     For now, defaults are not implemented (they require e.g. to convert a string to its python representation with quotes)
#     """
#     assert is_valid_variable_name(function_name)
#     for arg in args:
#         assert is_valid_variable_name(function_name)
#     if varargs is not None:
#         assert is_valid_variable_name(varargs)
#     if keywords is not None:
#         assert is_valid_variable_name(keywords)        

#     mangled_args = [arg for arg in args] # here one could put the logic for defaults as well
#     if varargs is not None:
#         mangled_args.append('*{}'.format(varargs))
#     if keywords is not None:
#         mangled_args.append('*{}'.format(keywords))        
    
#     args_string = ", ".join(args)
        
#     signature="def {}({}):".format(function_name, args_string)
#     return signature

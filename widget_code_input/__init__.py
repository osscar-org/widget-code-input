from ._version import version_info, __version__

from .widget_code_input import *

def _jupyter_nbextension_paths():
    return [{
        'section': 'notebook',
        'src': 'static',
        'dest': 'widget-code-input',
        'require': 'widget-code-input/extension'
    }]

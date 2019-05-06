widget-code-input
===============================

A widget to allow input of a python function, with syntax highlighting

Try it live!
------------
[![Binder](https://mybinder.org/badge.svg)](https://mybinder.org/v2/gh/osscar-org/widget-code-input/master?urlpath=apps/demos/index.ipynb)

Installation
------------

To install use pip:

    $ pip install widget_code_input
    $ jupyter nbextension enable --py --sys-prefix widget_code_input


For a development installation (requires npm),

    $ git clone https://github.com/osscar-org/widget-code-input.git
    $ cd widget-code-input
    $ pip install -e .
    $ jupyter nbextension install --py --symlink --sys-prefix widget_code_input
    $ jupyter nbextension enable --py --sys-prefix widget_code_input

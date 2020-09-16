
# widget-code-input

A widget to allow input of a python function, with syntax highlighting.

## Try it with Binder !

* Simple usage of the widget code input

[![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/osscar-org/widget-code-input/master?urlpath=%2Flab%2Ftree%2Fexamples%2Fintroduction.ipynb)

* Impact distance of a projectile ( a exmaple for using the widget-code-input for a educational notebook )

[![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/osscar-org/widget-code-input/develop?urlpath=%2Fapps%2Fdemos%2Fprojectile-notebook.ipynb)

## Installation

You can install using `pip`:

```bash
pip install widget_code_input
```

Or if you use jupyterlab:

```bash
pip install widget_code_input
jupyter lab build
```

If you are using Jupyter Notebook 5.2 or earlier, you may also need to enable
the nbextension:
```bash
jupyter nbextension enable --py [--sys-prefix|--user|--system] widget_code_input
```
There are seven different code themes can be chosen. They are "eclipse",
"idea", "material", "midnight", "monokai", "nord" and "solarized".
You can check the appearance of the code themes at:

[https://codemirror.net/demo/theme.html](https://codemirror.net/demo/theme.html)


# Acknowlegements

We acknowledge support from:
* EPFL Open Science Fund

<img src='./OSSCAR-logo.png' width='300'>

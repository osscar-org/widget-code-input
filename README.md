
# widget-code-input

[![Build Status](https://travis-ci.org/osscar-org/widget-code-input.svg?branch=master)](https://travis-ci.org/osscar-org/widget_code_input)
[![codecov](https://codecov.io/gh/osscar-org/widget-code-input/branch/master/graph/badge.svg)](https://codecov.io/gh/osscar-org/widget-code-input)


A widget to allow input of a python function, with syntax highlighting.

## Installation

You can install using `pip`:

```bash
pip install widget_code_input
```

Or if you use jupyterlab:

```bash
pip install widget_code_input
jupyter labextension install @jupyter-widgets/jupyterlab-manager
```

If you are using Jupyter Notebook 5.2 or earlier, you may also need to enable
the nbextension:
```bash
jupyter nbextension enable --py [--sys-prefix|--user|--system] widget_code_input
```

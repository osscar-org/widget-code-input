
# widget-code-input


[![PyPI version](https://badge.fury.io/py/widget-code-input.svg)](https://badge.fury.io/py/widget-code-input)
[![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/osscar-org/widget-code-input/main?labpath=%2Fexamples%2FWidget_Demo.ipynb)
[![widget test](https://github.com/osscar-org/widget-code-input/actions/workflows/widget-test.yml/badge.svg)](https://github.com/osscar-org/widget-code-input/actions/workflows/widget-test.yml)
[![screenshot comparison](https://github.com/osscar-org/widget-code-input/actions/workflows/screenshot-comparison.yml/badge.svg)](https://github.com/osscar-org/widget-code-input/actions/workflows/screenshot-comparison.yml)

A widget to allow input of a python function, with syntax highlighting.


## Installation

You can install using `pip`:

```bash
pip install widget_code_input
```

### Releasing and publishing a new version

In order to make a new release of the library and publish to PYPI, run

```bash
bumpver update --major/--minor/--patch
```

This will

- update version numbers, make a corresponding `git commit` and a `git tag`;
- push this commit and tag to Github, which triggers the Github Action that makes a new Github Release and publishes the package to PYPI.

### Github workflow testing

[![widget test](https://github.com/osscar-org/widget-code-input/actions/workflows/widget-test.yml/badge.svg)](https://github.com/osscar-org/widget-code-input/actions/workflows/widget-test.yml)



If the `widget test` fails, it indicates there is something wrong with the code, and the widget is NOT
being displayed correctly in the test.

[![screenshot comparison](https://github.com/osscar-org/widget-code-input/actions/workflows/screenshot-comparison.yml/badge.svg)](https://github.com/osscar-org/widget-code-input/actions/workflows/screenshot-comparison.yml)


If the `widget test` passes but the `screenshot comparison` fails, it indicates the appearance of the widget 
is different from the previous version. In this case, you'll need to manually download the artifact from 
the `widget test` and use it to replace the `widget-sample.png` figure in the `test` folder.

## Acknowledgements

We acknowledge support from the EPFL Open Science Fund via the [OSSCAR](http://www.osscar.org) project.

<img src='https://www.osscar.org/_images/logos.png' width='700'>

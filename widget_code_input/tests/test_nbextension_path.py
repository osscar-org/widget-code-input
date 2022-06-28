#!/usr/bin/env python
# coding: utf-8
# Copyright (c) Giovanni Pizzi and Dou Du.
# Distributed under the terms of the Modified BSD License.
from widget_code_input import _jupyter_nbextension_paths


def test_nbextension_path():
    # Check that magic function can be imported from package root:

    # Ensure that it can be called without incident:
    path = _jupyter_nbextension_paths()
    # Some sanity checks:
    assert len(path) == 1
    assert isinstance(path[0], dict)

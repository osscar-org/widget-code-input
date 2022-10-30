#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Dou Du.
# Distributed under the terms of the Modified BSD License.

import pytest

from ..widget_code_input import WidgetCodeInput


def test_example_creation_blank():
    w = WidgetCodeInput(function_name = 'my_function')
    assert w.function_name == 'my_function'

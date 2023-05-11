#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Dou Du and Giovanni Pizzi.
# Distributed under the terms of the Modified BSD License.

import pytest

from ..widget_code_input import WidgetCodeInput


def test_example_creation_blank():
    w = WidgetCodeInput()
    assert w.value == 'Hello World'

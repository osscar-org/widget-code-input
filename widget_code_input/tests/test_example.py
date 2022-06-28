#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Giovanni Pizzi and Dou Du.
# Distributed under the terms of the Modified BSD License.

from widget_code_input import WidgetCodeInput


def test_example_creation():
    w = WidgetCodeInput(
        function_name="my_f",
        function_parameters="a, b=1",
        docstring="some\nmultiline",
        function_body="c = a+b\nreturn c",
    )

    assert w.function_body == "c = a+b\nreturn c"

    expected_body = f'''def my_f(a, b=1):
    """some
    multiline"""
    c = a+b
    return c
'''
    assert w.full_function_code == expected_body


def test_example_running():
    function_name = "my_f"
    function_parameters = "a, b=1"
    docstring = "some\nmultiline"
    function_body = "c = a+b\nreturn c"

    w = WidgetCodeInput(
        function_name=function_name,
        function_parameters=function_parameters,
        docstring=docstring,
        function_body=function_body,
    )

    f = w.get_function_object()
    assert f(1, 2) == 3

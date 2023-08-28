import pytest

from ..widget_code_input import WidgetCodeInput, CodeValidationError

class TestWidgetCodeInput:
    wci_code = WidgetCodeInput(
            function_name="test_function",
            function_parameters="x",
            code_theme = "default",
            function_body="return a*sin(w*x)"
    )

    def test_wrong_nb_input_args(self):
        with pytest.raises(CodeValidationError, match=r".*def test_function\(x\):.*"):
            # only accepts one argument but we hand two
            self.wci_code.get_function_object()(1,1)


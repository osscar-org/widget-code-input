# hello_widget/__init__.py
import pathlib
import anywidget
import traitlets

# bundler yields hello_widget/static/{index.js,styles.css}
bundler_output_dir = pathlib.Path(__file__).parent / "hello_widget/static"


class CounterWidget(anywidget.AnyWidget):
    _esm = bundler_output_dir / "index.js"
    _css = bundler_output_dir / "styles.css"
    name = traitlets.Unicode().tag(sync=True)

    count = traitlets.Int(0).tag(sync=True)


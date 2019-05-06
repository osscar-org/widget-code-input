#!/bin/bash

#cd js
#npm install
#cd ..
pip install -e .
jupyter nbextension install --py --symlink --sys-prefix widget_code_input
jupyter nbextension enable --py --sys-prefix widget_code_input

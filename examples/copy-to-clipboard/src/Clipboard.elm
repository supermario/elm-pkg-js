module Clipboard exposing (..)

import Ports


copy : String -> Cmd msg
copy =
    Ports.supermario_copy_to_clipboard_to_js

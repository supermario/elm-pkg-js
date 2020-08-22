port module Ports exposing (..)

-- This file is an example of what `elm-pkg-js` would generate for the user


ports =
    { supermario_copy_to_clipboard_to_js = supermario_copy_to_clipboard_to_js
    }


port supermario_copy_to_clipboard_to_js : String -> Cmd msg

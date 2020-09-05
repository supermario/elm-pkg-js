module PkgPorts exposing (..)

-- This file is an example of what `elm-pkg-js` would generate for the user

import Audio
import Json.Encode


ports =
    { martinsstewart_elm_audio_to_js = martinsstewart_elm_audio_to_js
    , martinsstewart_elm_audio_from_js = martinsstewart_elm_audio_from_js
    }


port martinsstewart_elm_audio_to_js : Json.Encode.Value -> Cmd (Audio.Msg msg)


port martinsstewart_elm_audio_from_js : (Json.Encode.Value -> Audio.Msg msg) -> Sub (Audio.Msg msg)

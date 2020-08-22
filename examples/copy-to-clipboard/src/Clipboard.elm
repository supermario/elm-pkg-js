module Clipboard exposing (..)

{-| Provides a simple way to hook up Javascript copy-to-clipboard functionality

@docs copy

-}


type alias PkgPorts ports msg =
    { ports | supermario_copy_to_clipboard_to_js : String -> Cmd msg }


{-| Copy a String to the clipboard

    import PkgPorts exposing (ports)


    -- In your update function
    update msg model =
        case msg of
            SomeMsg ->
                ( model, copy ports "some string" )

-}
copy : PkgPorts a msg -> String -> Cmd msg
copy ports =
    ports.supermario_copy_to_clipboard_to_js

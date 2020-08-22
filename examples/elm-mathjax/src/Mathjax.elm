module Mathjax exposing (..)

import Html exposing (Attribute, Html)
import Html.Attributes as HA
import Json.Encode


mathText : String -> Html msg
mathText content =
    Html.node "math-text"
        [ HA.property "content" (Json.Encode.string content) ]
        []


mathTextDelayed : String -> Html msg
mathTextDelayed content =
    Html.node "math-text-delayed"
        [ HA.property "content" (Json.Encode.string content) ]
        []

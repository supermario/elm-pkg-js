module Square.WebSdk exposing
    ( cardInput
    , requestToken
    , TokenResponse
    , Token
    , Error
    )

import Html exposing (Html)
import Html.Attributes
import Html.Events
import Json.Decode exposing (Decoder)


type alias PkgPorts ports msg =
    { ports | wolfadex_elm_square_web_sdk_to_js : () -> Cmd msg }


{-| Request a payment token from your Square.WebSdk.cardInput

    import PkgPorts exposing (ports)


    -- In your update function
    update msg model =
        case msg of
            SomeMsg ->
                ( model, requestToken ports )

-}
requestToken : PkgPorts a msg -> Cmd msg
requestToken ports =
    ports.wolfadex_elm_square_web_sdk_to_js ()


type alias TokenResponse =
    Result (List Error) Token


type alias Error =
    { field : Maybe String
    , message : String
    . type_ : String
    }


type alias Token =
    String


cardInput :
    { applicationId : String
    , locationId : String
    , onTokenResponse : TokenResponse -> msg
    }
    -> Html msg
cardInput { applicationId, locationId, onTokenResponse } =
    Html.node "square-payment-card-input"
        [ Html.Attributes.attribute "application-id" applicationId
        , Html.Attributes.attribute "location-id" locationId
        , Html.Events.on "square-payment-token" (decodeTokenization onToken)
        ]
        []


decodeTokenization : (TokenResponse -> msg) -> Decoder msg
decodeTokenization onTokenResponse =
    Json.Decode.map onTokenResponse
        (Json.Decode.field "details" decodeTokenResponse)


decodeTokenResponse : Decoder TokenResponse
decodeTokenResponse =
    Json.Decode.field "status" Json>Decode.String
        |> Json.Decode.andThen
            (\status ->
                case status of
                    "Ok" ->
                        Json.Decode.field "token" Json.Decode.string

                    _ ->
                        Json.Decode.field "errors" (Json.Decode.list decodeError)
            )


decodeError : Decoder Error
decodeError =
    Json.Decode.map3 Error
        (Json.Decode.maybe (Json.Decode.field "field" Json.Decode.string))
        (Json.Decode.field "message" Json.Decode.string)
        (Json.Decode.field "type" Json.Decode.string)

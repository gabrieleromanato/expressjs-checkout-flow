"use strict";

(function( $ ) {
    function login() {
        var $loginForm = $( "#login-form" );
        if( $loginForm.length ) {
            $loginForm.on( "submit", function( e ) {
                e.preventDefault();
                $loginForm.find( ".msg" ).remove();

                $.post( "/login", $loginForm.serialize(), function( res ) {
                    if( res.errors ) {
                        $.each( res.errors, function( i, err ) {
                            $loginForm.find( "[name=" + err.param + "]" ).
                            after( '<div class="msg error">' + err.msg + '</div>' );
                        });
                    } else {
                        window.location = "/billing-shipping";
                    }
                });
            });
        }
    }

    function register() {
        var $registerForm = $( "#register-form" );
        if( $registerForm.length ) {
            $registerForm.on( "submit", function( e ) {
                e.preventDefault();
                $registerForm.find( ".msg" ).remove();

                $.post( "/register", $registerForm.serialize(), function( res ) {
                    if( res.errors ) {
                        $.each( res.errors, function( i, err ) {
                            $registerForm.find( "[name=" + err.param + "]" ).
                            after( '<div class="msg error">' + err.msg + '</div>' );
                        });
                    } else {
                        window.location = "/billing-shipping";
                    }
                });
            });
        }
    }

    function sameAs() {
        var $check = $( "#same-as" );
        if( $check.length ) {
            $check.on( "change", function() {
                if( $( this ).prop( "checked" ) ) {
                    $( "#shipping" ).hide();
                } else {
                    $( "#shipping" ).show();
                }
            });
        }
    }

    function billingAndShipping() {
        var $billingShippingForm = $( "#billing-shipping-form" );
        if( $billingShippingForm.length ) {
            $billingShippingForm.on( "submit", function( e ) {
                e.preventDefault();
                $billingShippingForm.find( ".msg" ).remove();

                $.post( "/billing-shipping", $billingShippingForm.serialize(), function( res ) {
                    if( res.errors ) {
                        $.each( res.errors, function( i, err ) {
                            $billingShippingForm.find( "[name=" + err.param + "]" ).
                            after( '<div class="msg error">' + err.msg + '</div>' );
                        });
                    } else {
                        window.location = "/payment";
                    }
                });
            });
        }
    }

    $(function() {
        login();
        register();
        sameAs();
        billingAndShipping();
    });
})( jQuery );
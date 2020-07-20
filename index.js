var factIndex = 0;
const Alexa = require('ask-sdk-core');
const myDocument = require('./main.json');
const SKILL_NAME = 'Love indie Art';
var randomFact = "";
var speechOutput1 = "";
var speechOutput = "";
var speechOutput2 = "";
var data = [];
var body = [];
var factArr = [];
const GET_ART_MESSAGE = 'Here\'s an art: ';
const HELP_MESSAGE = 'You can say show me an art piece, or, say next to show the next art piece , or say Amazon Pay to pay for art, or you can say stop to exit. If you need a specific art , e-mail the title number, and your e-mail address to loveindieart@gmail.com to get a printed copy shipped to your address. What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye! Live well, eat and sleep well. ';

  const AWS = require('aws-sdk');
 var s3 = new AWS.S3({ accessKeyId: process.env.AWS_ID, secretAccessKey: process.env.AWS_KEY});
   // get reference to S3 client
// var s3 = new AWS.S3();

     var getParams = {
         Bucket: 'loveindieart',
         Key: 'art/artists.rtf'
     };

//  new AWS.S3().getObject(
   

// console.log("global data",data)

const LaunchFactHandler = {
     canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'LaunchRequest' || request.type==='Alexa.Presentation.APL.UserEvent' ;
      },
     handle(handlerInput) {
        const introtext = "Welcome to Love indie art. You can say 'Show me an art piece' to get a new art by indie developers. You can say 'help' for help. You can also say Amazon pay to buy Love indie art by making a one time payment of $25.00 to get a print copy of art shipped. Keep smiling and continue loving art. ";
           
         if (supportsAPL(handlerInput))
            {
                 return handlerInput.responseBuilder
                   .speak("Welcome to Love indie Art. You can say 'Show me an art piece' to get a new art by indie developers. You can say 'help' for help. You can also say Amazon pay to buy Love indie art by making a one time payment of $25.00 to get a print copy of art shipped. Keep smiling and continue loving art. ")
                   .withSimpleCard('Love indipendent artists', introtext)
                   .addDirective({
                             type: 'Alexa.Presentation.APL.RenderDocument',
                             version: '1.0',
                             document: myDocument,
                             datasources: {
                               response: {
                                 text: introtext,
                                 title: "",
                                 url:"https://awarenessmusic.s3.amazonaws.com/art/art.png" ,
                                 logo:"https://awarenessmusic.s3.amazonaws.com/art/kidzlearnapps.png"
                               },
                             },
                           })
                    .withShouldEndSession(false)
                   .getResponse();
            }
            else{
                return handlerInput.responseBuilder
                     .speak(introtext)
                     .reprompt("say 'get a Love indie Art' or say help")
                     .withSimpleCard(SKILL_NAME,introtext)
                     .withShouldEndSession(false)
                     .getResponse();
                
               }
               },
             };

const GetNewArtHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return  (request.type === 'IntentRequest'
        && request.intent.name === 'GetNewArtIntent' || request.type==='Alexa.Presentation.APL.UserEvent');
  },
  handle(handlerInput) {
         factIndex = factIndex + 1
    
    url = s3.getSignedUrl('getObject', {
         Bucket: 'awarenessmusic',
         Key: 'art'+(factIndex - 1)+'.png',
        // Expires: signedUrlExpireSeconds
     })
    
      s3.getObject(
              { Bucket: 'loveindieart', Key: 'artists'+(factIndex - 1).toString()},
              function(err, data1) {
                if (!err) {
                    console.log("key",'art/artists'+factIndex.toString())
                    body = Buffer.from(data1.Body).toString();
                    factArr = body;
                    speechOutput1 = GET_ART_MESSAGE + factArr ;
                }
          
              if (err)
              {
                  factIndex = 0;
                 speechOutput1 = " You are done with all the artists. You can now say 'next' to repeat or say 'Amazon Pay' to donate or say 'stop' to exit. ";
              }
               console.log("speech in",speechOutput,factIndex)
            }); // s3
   // const responseBuilder = handlerInput.responseBuilder;
         if (speechOutput1 != "")
      {
          if ((factIndex - 1) == 0)
          {
              speechOutput = speechOutput1
              speechOutput3 = speechOutput
          }
          else
          {
              speechOutput = "Title Number" + " " + (factIndex - 1) + ". " + speechOutput1;
              speechOutput3 = "";
          }
       // factIndex1 = factIndex;
      }
      else
      {
         
              speechOutput =  "Once you make a fixed payment of $25.00 via Amazon Pay, we will send you an art piece. If you prefer a specific art piece, please send the title number, the artist name and your Amazon Pay account e-mail address to loveindieart@gmail.com. You will get your requested print shipped as soon as possible. Let's begin..say 'next' to look at the art pieces. ";
            speechOutput3 = speechOutput
         // factIndex1 = factIndex - 1;
      }
        console.log("speech",speechOutput1,factIndex)
      if(supportsAPL(handlerInput))
      {
          return handlerInput.responseBuilder
          .speak(speechOutput)
          .withSimpleCard('Love indie Art', speechOutput3)
          .addDirective({
                        type: 'Alexa.Presentation.APL.RenderDocument',
                        version: '1.0',
                        document: myDocument,
                        datasources: {
                        response: {
                       
                        text: speechOutput3,
                        title: "Love indie Art",
                        url: url,
                        logo:"https://awarenessmusic.s3.amazonaws.com/kidzlearnapps.png"
                        },
                        },
                        })
          .getResponse();
      }
    else{
                   return handlerInput.responseBuilder
                        .speak(speechOutput3 + "Say next for the next art or say stop. ")
                        .reprompt("Say next for the next art or say stop. ")
                        .withSimpleCard(SKILL_NAME,speechOutput3 + "Say next for the next art or say stop. ")
                        .getResponse();
                   
                  }
  

  },
};
function supportsAPL(handlerInput) {
  const supportedInterfaces = handlerInput.requestEnvelope.context
    .System.device.supportedInterfaces;
  const aplInterface = supportedInterfaces['Alexa.Presentation.APL'];
  return aplInterface != null && aplInterface !== undefined;
}
const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent' || request.type==='Alexa.Presentation.APL.UserEvent');
  },
  handle(handlerInput) {
    if(supportsAPL(handlerInput))
       {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
    //  .reprompt(HELP_REPROMPT)
      .withSimpleCard('Love indie Art', HELP_MESSAGE)
      .addDirective({
           type: 'Alexa.Presentation.APL.RenderDocument',
           version: '1.0',
           document: myDocument,
           datasources: {
             response: {
               text: HELP_MESSAGE,
               title: "",
               url:"https://awarenessmusic.s3.amazonaws.com/art/art0.png" ,
               logo:"https://awarenessmusic.s3.amazonaws.com/kidzlearnapps.png"
             },
           },
         })
      .getResponse();
    } // if supports APL
      else
      {
            return handlerInput.responseBuilder
            .speak(HELP_MESSAGE)
            .reprompt(HELP_MESSAGE)
            .withSimpleCard(SKILL_NAME,HELP_MESSAGE)
            .getResponse();
                     
        }
              
  },
};


function handleErrors1(statusCode, handlerInput ) {

      return handlerInput.responseBuilder
            .speak(" There's a problem with the payment method on your account. Please go to Amazon and update your payment method. After updating say 'Amazon Pay' for payment or say 'next' to continue seeing art or say 'stop' to exit. ")
            .getResponse();
  
}


function getSimulationString(type) {
    let simulationString = '';

    switch( type ) {
        case 'InvalidPaymentMethod':
            // PaymentMethodUpdateTimeInMins only works with Async authorizations to change BA back to OPEN; Sync authorizations will not revert
            simulationString = '{ "SandboxSimulation": { "State":"Declined", "ReasonCode":"InvalidPaymentMethod", "PaymentMethodUpdateTimeInMins":1, "SoftDecline":"true" } }';
            break;

        case 'AmazonRejected':
            simulationString = '{ "SandboxSimulation": { "State":"Declined", "ReasonCode":"AmazonRejected" } }';
            break;

        case 'TransactionTimedOut':
            simulationString = '{ "SandboxSimulation": { "State":"Declined", "ReasonCode":"TransactionTimedOut" } }';
            break;
            
        default:
            simulationString = '';
    }

    return simulationString;
}

// Sometimes you just need a random string, right?
function generateRandomString(length) {
    let randomString     = '';
    const stringValues     = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for ( let i = 0; i < length; i++ )
        randomString += stringValues.charAt( Math.floor( Math.random( ) * stringValues.length ) );

    return randomString;
}


function handleErrors( handlerInput ) {
    let   errorMessage                     = '';
    let   permissionsError                 = false;
    const actionResponseStatusCode         = handlerInput.requestEnvelope.request.status.code;
    const actionResponseStatusMessage      = handlerInput.requestEnvelope.request.status.message;
    const actionResponsePayloadMessage     = handlerInput.requestEnvelope.request.payload.errorMessage;

    switch ( actionResponseStatusMessage ) {
        // Permissions errors - These must be resolved before a user can use Amazon Pay
        case 'ACCESS_DENIED':
        case 'ACCESS_NOT_REQUESTED':  // Amazon Pay permissions not enabled
        case 'MissingPermissionsToAccessResource':
        case 'FORBIDDEN':
        case 'VoicePurchaseNotEnabled':     // Voice Purchase not enabled     TODO: Add this to documentation
            permissionsError     = true;
            errorMessage         = 'To make purchases in this skill, you need to enable Amazon Pay and turn on voice purchasing. To help, a card has been sent to your Alexa app.';
            break;

        // Integration errors - These must be resolved before Amazon Pay can run
        case 'BuyerEqualsSeller':
        case 'ReleaseEnvironmentNotAllowed':
        case 'InvalidBillingAgreementType':
        case  'InvalidSubscriptionAmount':
        case 'InvalidParameterValue':
        case 'InvalidSandboxCustomerEmail':
        case 'InvalidSellerId':
        case 'MissingSkillManifestData':
        case 'UnauthorizedAccess':
        case 'UnsupportedCountryOfEstablishment':
        case 'UnsupportedCurrency':

        // Runtime errors - These must be resolved before a charge action can occur
        case 'DuplicateRequest':
        case 'InternalServerError':
        case 'InvalidAuthorizationAmount':
        case 'InvalidBillingAgreementId':
        case 'InvalidBillingAgreementStatus':
        case 'InvalidPaymentAction':
        case 'PeriodicAmountExceeded':
        case 'ProviderNotAuthorized':
        case 'ServiceUnavailable':
        //    errorMessage = `There was an error. ${actionResponseStatusCode} ${actionResponseStatusMessage} ${actionResponsePayloadMessage} Love indie Art sent a card requesting permission. Please enable Amazon Pay permission in Alexa app. `;
          //  permissionsError     = true;
            errorMessage = ` ${actionResponseStatusMessage} ${actionResponsePayloadMessage} `;
                            
            break;

        default:
            errorMessage = " ";
            break;
    }

    debug( handlerInput );

    // If it is a permissions error send a permission consent card to the user, otherwise .speak() error to resolve during testing
    if ( permissionsError ) {
       
      
        
        return handlerInput.responseBuilder
            .speak( errorMessage )
            .withShouldEndSession(false)
            .withAskForPermissionsConsentCard("Love Indie Art requests permission for Amazon Pay. ")
            .getResponse( );
       
    }
        
       else
       {
        
            return handlerInput.responseBuilder
            .speak( errorMessage )
             .withShouldEndSession(true)
            .getResponse( );
       }
    
}


const SetUpHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === "IntentRequest" &&
            handlerInput.requestEnvelope.request.intent.name === "SetupPaymentIntent";
    },
    handle(handlerInput) {
           let directiveObject = {
            "type": "Connections.SendRequest",
            "name": "Setup",
            "payload": {
                "@type": "SetupAmazonPayRequest",
                "@version": "2",
                "sellerId": "seller-id",  // Input the Amazon seller-id
                "countryOfEstablishment": "US",
                "ledgerCurrency": "USD",
                "checkoutLanguage": "en_US",
                "sandboxMode": true,
                "sandboxCustomerEmailId":"loveindieart+sandbox@gmail.com",
                "billingAgreementAttributes": {
                    "@type": "BillingAgreementAttributes",
                    "@version": "2",
                    "billingAgreementType": "CustomerInitiatedTransaction",//EU merchants only
                   // "sellerNote": "Thanks for the donation. ",
                    "sellerBillingAgreementAttributes": {
                        "@type": "SellerBillingAgreementAttributes",
                        "@version": "2",
                        "sellerBillingAgreementId": "ART-Kidz12345",
                        "storeName": "Love indie Art",
                        "customInformation": "Love indie Art - Help Art Survive. "
                    }
                },
                "needAmazonShippingAddress": true
            },
            "token": "correlationToken"
        };
       return handlerInput.responseBuilder
       // .speak("setup done.")
        .addDirective(directiveObject)
        .withShouldEndSession(true)
        .getResponse();
    }
};


const ConnectionsSetupResponseHandler = {
                           canHandle(handlerInput) {
                               return handlerInput.requestEnvelope.request.type === "Connections.Response"
                               && handlerInput.requestEnvelope.request.name === "Setup";
                           },
                           handle(handlerInput) {
                          //     const actionResponsePayload = handlerInput.requestEnvelope.request.payload;
                          //     const actionResponseStatusCode = handlerInput.requestEnvelope.request.status.code;
                               
                               const connectionResponsePayload     = handlerInput.requestEnvelope.request.payload;
                               const connectionResponseStatusCode  = handlerInput.requestEnvelope.request.status.code;
                               
                             console.log("connectionResponsePayload",connectionResponsePayload)
                              console.log("connectionResponseStatusCode",connectionResponseStatusCode)
                            
                               if ((handlerInput.requestEnvelope.request.status.code) != 200) {
                                   // Perform error handling
                                 return  handleErrors(connectionResponseStatusCode,handlerInput)
                               }
                               // Extract billingAgreementDetails and billingAgreementID from payload optionally to store it for future use
                              
                            //   const billingAgreementDet = actionResponsePayload.billingAgreementDetails;
                              
                               // const billingAgreementDetails = actionResponsePayload.billingAgreementAttributes;
                            
                            //   const billingAgreementID = billingAgreementDet.billingAgreementId;
                           
                               //  const billingAgreementID = billingAgreementDetails.sellerBillingAgreementAttributes.sellerBillingAgreementId;
                          
                             //  storeAmazonPayBillingAgreementOnBackend(billingAgreementID);
                               
                               // Get the billingAgreementId and billingAgreementStatus from the Setup Connections.Response
                    const billingAgreementID            = connectionResponsePayload.billingAgreementDetails.billingAgreementId;
                    const billingAgreementStatus        = connectionResponsePayload.billingAgreementDetails.billingAgreementStatus;
                            // If billingAgreementStatus is valid, Charge the payment method
                    if ( billingAgreementStatus === 'OPEN' )
                    {

                                   // Save billingAgreementId attributes because directives will close the session
                                   const { attributesManager }     = handlerInput;
                                   let attributes                  = attributesManager.getSessionAttributes( );

                                   attributes.billingAgreementId   = billingAgreementID;
                                   attributes.setup                = true;
                                   attributesManager.setSessionAttributes( attributes );

                                   const shippingAddress           = connectionResponsePayload.billingAgreementDetails.destination.addressLine1;
                                   let productType                 = attributes.productType;
                               //    let cartSummaryResponse         = generateResponse( 'summary', config.cartSummaryResponse, productType, shippingAddress, handlerInput );
                               let directiveObject = {
                                   "type": "Connections.SendRequest",
                                   "name": "Charge",
                                   "payload": {
                                       "@type": "ChargeAmazonPayRequest",
                                       "@version": "2",
                                       "sellerId": "seller-id",
                                       "billingAgreementId": billingAgreementID,
                                       "paymentAction": "AuthorizeAndCapture",
                                       "authorizeAttributes": {
                                           "@type": "AuthorizeAttributes",
                                           "@version": "2",
                                           "authorizationReferenceId": generateRandomString(15),
                                           "authorizationAmount": {
                                               "@type": "Price",
                                               "@version": "2",
                                               "amount": "25.00",
                                               "currencyCode": "USD"
                                           },
                                           "transactionTimeout": 0,
                                        //   "sellerAuthorizationNote": getSimulationString(''),
                                           "sellerAuthorizationNote": "saller note",
                                           "softDescriptor":"Lv-indi-Art-Pay"
                                       },
                                       "sellerOrderAttributes": {
                                           "@type": "SellerOrderAttributes",
                                           "@version": "2",
                                           "sellerOrderId": generateRandomString(6),
                                           "storeName": "Love indie Art",
                                           "customInformation": "Love indie Art - Help Art Survive. ",
                                           "sellerNote": "Thank you for the payment of Art. "
                                       }
                                    },
                               "token": "correlationToken"
                               };
                        
                    
                               return handlerInput.responseBuilder
                                .speak("Please wait while Amazon Pay processes the payment. ")
                              //  .withStandardCard('Love indie Art', "Please wait while Amazon Pay processes the payment. ")
                                .addDirective(directiveObject)
                                .withShouldEndSession(true)
                                .getResponse();
                          
                       }  // if open
                               else
                               {
                                   return handlerInput.responseBuilder
                                      .speak("Problem with the billing agreement. Invalid billing agreement. ")
                                       .addDirective(directiveObject)
                                       .withShouldEndSession(true)
                                       .getResponse();

                               }
                                   
                }
            
        };
                const ConnectionsChargeResponseHandler = {
                           canHandle(handlerInput) {
                               return handlerInput.requestEnvelope.request.type === "Connections.Response"
                               && handlerInput.requestEnvelope.request.name === "Charge";
                           },
                           handle(handlerInput) {
                               
                               const connectionResponsePayload     = handlerInput.requestEnvelope.request.payload;
                               const actionResponseStatusCode = handlerInput.requestEnvelope.request.status.code;
                               const connectionResponseStatusCode = handlerInput.requestEnvelope.request.status.code;
                              
                               if (connectionResponseStatusCode != 200)
                               {
                                   // Perform error handling
                                  return handleErrors(handlerInput)
                               }
                               
                             //   const authorizationStatusState = connectionResponsePayload.authorizationDetails.state;
                               
                               const authorizationStatusState = actionResponseStatusCode.authorizationStatusState
                               const errer = handlerInput.requestEnvelope.request.payload.errorMessage
                               console.log("authorization status state", connectionResponseStatusCode,errer)
                                      
                               
                                     // Authorization is declined, tell the customer their order was not placed
                                             if( authorizationStatusState === 'Declined' ) {
                                             //    const authorizationStatusReasonCode = connectionResponsePayload.authorizationDetails.reasonCode;
                                                    const authorizationStatusReasonCode = connectionResponsePayload.authorizationStatus.reasonCode;
                                                 return handleAuthorizationDeclines( authorizationStatusReasonCode, handlerInput );


                                      // CERTIFICATION REQUIREMENT
                                      // Authorization is approved, tell the customer their order was placed and send them a card with order details
                                      } else {
                                          // Get the productType attribute
                                          const { attributesManager }     = handlerInput;
                                          let attributes                  = attributesManager.getSessionAttributes( );
                                          const productType               = attributes.productType;
                                       //   let confirmationCardResponse    = generateResponse( 'confirmation', config.confirmationCardResponse, productType, null, handlerInput );
                                          var confirmationCardResponse = "Thank you. Your Payment for the amount of $25.00 is done. Say next to continue looking at art or say stop to exit."
                                          if(supportsAPL(handlerInput))
                                                   {
                                                       return handlerInput.responseBuilder
                                                       .speak(confirmationCardResponse)
                                                       .withSimpleCard('Love indie Art', confirmationCardResponse)
                                                       .addDirective({
                                                                     type: 'Alexa.Presentation.APL.RenderDocument',
                                                                     version: '1.0',
                                                                     document: myDocument,
                                                                     datasources: {
                                                                     response: {
                                                                     text: confirmationCardResponse,
                                                                     title: "Love indie Art",
                                                                     url:"https://awarenessmusic.s3.amazonaws.com/art/art0.png" ,
                                                                     logo:"https://awarenessmusic.s3.amazonaws.com/kidzlearnapps.png"
                                                                     },
                                                                     },
                                                                     })
                                                       .withShouldEndSession(false)
                                                       .getResponse();
                                                   }
                                          
                                          else
                                          {
                                             return handlerInput.responseBuilder
                                            .speak(confirmationCardResponse)
                                            .withStandardCard( 'Payment for art dertails',confirmationCardResponse)
                                            .withShouldEndSession( false )
                                            .getResponse();
                                          }
                            } // else for charge not approved
                               
                            
                           }
                       };

const BuyTicketIntentStartedHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
    && handlerInput.requestEnvelope.request.intent.name === 'BuyTicketIntent';
  },
  handle(handlerInput) {
    const permissions = handlerInput.requestEnvelope.context.System.user.permissions;
    const amazonPayPermission = permissions.scopes['payments:autopay_consent'];
    if(amazonPayPermission.status === "DENIED"){
      return handlerInput.responseBuilder
          .speak('Please enable permission for Amazon Pay in your companion app.')
          .withAskForPermissionsConsentCard([ 'payments:autopay_consent' ])
          .withShouldEndSession( false )
          .getResponse();
      }
      else if(amazonPayPermission.status === "GRANTED")
      {
          return handlerInput.responseBuilder
                   .speak('Amazon Pay is already enabled. In order to make a payment say amazon pay. ')
                //   .withAskForPermissionsConsentCard([ 'payments:autopay_consent' ])
                   .withShouldEndSession( false )
                   .getResponse();
      }
  }
}

const CancelRefundHandler = {
    canHandle(handlerInput) {
       const request = handlerInput.requestEnvelope.request;
       return request.type === 'IntentRequest'
         && (request.intent.name === 'CancelPaymentIntent' || request.type==='Alexa.Presentation.APL.UserEvent');
     },
     handle(handlerInput) {
       if(supportsAPL(handlerInput))
       {
       factIndex = 0;
       return handlerInput.responseBuilder
         .speak("To request a refund, please e-mail loveindieart@gmail.coom with your amazon pay e-mail and your address. ")
         .withSimpleCard('Love indie Art', "To request a refund, please e-mail loveindieart@gmail.coom with your amazon pay e-mail and your address. ")
         .addDirective({
                   type: 'Alexa.Presentation.APL.RenderDocument',
                   version: '1.0',
                   document: myDocument,
                   datasources: {
                     response: {
                       text: "To request a refund, please e-mail loveindieart@gmail.coom with your amazon pay e-mail and your address. ",
                       title: "Love indie Art",
                       url:"https://awarenessmusic.s3.amazonaws.com/art/art.png" ,
                       logo:"https://loveindieart.s3.amazonaws.com/kidzlearnapps.png"
                     },
                   },
                 })
          .withShouldEndSession(true)
         .getResponse();
       }  // if supports APL
             
       else
       {
           factIndex = 0;
           return handlerInput.responseBuilder
                .speak("To request a refund, please e-mail loveindieart@gmail.coom with your amazon pay e-mail and your address. ")
                .withSimpleCard(SKILL_NAME, "To request a refund, please e-mail loveindieart@gmail.coom with your amazon pay e-mail and your address. ")
                .withShouldEndSession(true)
                .getResponse();
                      
       }
     },
}

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent' || request.type==='Alexa.Presentation.APL.UserEvent');
  },
  handle(handlerInput) {
    if(supportsAPL(handlerInput))
    {
    factIndex = 0;
    return handlerInput.responseBuilder
      .speak(STOP_MESSAGE)
      .withSimpleCard('Love indie Art', STOP_MESSAGE)
      .addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                version: '1.0',
                document: myDocument,
                datasources: {
                  response: {
                    text: STOP_MESSAGE,
                    title: "Love indie Art",
                    url:"https://awarenessmusic.s3.amazonaws.com/art/art9.png" ,
                    logo:"https://awarenessmusic.s3.amazonaws.com/art/kidzlearnapps.png"
                  },
                },
              })
       .withShouldEndSession(true)
      .getResponse();
    }  // if supports APL
          
    else
    {
        factIndex = 0;
        return handlerInput.responseBuilder
             .speak(STOP_MESSAGE)
             .withSimpleCard(SKILL_NAME, STOP_MESSAGE)
             .withShouldEndSession(true)
             .getResponse();
                   
    }
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
     factIndex = 0;
    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    
    console.log(`Error handled: ${error.message}`);
    
      speechOutput2 = `Error Occured. ${error.message}`;
      
    return handlerInput.responseBuilder
      .speak('Sorry, an error occurred.')
      .withSimpleCard('Love indie Art', speechOutput2)
       .addDirective({
                     type: 'Alexa.Presentation.APL.RenderDocument',
                     version: '1.0',
                     document: myDocument,
                     datasources: {
                       response: {
                         text: speechOutput2 ,
                         title: "Error",
                         url:"https://awarenessmusic.s3.amazonaws.com/art/art9.png" ,
                         logo:"https://awarenessmusic.s3.amazonaws.com/art/kidzlearnapps.png"
                       },
                     },
                   })
      .getResponse();
     
  },
};



// If billing agreement equals any of these states, you need to get the user to update their payment method
// Once payment method is updated, billing agreement state will go back to OPEN and you can charge the payment method
function handleBillingAgreementState( billingAgreementStatus, handlerInput ) {
    let errorMessage = '';

    switch ( billingAgreementStatus ) {
        case 'CANCELED':
        case 'CLOSED':
        case 'SUSPENDED':
            errorMessage =   ` The status of the billing agreement is ${billingAgreementStatus}`;
            break;
        default:
            errorMessage = "Unknown error";
    }

    debug( handlerInput );

    return handlerInput.responseBuilder
        .speak( errorMessage )
        .getResponse( );
}

// Ideal scenario in authorization decline is that you save the session, allow the customer to fix their payment method,
// and allow customer to resume session. This is just a simple message to tell the user their order was not placed.
function handleAuthorizationDeclines( authorizationStatusReasonCode, handlerInput ) {
    let errorMessage = '';
    let permissionerrorr1 = false
    switch ( authorizationStatusReasonCode ) {
        case 'AmazonRejected':
        case 'InvalidPaymentMethod':
          //  permissionerrorr1 = true
            errorMessage = "Your payment did not go through. Your 1-Click payment method needs updating. To help, Love indie Art sent a link to your Alexa app. ";
            break;
        case 'ProcessingFailure':
        case 'TransactionTimedOut':
            errorMessage = "Sorry. Your payment can't be completed right now, but you can try later. Try again later. ";
            break;
        default:
            errorMessage = "Unknown error occured. ";
    }

    debug( handlerInput );
  
    return handlerInput.responseBuilder
        .speak( errorMessage )
        .withShouldEndSession(true)
        .getResponse( );
    
}

// Output object to console for debugging purposes
function debug( handlerInput, message ) {
    console.log( message + JSON.stringify( handlerInput ) );
}






const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchFactHandler,
    GetNewArtHandler,
    SetUpHandler,
    CancelRefundHandler,
    ConnectionsSetupResponseHandler,
    ConnectionsChargeResponseHandler,
    HelpHandler,
    BuyTicketIntentStartedHandler,
    ExitHandler,
    gobackhandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();

'use strict';

    var connection = new Postmonger.Session();
    var payload = {};

    $(window).ready(onRender);

    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);

    connection.on('clickedNext', save);
    //connection.on('clickedBack', onClickedBack);
    //connection.on('gotoStep', onGotoStep);

    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');
        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');
    }

  function initialize(data) {
        //console.log("Initializing data data: "+ JSON.stringify(data));
        if (data) {
            payload = data;
        }    

        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
         );

        var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};

         console.log("Inn Arguments of initiliza data" + JSON.stringify(payload['arguments'].execute));
        $.each(inArguments, function (index, inArgument) {
            $.each(inArgument, function (key, val) {

                if (key === 'brand') {
                    $('#brand').val(val);
                }

                if (key === 'sourcecode') {
                    $('#sourcecode').val(val);
                }

                if (key === 'formsource') {
                    $('#formsource').val(val);
                }

                if (key === 'programname') {
                    $('#programname').val(val);
                }                                                               

                if (key === 'programcode') {
                    $('#programcode').val(val);
                }                                                               

                if (key === 'campaigncode') {
                    $('#campaigncode').val(val);
                }                                                               

                if (key === 'campoffercode') {
                    $('#campoffercode').val(val);
                }                                                               

                if (key === 'campkitcode') {
                    $('#campkitcode').val(val);
                }                                                               

                if (key === 'env') {
                    $('#env').val(val)
                }

                if (key === 'vendor') {
                    $('#vendor').val(val)
                }
            })
        });

        connection.trigger('requestSchema');
        connection.on('requestedSchema', function (data){

        const schema = data['schema'];
        var inArg = {};
        for (var i = 0, l = schema.length; i < l; i++) {
            
            let attr = schema[i].key;
            let keyIndex = attr.lastIndexOf('.') + 1;
            if(attr.includes("Event.")){
                inArg[attr.substring(keyIndex)] = '{{' + attr + '}}';
            }     
        }
        payload['arguments'].execute.inArguments[0] = {...payload['arguments'].execute.inArguments[0], ...inArg};
    });

       
        let argArr = payload['arguments'].execute.inArguments;
        //console.log("Inside Initialize last "+JSON.stringify(payload['arguments'].execute));
        connection.trigger('updateButton', {
            button: 'next',
            text: 'done',
            visible: true
        });

    }

    function onGetTokens (tokens) {
        // Response: tokens = { token: <legacy token>, fuel2token: <fuel api token> }
        //console.log("Tokens function: "+JSON.stringify(tokens));
        //authTokens = tokens;
    }

    function onGetEndpoints (endpoints) {
        // Response: endpoints = { restHost: <url> } i.e. "rest.s1.qa1.exacttarget.com"
        //console.log("Get End Points function: "+JSON.stringify(endpoints));
    }

    function save() {

        var brand = $('#brand').val();
        var sourcecode = $('#sourcecode').val();
        var formsource = $('#formsource').val();
        var programname = $('#programname').val();
        var programcode = $('#programcode').val();
        var campaigncode = $('#campaigncode').val();
        var campoffercode = $('#campoffercode').val();
        var campkitcode = $('#campkitcode').val();
        var env = $('#env').val();
        var vendor = $('#vendor').val();

        
    console.log("Save before"+payload['arguments'].execute.inArguments);
        var inArgs0 = payload['arguments'].execute.inArguments[0]
        var inArgs1 = {
            "env": env,
            "vendor":vendor,
            "brand": brand,
            "sourcecode": sourcecode,
            "formsource": formsource,
            "programname": programname,
            "programcode": programcode,
            "campaigncode": campaigncode,
            "campoffercode": campoffercode,
            "campkitcode": campkitcode,
            "patId": "{{Contact.Key}}" //<----This should map to your data extension name and phone number column
        };

        payload['arguments'].execute.inArguments[0] = {...inArgs0,...inArgs1};

        payload['metaData'].isConfigured = true;
        console.log("Save after"+payload['arguments'].execute.inArguments);
        //console.log("Payload on SAVE function: "+JSON.stringify(payload));
        connection.trigger('updateActivity', payload);

    }
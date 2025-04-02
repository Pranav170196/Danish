'use strict';

// Deps
var activity = require('./activity');
var axios = require('axios');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
/*
 * GET home page.
 */
exports.index = function(req, res){
    if( !req.session.token ) {
        res.render( 'index', {
            title: 'Unauthenticated',
            errorMessage: 'This app may only be loaded via Salesforce Marketing Cloud',
        });
    } else {
        res.render( 'index', {
            title: 'Journey Builder Activity',
            results: activity.logExecuteData,
        });
    }
};

exports.login = function( req, res ) {
    console.log( 'req.body: ', req.body ); 
    res.redirect( '/' );
};

exports.logout = function( req, res ) {
    req.session.token = '';
};

exports.submit = function(req, res){
    const guid = uuidv4();
    MDM_PAT_ID = req.body.inArgument[0].PAT_ID
    if(MDM_PAT_ID.substring(pat.length-4) != "#DTC"){
        reqLog = generateLogRequest(guid,MDM_PAT_ID,"","",""," Incorrect Subscriber Key Pattern - Should contain #DTC","Failed","","")
        logSfmcDe(reqLog);
    }
    else{
        let PAT_ID = MDM_PAT_ID.substring(0,pat.length-4)
        patient = callSfmcApi(guid,PAT_ID);
    }
}

async function getAccessToken() {
    try {
        const response = await axios.post(process.env.SFMC_TOKEN_URL, {
            grant_type: 'client_credentials',
            client_id: process.env.SFMC_CLIENT_ID,
            client_secret: process.env.SFMC_CLIENT_SCRET,
            account_id: process.env.SFMC_ACCOUNT_ID
        });

        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching access token:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function callSfmcApi(guid,PAT_ID) {
    try {
        const token = await getAccessToken();

        const response = await axios.get(process.env.SFMC_DE_GET_URL+PAT_ID, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log('API Response:', response.data.items[0].keys);
        console.log('API Response:', response.data.items[0].values);
        if (response.data.count==1){
            reqLog = generateLogRequest(guid,PAT_ID,"","",response.statusCode,"Patient Found with the GUID","Success","","")
            logSfmcDe(reqLog);
            return response;
        }
    } catch (error) {
        console.error('Error calling SFMC API:', error.response ? error.response.data : error.message);
        reqLog = generateLogRequest("",PAT_ID,"","","","Incorrect Subscriber Key Pattern - Should contain #DTC","Failed","","")
        logSfmcDe(reqLog);
    }
}

async function logSfmcDe(requestBody){
    const token = await getAccessToken();

        const response = await axios.post(process.env.SFMC_DE_INSERT_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type" : "application/json"
            },
            body : requestBody
        });
}

function generateLogRequest(guid, pat_id, env, vendor,response_code,message,status,payload_1, payload_2){
    req = {
        items: [
            {
                "GUID": guid,
                "MDM_PAT_ID": pat_id,
                "Environment": env,
                "Fulfillment_Vendor": vendor,
                "Response_Status_Code": response_code,
                "Response_Message": message,
                "Status": status,
                "Payload_1": payload_1,
                "Payload_2": payload_2,
            }
        ]
    }

    return req;
}
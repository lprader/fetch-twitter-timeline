/*
 * Copyright (c) 2016-2017  Moddable Tech, Inc.
 *
 *   This file is part of the Moddable SDK.
 * 
 *   This work is licensed under the
 *       Creative Commons Attribution 4.0 International License.
 *   To view a copy of this license, visit
 *       <http://creativecommons.org/licenses/by/4.0>.
 *   or send a letter to Creative Commons, PO Box 1866,
 *   Mountain View, CA 94042, USA.
 *
 */

import {Request} from "http"
import SecureSocket from "securesocket";
import Base64 from "base64";
import SNTP from "sntp";
import Time from "time";

const CONSUMER_API_KEY = "YOUR CONSUMER API KEY";
const CONSUMER_API_KEY_SECRET = "YOUR CONSUMER API SECRET KEY";
const USERNAME = "TWITTER USERNAME TO FETCH";

function getToken() {
	return new Promise((resolve, reject) => {
		let request = new Request({	host: "api.twitter.com",
									path: '/oauth2/token',
									method: "POST",
									headers: ["Authorization", "Basic "+Base64.encode(CONSUMER_API_KEY + ":" + CONSUMER_API_KEY_SECRET), "Content-Type", "application/x-www-form-urlencoded;charset=UTF-8"],
									body: "grant_type=client_credentials",
									response: String,
								  	port: 443, 
								  	Socket: SecureSocket, 
								  	secure: {protocolVersion: 0x303} 
		});
		request.callback = function(message, value, etc) {
			if (5 == message) {
				let result = JSON.parse(value);
				if ("bearer" !== result.token_type) {
					trace("Wrong token type\n");	
					resolve(undefined);	
				}
				trace(`Got token: ${result.access_token}\n`);
				resolve(result.access_token);
			}
		}
	});
}

async function getTweets(count) {
	let token = await getToken();
	if (undefined === token) return;
	let val = "";
	let request = new Request({	host: "api.twitter.com",
								path: `/1.1/statuses/user_timeline.json?screen_name=${USERNAME}&count=${count}&tweet_mode=extended&trim_user=true&include_entities=false`,
								headers: ["Authorization", "Bearer " + token],
								response: String,
							  	port: 443, 
							  	Socket: SecureSocket, 
							  	secure: {protocolVersion: 0x303} 
	});
	request.callback = function(message, value, etc) {
		if (5 == message) {
			trace(value+"\n\n");
			let results = JSON.parse(value, ["full_text"]);
			for (let result of results) trace(`\n${result.full_text}+\n`);
		}
	}
}

export default () => {
	const hosts = ["0.pool.ntp.org", "1.pool.ntp.org", "2.pool.ntp.org", "3.pool.ntp.org"];
	new SNTP({host: hosts.shift()}, function(message, value) {
		switch (message) {
			case 1:
				Time.set(value);
				trace("Set time.\n");
				getTweets(5);
				break;

			case 2:
				trace("Retrying.\n");
				break;

			case -1:
				trace("Failed: ", value, "\n");
				if (hosts.length)
					return hosts.shift();
				break;
		}
	});
}




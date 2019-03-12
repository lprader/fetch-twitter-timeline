### Notes

This project fetches tweets from a specified user's Twitter timeline and traces them to the console. It has been tested on the ESP32 and the Moddable simulator.

To run it yourself, you'll first need to change the values of the following constants:

```js
const CONSUMER_API_KEY = "YOUR CONSUMER API KEY";
const CONSUMER_API_KEY_SECRET = "YOUR CONSUMER API SECRET KEY";
const USERNAME = "TWITTER USERNAME TO FETCH";
```

By default, this example fetches the five latest tweets.

```js
getTweets(5);
```

This number may be changed. However, the size of the JSON object returned by the Twitter API and memory constraints of the ESP32 limit the number of tweets that can be fetched at a time. The JSON object returned by the Twitter API seems to vary quite a bit in size (typically 1KB to 4KB per tweet).

### Links

- [Get Tweet timelines API documentation](https://developer.twitter.com/en/docs/tweets/timelines/api-reference/get-statuses-user_timeline.html)
- [Making Secure Network Requests](http://blog.moddable.com/blog/https/) post on Moddable blog
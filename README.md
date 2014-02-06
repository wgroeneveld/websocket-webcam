# Websocket-enabled HTML5 webcam

## What's this? 

Nothing special, bits and pieces glued together:

* HTML5 enabled webcam using something like the video tag and a bit of JS magic (see clientcam.html)
* websocket enabled streaming of the data found on the client back to the pure NodeJS server (server.js).
* the NodeJS server then streams the raw bytes back to other browser clients. (cam/index.html)

That's it!

## Why would you do something like this?

This is an experiment to be able to use pure Javascript to stream data/images from my home laptop to "the internets". We had a puppy 6 months ago and I wanted to monitor his behaviour in his bench when not home: what's he doing? Is he sleeping? Is he okay?

By the way, I found out the dog does nothing but sleep during the day. BOOORING :) All these lines of code, for nothing!

## Where are your unit tests?

O-ow. 

It was a spike, okay? (lol)

## Your woofie, Let me show you them!

![The little devil, at that time](http://i57.tinypic.com/33clu7b.png)

Yes, the cat decided to join the peeping fest, but got bored quickly. As our cat usually does. *YAWN*
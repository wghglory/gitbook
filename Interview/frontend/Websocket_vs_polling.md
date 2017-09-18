# HTTP, Ajax Polling, Ajax Long polling, Websocket, Comet, SSE

## Regular HTTP

1. A client requests a webpage from a server.
1. The server calculates the response
1. The server sends the response to the client.

![HTTP](https://i.stack.imgur.com/TK1ZG.png)

## Ajax Polling:

1. A client requests a webpage from a server using regular HTTP (see HTTP above).
1. The requested webpage executes JavaScript which requests a file from the server at regular intervals (e.g. 0.5 seconds).
1. The server calculates each response and sends it back, just like normal HTTP traffic.

![Ajax Polling](https://i.stack.imgur.com/qlMEU.png)

## Ajax Long-Polling:

1. A client requests a webpage from a server using regular HTTP (see HTTP above).
1. The requested webpage executes JavaScript which requests a file from the server.
1. The server does not immediately respond with the requested information but waits until there's **new** information available.
1. When there's new information available, the server responds with the new information.
1. The client receives the new information and immediately sends another request to the server, re-starting the process.

![Ajax Long-Polling](https://i.stack.imgur.com/zLnOU.png)

## HTML5 Server Sent Events (SSE) / EventSource:

1. A client requests a webpage from a server using regular HTTP (see HTTP above).
1. The requested webpage executes javascript which opens a connection to the server.
1. The server sends an event to the client when there's new information available.
   - Real-time traffic from server to client, mostly that's what you'll need
   - You'll want to use a server that has an event loop
   - Not possible to connect with a server from another domain
   - If you want to read more, I found these very useful: [(article)](https://developer.mozilla.org/en-US/docs/Server-sent_events/Using_server-sent_events), [(article)](http://html5doctor.com/server-sent-events/#api), [(article)](http://www.html5rocks.com/en/tutorials/eventsource/basics/), [(tutorial)](http://jaxenter.com/tutorial-jsf-2-and-html5-server-sent-events-42932.html).

![HTML5 SSE](https://i.stack.imgur.com/ziR5h.png)

## HTML5 Websockets:

1. A client requests a webpage from a server using regular http (see HTTP above).
1. The requested webpage executes JavaScript which opens a connection with the server.
1. The server and the client can now send each other messages when new data (on either side) is available.
   - Real-time traffic from the server to the client **and** from the client to the server
   - You'll want to use a server that has an event loop
   - With WebSockets it is possible to connect with a server from another domain.
   - It is also possible to use a third party hosted websocket server, for example [Pusher](http://pusher.com/) or [others](http://www.leggetter.co.uk/real-time-web-technologies-guide). This way you'll only have to implement the client side, which is very easy!
   - If you want to read more, I found these very useful: ([article](http://www.developerfusion.com/article/143158/an-introduction-to-websockets/)), [(article)](https://developer.mozilla.org/en-US/docs/WebSockets/Writing_WebSocket_client_applications) ([tutorial](http://net.tutsplus.com/tutorials/javascript-ajax/start-using-html5-websockets-today/)).

![HTML5 WebSockets](https://i.stack.imgur.com/CgDlc.png)

## Comet:

Comet is a collection of techniques prior to HTML5 which use streaming and long-polling to achieve real time applications. Read more on [wikipedia](http://en.wikipedia.org/wiki/Comet_%28programming%29) or [this](http://www.ibm.com/developerworks/web/library/wa-reverseajax1/index.html) article.
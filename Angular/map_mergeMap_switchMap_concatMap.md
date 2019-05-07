# Understanding RxJS map, mergeMap, switchMap and concatMap

## The map operator

The map operator is the most common of all. For each value that the Observable emits you can apply a function in which you can modify the data. The return value will, behind the scenes, be reemitted as an Observable again so you can keep using it in your stream. It works pretty much the same as how you would use it with Arrays. The difference is that Arrays will always be just Arrays and while mapping you get the value of the current index in the Array. With Observables the type of data can be of all sorts of types. This means that you might have to do some additional operations in side your Observable map function to get the desired result. Let’s look at some examples:

<iframe data-width="745" data-height="400" width="1015" height="545" data-src="/media/4a2968ce8acf17a923a2d6addf0114c6?postId=833fc1fb09ff" data-media-id="4a2968ce8acf17a923a2d6addf0114c6" data-thumbnail="https://i.embed.ly/1/image?url=https%3A%2F%2Fc.staticblitz.com%2Fassets%2Ficon-664493542621427cc8adae5e8f50d632f87aaa6ea1ce5b01e9a3d05b57940a9f.png&amp;key=a19fcc184b9711e1b4764040d3dc5c07" class="progressiveMedia-iframe js-progressiveMedia-iframe" allowfullscreen="" frameborder="0" src="https://medium.com/media/4a2968ce8acf17a923a2d6addf0114c6?postId=833fc1fb09ff" style="display: block; position: absolute; margin: auto; max-width: 100%; box-sizing: border-box; transform: translateZ(0px); top: 0px; left: 0px; width: 1032px; height: 554.175px;"></iframe>

We first created our Observable with an array of cars. We then subscribe to this Observable 2 times. The first time we modify our data in such a way that we get an array of concatenated brand and model strings. The second time we modify our data so that we get an array of only Porsche cars. In both examples we use the Observable map operator to modify the data that is being emitted by the Observable. We return the result of our modification and the map operator then behind the scenes takes care of wrapping this in an Observable again so we can later subscribe to it.

## MergeMap

Now let’s say there is a scenario where we have an Observable that emits an array, and for each item in the array we need to fetch data from the server.

We could do this by subscribing to the array, then setup a map that calls a function which handles the API call and then subscribe to the result. This could look like the following:

<iframe width="700" height="250" data-src="/media/84c68156f5338e45c815296b73507bf3?postId=833fc1fb09ff" data-media-id="84c68156f5338e45c815296b73507bf3" data-thumbnail="https://i.embed.ly/1/image?url=https%3A%2F%2Favatars1.githubusercontent.com%2Fu%2F6695493%3Fs%3D400%26v%3D4&amp;key=a19fcc184b9711e1b4764040d3dc5c07" class="progressiveMedia-iframe js-progressiveMedia-iframe" allowfullscreen="" frameborder="0" src="https://medium.com/media/84c68156f5338e45c815296b73507bf3?postId=833fc1fb09ff" style="display: block; position: absolute; margin: auto; max-width: 100%; box-sizing: border-box; transform: translateZ(0px); top: 0px; left: 0px; width: 700px; height: 302px;"></iframe>

Our map function returns the value of the getData function. In this case that is an Observable. This does however create a problem because now we’re dealing with an additional Observable.

To further clarify this: we have `from([1,2,3,4])` as our ‘outer’ Observable, and the result of the `getData()` as our ‘inner’ Observable. In theory we have to subscribe to both our outer and inner Observable to get the data out. This could like this:

<iframe width="700" height="250" data-src="/media/ffe4daf01d0ce7c2e5464b8edfac39eb?postId=833fc1fb09ff" data-media-id="ffe4daf01d0ce7c2e5464b8edfac39eb" data-thumbnail="https://i.embed.ly/1/image?url=https%3A%2F%2Favatars1.githubusercontent.com%2Fu%2F6695493%3Fs%3D400%26v%3D4&amp;key=a19fcc184b9711e1b4764040d3dc5c07" class="progressiveMedia-iframe js-progressiveMedia-iframe" allowfullscreen="" frameborder="0" src="https://medium.com/media/ffe4daf01d0ce7c2e5464b8edfac39eb?postId=833fc1fb09ff" style="display: block; position: absolute; margin: auto; max-width: 100%; box-sizing: border-box; transform: translateZ(0px); top: 0px; left: 0px; width: 700px; height: 302px;"></iframe>

As you can might imagine this is far from ideal as we have to call Subscribe two times. This is where mergeMap comes to the rescue. MergeMap essentially is a combination of mergeAll and map. MergeAll takes care of subscribing to the ‘inner’ Observable so that we no longer have to Subscribe two times as mergeAll merges the value of the ‘inner’ Observable into the ‘outer’ Observable. This could look like this:

<iframe width="700" height="250" data-src="/media/7c9f306eea858f9a32597d0d698a7be1?postId=833fc1fb09ff" data-media-id="7c9f306eea858f9a32597d0d698a7be1" data-thumbnail="https://i.embed.ly/1/image?url=https%3A%2F%2Favatars1.githubusercontent.com%2Fu%2F6695493%3Fs%3D400%26v%3D4&amp;key=a19fcc184b9711e1b4764040d3dc5c07" class="progressiveMedia-iframe js-progressiveMedia-iframe" allowfullscreen="" frameborder="0" src="https://medium.com/media/7c9f306eea858f9a32597d0d698a7be1?postId=833fc1fb09ff" style="display: block; position: absolute; margin: auto; max-width: 100%; box-sizing: border-box; transform: translateZ(0px); top: 0px; left: 0px; width: 700px; height: 324px;"></iframe>

This already is much better, but as you might already guessed mergeMap would be the best solution for this. Here’s the full example:

<iframe data-width="745" data-height="400" width="1015" height="545" data-src="/media/b2e9678e5b63a65b68503d909ad638d7?postId=833fc1fb09ff" data-media-id="b2e9678e5b63a65b68503d909ad638d7" data-thumbnail="https://i.embed.ly/1/image?url=https%3A%2F%2Fc.staticblitz.com%2Fassets%2Ficon-664493542621427cc8adae5e8f50d632f87aaa6ea1ce5b01e9a3d05b57940a9f.png&amp;key=a19fcc184b9711e1b4764040d3dc5c07" class="progressiveMedia-iframe js-progressiveMedia-iframe" allowfullscreen="" frameborder="0" src="https://medium.com/media/b2e9678e5b63a65b68503d909ad638d7?postId=833fc1fb09ff" style="display: block; position: absolute; margin: auto; max-width: 100%; box-sizing: border-box; transform: translateZ(0px); top: 0px; left: 0px; width: 1032px; height: 554.175px;"></iframe>

You might also have heard about flatMap. FlatMap is an alias of mergeMap and behaves in the same way. Don’t get confused there!

## SwitchMap

SwitchMap has similar behaviour in that it will also subscribe to the inner Observable for you. However switchMap is a combination of switchAll and map. SwitchAll cancels the previous subscription and subscribes to the new one. For our scenario where we want to do an API call for each item in the array of the ‘outer’ Observable, switchMap does not work well as it will cancel the first 3 subscriptions and only deals with the last one. This means we will get only one result. The full example can be seen here:

<iframe data-width="745" data-height="400" width="1015" height="545" data-src="/media/c3eb4815565e89e0f6a72120ef884e03?postId=833fc1fb09ff" data-media-id="c3eb4815565e89e0f6a72120ef884e03" data-thumbnail="https://i.embed.ly/1/image?url=https%3A%2F%2Fc.staticblitz.com%2Fassets%2Ficon-664493542621427cc8adae5e8f50d632f87aaa6ea1ce5b01e9a3d05b57940a9f.png&amp;key=a19fcc184b9711e1b4764040d3dc5c07" class="progressiveMedia-iframe js-progressiveMedia-iframe" allowfullscreen="" frameborder="0" src="https://medium.com/media/c3eb4815565e89e0f6a72120ef884e03?postId=833fc1fb09ff" style="display: block; position: absolute; margin: auto; max-width: 100%; box-sizing: border-box; transform: translateZ(0px); top: 0px; left: 0px; width: 1032px; height: 554.175px;"></iframe>

While switchMap wouldn’t work for our current scenario, it will work for other scenario’s. It would for example come in handy if you compose a list of filters into a data stream and perform an API call when a filter is changed. If the previous filter changes are still being processed while a new change is already made, it will cancel the previous subscription and start a new subscription on the latest change. An example can be seen here:

<iframe data-width="745" data-height="400" width="1015" height="545" data-src="/media/2f0428d1a846976794b9aab0c68efad0?postId=833fc1fb09ff" data-media-id="2f0428d1a846976794b9aab0c68efad0" data-thumbnail="https://i.embed.ly/1/image?url=https%3A%2F%2Fc.staticblitz.com%2Fassets%2Ficon-664493542621427cc8adae5e8f50d632f87aaa6ea1ce5b01e9a3d05b57940a9f.png&amp;key=a19fcc184b9711e1b4764040d3dc5c07" class="progressiveMedia-iframe js-progressiveMedia-iframe" allowfullscreen="" frameborder="0" src="https://medium.com/media/2f0428d1a846976794b9aab0c68efad0?postId=833fc1fb09ff" style="display: block; position: absolute; margin: auto; max-width: 100%; box-sizing: border-box; transform: translateZ(0px); top: 0px; left: 0px; width: 1032px; height: 554.175px;"></iframe>

As you can see in the console `getData` is only logging once with all the params. This saved us 3 API calls.

## ConcatMap

The last example is concatMap. As you might expect, concatMap also subscribes to the inner Observable for you. But unlike switchMap, that unsubscribes from the current Observable if a new Observable comes in, concatMap will not subscribe to the next Observable until the current one completes. The benefit of this is that the order in which the Observables are emitting is maintained. To demonstrate this:

<iframe data-width="745" data-height="400" width="1015" height="545" data-src="/media/9aa99058c57aa8f49eb6d6f1769788f0?postId=833fc1fb09ff" data-media-id="9aa99058c57aa8f49eb6d6f1769788f0" data-thumbnail="https://i.embed.ly/1/image?url=https%3A%2F%2Fc.staticblitz.com%2Fassets%2Ficon-664493542621427cc8adae5e8f50d632f87aaa6ea1ce5b01e9a3d05b57940a9f.png&amp;key=a19fcc184b9711e1b4764040d3dc5c07" class="progressiveMedia-iframe js-progressiveMedia-iframe" allowfullscreen="" frameborder="0" src="https://medium.com/media/9aa99058c57aa8f49eb6d6f1769788f0?postId=833fc1fb09ff" style="display: block; position: absolute; margin: auto; max-width: 100%; box-sizing: border-box; transform: translateZ(0px); top: 0px; left: 0px; width: 1032px; height: 554.175px;"></iframe>

The getData function has a random delay between 1 and 10000 milliseconds. If you check the logs you can see that the map and mergeMap operators will log whatever value comes back and don’t follow the original order. On the other hand the concatMap logs the values in the same value as they were started.

## Conclusion

Mapping data to the format you need is a common task. RxJS comes with a few very neat operators that help you get the job done. To recap: map is for mapping ‘normal’ values to whatever format you need it to be. The return value will be wrapped in an Observable again, so you can keep using it in your data stream. When you have to deal with an ‘inner’ Observable it’s easier to use mergeMap, switchMap or concatMap. Use mergeMap if you simply want to flatten the data into one Observable, use switchMap if you need to flatten the data into one Observable but only need the latest value and use concatMap if you need to flatten the data into one Observable and the order is important to you.

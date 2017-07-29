# Extend BetterTweetDeck with Thumbnail Providers

Thumbnail Providers are defined services that will return media previews in TweetDeck if a URL in a 
tweet matches an expression given by any provider.

These previews are mostly embeds or images, depending on service type.

## Steps

* Before implementing a provider, please check if it already exists in [src/js/util/providers](https://github.com/eramdam/BetterTweetDeck/blob/master/src/js/util/providers)
* If your provider needs to fetch data from an API, add the endpoint to the `endpoints` object in [src/js/util/thumbnails.js](https://github.com/eramdam/BetterTweetDeck/blob/master/src/js/util/thumbnails.js)
* Create a new file for your provider using `{provider name}.js` in `src/js/util/providers`
  * You can use the following base template for your provider:
    ```js
      export default function ($) {
        return {
          name: 'Provider',
          setting: 'provider',
          re: /example.com/,
          default: true,
          callback: url => {
            // Add some JS code here that fetches the required data to display in the thumbnail
            const obj = {
              type: 'image',
              thumbnail_url: $.getSafeURL('url'),
              url: $.getSafeURL('url'),
            };

            return obj;
          },
        };
      }
    ```
  * You need to return an object with a `type`, `thumbnail_url` and `url` key
    * `type` should be one of `image`, `audio` or `video`
    * Use `$.getSafeURL(url)` to make sure your `thumbnail_url` and `url` are in the proper format
    * If your returned thumbnail is also an embed, you need to add it in a `html` key using an `iframe`
  * If you need to get the endpoint for your provider, use `$.getEnpointFor('provider key')`
  * You can use the `fetch(url)` function to get data from an API
  * You can use `fetchPage(url)` to fetch an entire page using an XMLHttpRequest, but you need to import it first, just add this at the top of your provider file:
    ```js
      import fetchPage from '../fetchPage.js';
    ```
    * To properly work with the document you just loaded, you can import the `secureDomify` module and use it like this:
      ```js
        import * as secureDomify from '../secureDomify';

        // data is the fetchPage response
        const el = secureDomify.parse(data.currentTarget.response);
        const thumbnail = secureDomify.getAttributeFromNode('[property="twitter:image"]', el, 'content');
        const embedURL = secureDomify.getAttributeFromNode('[property="twitter:player"]', el, 'content');
      ```
* Import your provider into [src/js/util/providers/index.js](https://github.com/eramdam/BetterTweetDeck/blob/master/src/js/util/providers/index.js):
  ```js
    export { default as provider } from './provider';
  ```
* Add your provider to the provider whitelist in [src/js/util/thumbnails.js](https://github.com/eramdam/BetterTweetDeck/blob/master/src/js/util/thumbnails.js):
  ```js
    const schemeWhitelist = [
      // ...
      Providers.provider(util),
      // ...
    ];
  ```
* Rebuild the extension, reload TweetDeck and test if your provider works!

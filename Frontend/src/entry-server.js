import jwt from 'jsonwebtoken'
import Config from './js/config-server'

import { createApp } from './app';

export default context => {
  return new Promise((resolve, reject) => {
    let jwt_string = null;
    let userId = null;
    if (context.jwt) {
      try {
        const decoded = jwt.verify(context.jwt, Config.server.jwt);
        jwt_string = context.jwt;
        userId = decoded.userid;
      }
      catch {}
    }

    const { app, router, store } = createApp(userId, jwt_string);

    // Catch the "useless" exception (this is by design)
    // https://stackoverflow.com/a/65326844
    router.push(context.url).catch(() => {});

    router.onReady(() => {
      // This `rendered` hook is called when the app has finished rendering
      context.rendered = () => {
        const matchedComponents = router.getMatchedComponents()
        // no matched routes, reject with 404
        if ( ! matchedComponents.length) {
          return reject({ code: 404 });
        }
        
        // After the app is rendered, our store is now
        // filled with the state from our components.
        // When we attach the state to the context, and the `template` option
        // is used for the renderer, the state will automatically be
        // serialized and injected into the HTML as `window.__INITIAL_STATE__`.
        context.state = store.state;
      }

      resolve(app);
    }, reject);
  })
}
My App
===

TODO: Include a summary of app functionality and a screenshot

Pull Requests
===
Every app deployment requires that the version property in the manifest.json file be updated to reflect the new app version. This is so Deskpro can detect changes and add/upgrade apps accordingly. As such, we've made altering versions easy by having CI make the actual version change for you. Here's what we do:

* We increment patch versions, i.e. 1.0.1, automatically. You don't need to do anything and this will happen
* Minor versions, i.e. 1.1.0, are incremented if you add the minor-version GitHub label to your PR
* Major versions, i.e. 2.0.0, are incremented if you add the major-version GitHub label to your PR


Basic Usage
---

We recommend using [PNPM](https://pnpm.io/) to manage this project. First, start by installing the project 
dependencies from inside the project directory `app-template-vite`.

```bash
pnpm install
```

Then, run the development server.

```bash
pnpm run start
```

You should now be able to view the bare-bones app in your browser.

For more information or to start developing an app, please take a look at our [developer guides](https://support.deskpro.com/en/guides/developers/apps/apps-1/anatomy-of-an-app).

Testing
---

We've included `jest` to run your tests. It will look anywhere in `/src` for test suite files ending in `.test.tsx`.

You can run all tests using:

```bash
pnpm run test
```

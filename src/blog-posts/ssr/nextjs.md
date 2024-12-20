---
title: Modern Websites and the Problem of SEO
tags: public, server side rendering, backend

date: '2020-04-04'
---

In former times, the way a website would be served by the browser is by making a blocking request to a server for an `.html` document. A "blocking request" means that the browser itself would load until this request resolves. This makes for a bad user experience. Everytime a user goes to a new link inside the same website, it would reload. Nowadays, user's expect a much different experience when navigating the page. The way this experience is achieved is through dynamic `HTML` generation, from JavaScript executing inside the browser either linked or embedded inside the `.html` document.

While this delivers a great user experience it introduces a new problem related to Search Engine Optimization (SEO). If we're building the `HTML` using JavaScript, google only sees the initial `HTML`. For example, this is what google will see for an application that relies on JavaScript to build its `HTML`:

```html
<body>
  <div id="app"></div>
  <script
    type="text/JavaScript"
    src="/vendors.e9f29bdd842eb8e17b59.js"
  ></script>
  <script type="text/JavaScript" src="/app.499547aa7f29e137bb71.js"></script>
  <script
    type="text/JavaScript"
    src="/runtime.d5cf8bed6d924b27a6d0.js"
  ></script>
</body>
```

That is not a lot of information to use for indexing our website! JavaScript builds the dynamic `HTML` very quickly after the HTML loads. It then will look something like this:

```html
<body>
  <div id="app">
    <div>
      <div class="my-home-page">
        <div class="my-site-header"></div>
      </div>
    </div>
  </div>
</body>
```

This works great for users, but keeps goolge in the dark as far as it concerns our site's content.

## The Best of Both Worlds: Next.js

[Next.js](https://github.com/zeit/next.js) is an open source tool engineered to solve this problem. It is used by major industry leaders in the software industry including NETFLIX, HULU, Twitch, Starbucks, GitHub, and Uber. This adoption provides confidence that the tool will be maintained for the forseeable future until a better option is developed by the open source community.

The Next.js framework allows for 3 different options for `HTML` generation. Each of which may be used interchangeably in the same application -- even with multiple approaches used on the same page -- depending on the nature of the page in view.

### Option 1 of 3: Client Side Rendering (CSR)

This is where a page's `HTML` is built by dynamically by JavaScript in the browser as the user traverses a page. This approach has already been defined above. A perfect example of this is the "Load More" button. When you are on a site like facebook and you scroll to the bottom of the screen, you may see this button. Clicking this button demonstrates the CSR approach. On click, the browser executes JavaScript which:

1. Fetches more data
2. Processes/cleans that data
3. Uses it to build new HTML

Next.js exposes [an API](https://swr.now.sh/) which allows use this functionality, at our discretion, including some bells and whistles; like lazy-loading, where network requests necessary for new HTML are not made until the user scrolls to the position where that HTML is actually in view.

### Option 2 of 3: Static Site Generation (SSG)

This is the ideal manner of serving HTML. This is where all the HTML is generated during a `build step`, prior to deployment, before the user has even requested it. This means that the `HTML` for a website is fully defined and exposed for google indexing and it can be rendered by the browser as fast it takes to load the HTML, images, and JavaScript assets necessary (for other tasks besides building more HTML).

The outcome of this is great SEO and performance.

### Option 3 of 3: Server Side Rendering (SSR)

This is the old school way of serving a website. In this case, the browser makes a blocking network request for an `.html` document and then the browser serves it up. Before the browser was able to handle heavy JavaScript bundles that built HTML on the fly, this was the main option that was taken, if not the only one available.

## A Hybrid Implementation: SSG, CSR, and SSR

NextJS allows for a mesh of all these different approaches in a single application. What this means is, using the NextJS API, we can create an application with 3 different pages; the first, using CSR; the second, using SSR; and the third, using SSG.

### Modern SSR vs Classic SSR

The NextJS implementation of SSR is quite different from what was defined earlier, which might be called the more classical implementation of SSR. Using NextJS, however, the client requests `HTML` from the server and receives in the response what is called a [pre-rendered or hydrated](https://nextjs.org/docs/basic-features/pages#pre-rendering) react application. That is, a react application with a more defined `HTML` body suited for the requested page. What this means is the client only requests `HTML` from the server on the _intial page load_. Subsequent page navigation occurs client side and `HTML` is dynmaically generated in the browser, using React, for the purposes of performance. The reason we would want the ability to make this _initial_ request server side is exclusively for SEO.

See this explained in the [NextJS Documentation](https://nextjs.org/docs/basic-features/data-fetching#typescript-use-getserversideprops):

> - When you request this page directly, ...the page will be pre-rendered
> - When you request this page on client-side page transitions ... Next.js sends an API request to the server ... It’ll return JSON (rather than a blocking request with an HTML document in the response)

### SSR & CSR on the Same Page

In this implementation of SSR using NextJS, we can also return only the HTML necessary for SEO and leave the rest for CSR. For example, a page might have an _overview_ section which could be defined in the intial SSR response as it is most useful for SEO, while the other more secondary content in the page with further detail could be rendered client side.

### SSG Page X; SSR Page Y

SSG is the ideal approach for rendering a website. It is best for performance and SEO. However, it requires building the HTML for a webpage _prior_ to the user requesting it. In many cases, this will work. For instance, with a blog or an e-commerce store where there are only thousands or tens of thousands of variants for a page which are possible. This task is also often not feasible when there are millions of different variations of the same page which require unique `HTML`.

The best practice then is for pages that have only thousands or tens of thousands of variations, use SSG, for pages with millions of variations, use a hybrid approach of SSR for SEO and CSR for performance.

## Conclusion

Not every website requires Search Engine Optimization. The ones that do need not choose performance at the expense of SEO. The Open Source JavaScript community has delivered a valuable solution for such websites in NextJS. This blog is written in Gatsby, which utilizes SSG. If SSG is not feasible and SEO is a requirement, NextJS appears to be the industry's chosen solution for JavaScript applications.

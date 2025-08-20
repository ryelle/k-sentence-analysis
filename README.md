# Korean Sentence Analysis

This is a fairly simple app using Next.js and the [AI SDK](https://ai-sdk.dev/) to parse out grammar and vocabulary details from given Korean sentences. For example, given "한국어는 공부할 만해요.", it will translate each word (한국어: Korean), highlight a few grammar points (-할 만하다: to be worth doing), and translate the sentence in full ("Korean is worth studying.").

This will locally-cache the AI results to avoid repeated calls, but only while the page is open. Sometimes the AI API does not return the full expected object causing an error — trying again usually works.

Read my writeup & see some screenshots: https://ryelle.codes/2025/08/building-a-korean-grammar-breakdown-tool-with-ai-and-next-js/

## Try it out!

You'll need an OpenAI API key. Once you have it, create a file `.env.local` and add the key like this:

```
OPENAI_API_KEY=yourkeyhere
```

Now you can install the dependencies and start the app.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

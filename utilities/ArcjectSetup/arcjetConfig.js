import arcjet, { detectBot,protectSignup ,validateEmail  } from "@arcjet/node";

const aj = arcjet({
    key: process.env.ARCJET_KEY, // Get your site key from https://app.arcjet.com
    characteristics: ["ip.src"], // Track requests by IP
    rules: [
      validateEmail({
        mode: "LIVE", 
        block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
      }),
      protectSignup({
        email: {
          mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
          // Block emails that are disposable, invalid, or have no MX records
          block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
        },
        bots: {
          mode: "LIVE",
          // configured with a list of bots to allow from
          // https://arcjet.com/bot-list
          allow: [], // "allow none" will block all detected bots
        },
        // It would be unusual for a form to be submitted more than 5 times in 10
        // minutes from the same IP address
        rateLimit: {
          // uses a sliding window rate limit
          mode: "LIVE",
          interval: "10m", // counts requests over a 10 minute sliding window
          max: 5, // allows 5 submissions within the window
        },
      }),
      detectBot({
        mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
        // Block all bots except the following
        allow: [
          "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
          // Uncomment to allow these other common bot categories
          // See the full list at https://arcjet.com/bot-list
          //"CATEGORY:MONITOR", // Uptime monitoring services
          //"CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
        ],
      }),
    ],
  });

export default aj;
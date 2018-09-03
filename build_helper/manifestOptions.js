export const manifestOptions = {
  name: "Restaurant Review",
  short_name: "RR***",
  description: "Udacity Restaurant Review Stage 2 PWA",
  start_url: "/",
  background_color: "#ffffff",
  theme_color: "#ffffff",
  crossorigin: "use-credentials", // can be null, use-credentials or anonymous
  icons: [
    {
      src: path.resolve("src/icons/logo.png"),
      sizes: [96, 128, 192, 256, 384, 512] // multiple sizes
    } /* ,
      {
        src: path.resolve("src/assets/large-icon.png"),
        size: "1024x1024" // you can also use the specifications pattern
      } */
  ]
};

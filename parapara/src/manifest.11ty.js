export default class {
  data() {
    return { permalink: "/manifest.webmanifest", eleventyExcludeFromCollections: true };
  }
  render({ pp }) {
    return JSON.stringify({
      name: pp.site.name,
      short_name: pp.site.name,
      description: pp.site.tagline,
      lang: "he",
      dir: "rtl",
      start_url: "/",
      scope: "/",
      display: "standalone",
      background_color: "#f6f4ef",
      theme_color: "#3f6f5e",
      icons: [
        { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
        { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        { src: "/icons/icon.svg", sizes: "any", type: "image/svg+xml" },
      ],
    }, null, 2);
  }
}

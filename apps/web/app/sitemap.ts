import { MetadataRoute } from "next";
import { api } from "../convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";


// Create the client using the PUBLIC URL.
    const client = new ConvexHttpClient(process.env["NEXT_PUBLIC_CONVEX_URL"]);


// Set deploy key for admin access during build
if (process.env["CONVEX_DEPLOY_KEY"]) {
  client.setAuth(process.env["CONVEX_DEPLOY_KEY"]);
}


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const characters = await client.query(api.characters.listBackend, {});
  const images = await client.query(api.public.listImages, {});

  // Define your website's base URL once
const baseUrl = process.env.NEXTAUTH_URL || "https://my-ai-companion-docs.vercel.app/";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/models`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/crystals`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...characters.map((character) => ({
      url: `${baseUrl}/character/${character._id}`,
      lastModified: new Date(character.updatedAt),
      changeFrequency: "daily" as "daily",
      priority: 0.8,
    })),
    ...images.map((image) => ({
      url: `${baseUrl}/image/${image._id}`,
      lastModified: new Date(image._creationTime),
      changeFrequency: "daily" as "daily",
      priority: 0.8,
    })),
  ];
}

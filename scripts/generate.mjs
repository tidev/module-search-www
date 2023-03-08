import * as fs from "node:fs/promises";
import { Octokit } from "octokit";

const gh = new Octokit({
  auth: process.env.GITHUB_TOKEN || process.env.GH_TOKEN,
});

const searchResults = gh.paginate.iterator(gh.rest.search.repos, {
  q: "titanium in:topics language:objc language:swift language:java language:kotlin language:javascript",
  per_page: 100,
});

const repositories = [];
for await (const { data } of searchResults) {
  const mappedData = await Promise.all(data.map(mapData));
  repositories.push(...mappedData.filter((repo) => repo));
}

const out = new URL("../data.json", import.meta.url);
await fs.writeFile(out, JSON.stringify(repositories, undefined, "\t"));

async function mapData(data) {
  console.log(`mapping ${data.owner.login}/${data.name}`);
  const platforms = await getPlatforms(data);

  if (!platforms?.length) {
    return;
  }

  return {
    name: data.name,
    owner: {
      login: data.owner.login,
      html_url: data.owner.html_url,
    },
    html_url: data.html_url,
    description: data.description,
    updated_at: data.updated_at,
    platforms,
  };
}

async function getPlatforms(data) {
  const platforms = [];
  try {
    // Check for android and ios directories. We use allSettled as this will throw an error
    // if the folder does't exist so we check the Promise status to see whether the folder
    // existed or not
    const [android, ios, iphone] = await Promise.allSettled([
      gh.rest.repos.getContent({
        owner: data.owner.login,
        repo: data.name,
        path: "android",
      }),
      gh.rest.repos.getContent({
        owner: data.owner.login,
        repo: data.name,
        path: "ios",
      }),
      gh.rest.repos.getContent({
        owner: data.owner.login,
        repo: data.name,
        path: "iphone",
      }),
    ]);

    if (android.status === "fulfilled") {
      platforms.push("android");
    }

    if (ios.status === "fulfilled" || iphone.status === "fulfilled") {
      platforms.push("ios");
    }
  } catch (error) {
    return;
  }
  return platforms;
}

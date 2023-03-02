import { Octokit } from 'octokit';
import * as fs from 'node:fs/promises';

const gh = new Octokit();

const searchResults = gh.paginate.iterator(gh.rest.search.repos, {
    q: 'titanium in:topics language:objc language:swift language:java language:kotlin language:javascript'
});

const repositories = [];
for await (const {data} of searchResults) {
    repositories.push(...data.map(mapData));
}

const out = new URL('../data.json', import.meta.url);
await fs.writeFile(out, JSON.stringify(repositories, undefined, '\t'));

function mapData(data) {
    return {
        name: data.name,
        owner: {
            login: data.owner.login,
            html_url: data.owner.html_url,
        },
        html_url: data.html_url,
        description: data.description,
        updated_at: data.updated_at
    }
}

import fs from 'node:fs/promises';

console.info('Creating the output directory');

await fs.rm('./.output/data', { recursive: true, force: true });
await fs.mkdir('./.output/data', { recursive: true });

/** @returns {Promise<Array<import('./routes/releases').Release>>} */
const fetchReleases = async () => {
  const releasesJson = await (
    await fetch(
      'https://api.github.com/repos/mbinOrg/mbin/releases?per_page=100',
    )
  ).json();

  /** @type {Array<import('./routes/releases').Release>} */
  const output = releasesJson.map((v, i, a) => ({
    version: v.tag_name.substring(1),
    // A server is considered outdated if a newer version has been available for more than 30 days.
    outdated:
      i > 0 &&
      Date.now() - Date.parse(a[i - 1].published_at) > 1000 * 60 * 60 * 24 * 30,
    publishedAt: v.published_at,
    githubUrl: v.html_url,
    body: v.body,
  }));

  return output.sort((a, b) => a.publishedAt - b.publishedAt);
};

console.info('Fetching the latest Mbin releases');

const releases = await fetchReleases();
fs.writeFile('./.output/data/releases.json', JSON.stringify(releases), 'utf8');

/**
 * @returns {Promise<string[]>}
 */
const fetchServerList = async () => {
  /** @type Set<string> */
  const servers = new Set();

  console.info('Fetch Mbin servers from fediverse.observer API');
  // Fetch Mbin servers from fediverse.observer
  const fediverseObserver = await (
    await fetch('https://api.fediverse.observer/', {
      body: '{"query":"{nodes(softwarename:\\"mbin\\" status: \\"UP\\"){domain}}"}',
      method: 'POST',
    })
  ).json();

  for (const server of fediverseObserver.data.nodes) {
    servers.add(server.domain);
  }

  console.info('Fetch Mbin servers from fedidb.org API');
  let fedidbNextCursor = '';

  do {
    const fedidbServers = await (
      await fetch(
        `https://api.fedidb.org/v1.1/servers?software=mbin${
          fedidbNextCursor ? `&cursor=` + fedidbNextCursor : ''
        }`,
      )
    ).json();

    for (const server of fedidbServers.data) {
      servers.add(server.domain);
    }

    fedidbNextCursor = fedidbServers.meta.next_cursor;
  } while (fedidbNextCursor);

  return [...servers];
};

/**
 * @param {string} domain
 * @returns {Promise<import('./routes/servers').Server>}
 */
const fetchServerInfo = async (domain) => {
  console.info('START:', domain);

  let jsonNodeInfo;
  try {
    jsonNodeInfo = await (
      await fetch(`https://${domain}/nodeinfo/2.1.json`)
    ).json();

    if (jsonNodeInfo.software.name != 'mbin') {
      throw new Error(`software check failed`);
    }
  } catch (error) {
    throw new Error(`${domain}: invalid nodeinfo response (skip)`, {
      cause: error,
    });
  }

  /** @type {import('./routes/servers').Server['api']} */
  let apiOutput;
  try {
    const jsonApiInfo = await (
      await fetch(`https://${domain}/api/info`)
    ).json();
    if (jsonApiInfo.websiteDomain != domain) {
      throw new Error(`domain check failed`);
    }
    const jsonApiInstance = await (
      await fetch(`https://${domain}/api/instance`)
    ).json();
    const jsonApiDefederated = await (
      await fetch(`https://${domain}/api/defederated`)
    ).json();

    apiOutput = {
      defaultLang: jsonApiInfo.websiteDefaultLang ?? 'en',
      federationEnabled: jsonApiInfo.websiteFederationEnabled,
      contactEmail: jsonApiInfo.websiteContactEmail,
      pages: jsonApiInstance,
      defederated: jsonApiDefederated.instances ?? [],
    };
  } catch (error) {
    console.error(
      new Error(`${domain}: invalid api response (continue)`, {
        cause: error,
      }),
    );
  }

  /** @type {import('./routes/servers').Server} */
  const output = {
    domain: domain,
    version: jsonNodeInfo.software.version,
    versionOutdated: releases.find(
      (v) => v.version === jsonNodeInfo.software.version,
    ).outdated,
    name: jsonNodeInfo.metadata.nodeName,
    description: jsonNodeInfo.metadata.nodeDescription,
    openRegistrations: jsonNodeInfo.openRegistrations,
    totalUsers: jsonNodeInfo.usage.users.total,
    activeHalfyearUsers: jsonNodeInfo.usage.users.activeHalfyear,
    activeMonthUsers: jsonNodeInfo.usage.users.activeMonth,
    localPosts: jsonNodeInfo.usage.localPosts,
    localComments: jsonNodeInfo.usage.localComments,
    api: apiOutput,
  };

  console.info('FINISH:', domain);

  return output;
};

const initServerData = async () => {
  const serverDomains = await fetchServerList();

  const serversJson = (
    await Promise.allSettled(serverDomains.map(fetchServerInfo))
  )
    .filter((v) => {
      const isOk = v.status == 'fulfilled';

      if (!isOk) console.error(v.reason);

      return isOk;
    })
    .map((v) => v.value);

  console.info('Mbin servers found:', serversJson.length);

  fs.writeFile(
    './.output/data/servers.json',
    JSON.stringify(serversJson),
    'utf8',
  );
};

console.info('Start init server data');
await initServerData();
console.info('Done');

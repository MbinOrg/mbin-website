import fs from 'node:fs/promises';

await fs.rm('./.output/data', { recursive: true, force: true });
await fs.mkdir('./.output/data', { recursive: true });

/**
 * @returns {Promise<string>}
 */
const fetchServerList = async () => {
  /** @type Set<string> */
  const servers = new Set();

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

  // Fetch Mbin servers from fedidb.org. The api used below is not documented and is subject to change;
  // this is used due to the current publicized api not being sufficient for fetching Mbin server lists.
  // Once issue #3 (https://github.com/fedidb/issues/issues/3) is complete, then we can move to api v1.
  const fedidbCookies = (await fetch('https://fedidb.org')).headers
    .getSetCookie()
    .map((c) => c.split(';')[0]);

  const fedidbHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-XSRF-TOKEN': decodeURIComponent(
      fedidbCookies
        .find((c) => c.startsWith('XSRF-TOKEN='))
        .substring('XSRF-TOKEN='.length),
    ),
    Cookie: fedidbCookies.join('; '),
  };

  let fedidbNextCursor = '';

  do {
    const fedidbServers = await (
      await fetch(
        `https://fedidb.org/api/web/network/software/servers${
          fedidbNextCursor ? `?cursor=` + fedidbNextCursor : ''
        }`,
        {
          headers: fedidbHeaders,
          body: '{"slug":"mbin"}',
          method: 'POST',
        },
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
  console.log('START:', domain);

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

  console.log('FINISH:', domain);

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

  console.log('Mbin servers found:', serversJson.length);

  fs.writeFile(
    './.output/data/servers.json',
    JSON.stringify(serversJson),
    'utf8',
  );
};

await initServerData();

import fs from 'node:fs/promises';

await fs.rm('./.output/data', { recursive: true, force: true });
await fs.mkdir('./.output/data', { recursive: true });

const initServerData = async () => {
  const fediverseObserver = await (
    await fetch('https://api.fediverse.observer/', {
      body: '{"query":"{nodes(softwarename:\\"mbin\\" status: \\"UP\\"){domain}}"}',
      method: 'POST',
    })
  ).json();

  /** @type string[] */
  const servers = fediverseObserver.data.nodes.map((v) => v.domain);

  const serversJson = (
    await Promise.allSettled(
      servers.map(async (serverHost) => {
        console.log('START:', serverHost);

        const jsonNodeInfo = await (
          await fetch(`https://${serverHost}/nodeinfo/2.1.json`)
        ).json();

        if (jsonNodeInfo.software.name != 'mbin') {
          throw new Error(
            `${serverHost} software does not match mbin (skipped)`,
          );
        }

        const jsonApiInfo = await (
          await fetch(`https://${serverHost}/api/info`)
        ).json();
        if (jsonApiInfo.websiteDomain != serverHost) {
          throw new Error(`${serverHost} api not setup correctly (skipped)`);
        }
        const jsonApiInstance = await (
          await fetch(`https://${serverHost}/api/instance`)
        ).json();
        const jsonApiDefederated = await (
          await fetch(`https://${serverHost}/api/defederated`)
        ).json();

        console.log('FINISH:', serverHost);

        /** @type import('./routes/servers').Server */
        const server = {
          domain: serverHost,
          version: jsonNodeInfo.software.version,
          name: jsonNodeInfo.metadata.nodeName,
          description: jsonNodeInfo.metadata.nodeDescription,
          openRegistrations: jsonNodeInfo.openRegistrations,
          federationEnabled: jsonApiInfo.websiteFederationEnabled,
          language: jsonApiInfo.websiteDefaultLang ?? 'en',
          contactEmail: jsonApiInfo.websiteContactEmail,
          totalUsers: jsonNodeInfo.usage.users.total,
          activeHalfyearUsers: jsonNodeInfo.usage.users.activeHalfyear,
          activeMonthUsers: jsonNodeInfo.usage.users.activeMonth,
          localPosts: jsonNodeInfo.usage.localPosts,
          localComments: jsonNodeInfo.usage.localComments,
          pages: jsonApiInstance,
          defederated: jsonApiDefederated.instances ?? [],
        };

        return server;
      }),
    )
  )
    .filter((v) => v.status == 'fulfilled')
    .map((v) => v.value);

  fs.writeFile(
    './.output/data/servers.json',
    JSON.stringify(serversJson),
    'utf8',
  );
};

await initServerData();

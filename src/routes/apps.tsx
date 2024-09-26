import { ComponentProps, For, JSX, Show } from 'solid-js';
import Chip from '~/components/Chip';

import SimpleIconsAppstore from '~icons/simple-icons/appstore';
import SimpleIconsFdroid from '~icons/simple-icons/fdroid';
import SimpleIconsFlathub from '~icons/simple-icons/flathub';
import SimpleIconsGithub from '~icons/simple-icons/github';
import SimpleIconsGoogleplay from '~icons/simple-icons/googleplay';
import SimpleIconsMatrix from '~icons/simple-icons/matrix';
import SimpleIconsSnapcraft from '~icons/simple-icons/snapcraft';
import MaterialSymbolsWeb from '~icons/material-symbols/web';

import { apps, App } from '~/data/apps';

const linkMap: Record<
  keyof App['links'],
  { name: string; icon: (props: ComponentProps<'svg'>) => JSX.Element }
> = {
  github: {
    name: 'GitHub',
    icon: SimpleIconsGithub,
  },
  matrix: {
    name: 'Matrix',
    icon: SimpleIconsMatrix,
  },
  appleStore: {
    name: 'Apple App Store',
    icon: SimpleIconsAppstore,
  },
  fdroid: {
    name: 'F-Droid',
    icon: SimpleIconsFdroid,
  },
  flathub: {
    name: 'Flathub',
    icon: SimpleIconsFlathub,
  },
  googlePlay: {
    name: 'Google Play',
    icon: SimpleIconsGoogleplay,
  },
  microsoftStore: {
    name: 'Microsoft Store',
    icon: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M8 3.75V6H2.75a.75.75 0 0 0-.75.75v11.5A2.75 2.75 0 0 0 4.75 21h14.5A2.75 2.75 0 0 0 22 18.25V6.75a.75.75 0 0 0-.75-.75H16V3.75A1.75 1.75 0 0 0 14.25 2h-4.5A1.75 1.75 0 0 0 8 3.75m1.75-.25h4.5a.25.25 0 0 1 .25.25V6h-5V3.75a.25.25 0 0 1 .25-.25M8 13V9.5h3.5V13zm0 4.5V14h3.5v3.5zm8-4.5h-3.5V9.5H16zm-3.5 4.5V14H16v3.5z"
        ></path>
      </svg>
    ),
  },
  snapcraft: {
    name: 'Snapcraft',
    icon: SimpleIconsSnapcraft,
  },
  web: {
    name: 'Web',
    icon: MaterialSymbolsWeb,
  },
};

export default function ServersPage() {
  return (
    <main class="mx-auto p-4 max-w-screen-xl">
      <h1 class="max-6-xs text-5xl text-sky-600 uppercase my-16">
        Mbin Apps
      </h1>

      <div class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <For each={apps}>
          {(app) => {
            return (
              <div class="border rounded-lg p-4 block relative text-center">
                <img src={app.icon} class="inline-block size-16 rounded" />
                <br />
                <div class="text-3xl text-sky-600">{app.name}</div>

                <p class="text-center">{app.description}</p>

                <div class="my-1 flex flex-wrap gap-1">
                  <For each={Object.entries(linkMap)}>
                    {([key, value]) => (
                      <Show when={app.links[key]}>
                        <Chip href={app.links[key]} icon={value.icon}>
                          {value.name}
                        </Chip>
                      </Show>
                    )}
                  </For>
                </div>
              </div>
            );
          }}
        </For>
      </div>

      <div class="my-8 text-center font-light">
        Don't see your app here? Contribute to the list by making a pull request{' '}
        <a
          href="https://github.com/MbinOrg/mbin-website/blob/main/src/data/apps.ts"
          class="text-sky-600"
        >
          here
        </a>
        .
      </div>
    </main>
  );
}

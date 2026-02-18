export interface App {
  name: string;
  icon: string;
  description: string;
  links: {
    appleStore?: string;
    fdroid?: string;
    flathub?: string;
    github?: string;
    googlePlay?: string;
    microsoftStore?: string;
    matrix?: string;
    snapcraft?: string;
    web?: string;
  };
}

export const apps: App[] = [
  {
    name: 'Interstellar',
    icon: 'https://raw.githubusercontent.com/interstellar-app/interstellar/77289c13eb63347ad68aca20016c2daa35855f7a/assets/icons/logo.png',
    description: 'An app for Mbin and Lemmy, connecting you to the fediverse.',
    links: {
      appleStore: 'https://apps.apple.com/us/app/id6745356296',
      fdroid: 'https://apt.izzysoft.de/fdroid/index/apk/one.jwr.interstellar',
      flathub: 'https://flathub.org/apps/one.jwr.interstellar',
      github: 'https://github.com/interstellar-app/interstellar',
      googlePlay:
        'https://play.google.com/store/apps/details?id=one.jwr.interstellar',
      matrix: 'https://matrix.to/#/#interstellar-space:matrix.org',
    },
  },
];

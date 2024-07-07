import { Button } from '~/components/ui/button';

export default function Home() {
  return (
    <main class="mx-auto p-4 max-w-screen-lg">
      <div class="my-20 text-center">
        <h1 class="text-5xl text-sky-600 font-light uppercase">Mbin</h1>
        <p class="my-8 text-2xl text-gray-400 block mx-auto">
          A federated content aggregator, voting, discussion and microblogging
          platform
          <br />
          (By the community, for the community)
        </p>
        <div class="flex flex-wrap justify-center gap-2">
          <Button as="a" href="/servers">
            Join a Server
          </Button>
          <Button
            as="a"
            href="https://docs.joinmbin.org/admin/"
            variant="outline"
          >
            Start Your Own Server
          </Button>
        </div>
      </div>

      <div class="my-10 markdown">
        <h2 class="text-center">What Is Mbin</h2>
        <p>
          Mbin is a decentralized content aggregator, voting, discussion and
          microblogging platform running on the fediverse network. It can
          communicate with many other ActivityPub services, including Kbin,
          Mastodon, Lemmy, Pleroma, Peertube. The initiative aims to promote a
          free and open internet.
        </p>
        <p>
          Mbin is a fork of{' '}
          <a href="https://codeberg.org/Kbin/kbin-core">/kbin</a>,
          community-focused. Feel free to discuss on{' '}
          <a href="https://matrix.to/#/#mbin:melroy.org">Matrix</a> and to
          create Pull Requests.
        </p>
        <p>
          Mbin is focused on what the community wants, pull requests can be
          merged by any repo maintainer (with merge rights in GitHub).
          Discussions take place on{' '}
          <a href="https://matrix.to/#/#mbin:melroy.org">Matrix</a> then{' '}
          <i>consensus</i> has to be reached by the community. If approved by
          the community, only one approval on the PR is required by one of the
          Mbin maintainers. It's built entirely on trust.
        </p>
      </div>

      <div class="my-10 markdown">
        <h2 class="text-center">Why Use Mbin</h2>
        <p>Unique Features of Mbin for server owners &amp; users alike:</p>
        <ul>
          <li>
            Tons of{' '}
            <strong>
              <a href="https://github.com/MbinOrg/mbin/pulls?q=is%3Apr+is%3Amerged+label%3Afrontend">
                GUI improvements
              </a>
            </strong>
          </li>
          <li>
            A lot of{' '}
            <strong>
              <a href="https://github.com/MbinOrg/mbin/pulls?q=is%3Apr+is%3Amerged+label%3Aenhancement">
                enhancements
              </a>
            </strong>
          </li>
          <li>
            Various{' '}
            <strong>
              <a href="https://github.com/MbinOrg/mbin/pulls?q=is%3Apr+is%3Amerged+label%3Abug">
                bug fixes
              </a>
            </strong>
          </li>
          <li>
            Support of <strong>all</strong> ActivityPub Actor Types (including
            also &quot;Service&quot; account support; thus support for robot
            accounts)
          </li>
          <li>
            <strong>Up-to-date</strong> PHP packages and{' '}
            <strong>security/vulnerability</strong> issues fixed
          </li>
          <li>
            Support for <code>application/json</code> Accept request header on
            all ActivityPub end-points
          </li>
          <li>
            Introducing a hosted documentation:{' '}
            <a href="https://docs.joinmbin.org">docs.joinmbin.org</a>
          </li>
        </ul>
        <p>
          See also:{' '}
          <a href="https://github.com/MbinOrg/mbin/pulls?q=is%3Apr+is%3Amerged">
            all merged PRs
          </a>{' '}
          or <a href="https://github.com/MbinOrg/mbin/releases">our releases</a>
          .
        </p>
        <p>For developers:</p>
        <ul>
          <li>
            Improved{' '}
            <a href="https://docs.joinmbin.org/admin/installation/bare_metal">
              bare metal/VM guide
            </a>{' '}
            and{' '}
            <a href="https://docs.joinmbin.org/admin/installation/docker/">
              Docker guide
            </a>
          </li>
          <li>
            <a href="https://github.com/MbinOrg/mbin/pulls?q=is%3Apr+is%3Amerged+label%3Adocker">
              Improved Docker setup
            </a>
          </li>
          <li>
            <em>Developer</em> server explained (see{' '}
            <a href="https://docs.joinmbin.org/contributing/development_server">
              Development Server documentation here
            </a>{' '}
            )
          </li>
          <li>
            GitHub Security advisories, vulnerability reporting,{' '}
            <a href="https://github.com/features/security">Dependabot</a> and{' '}
            <a href="https://docs.github.com/en/code-security/code-scanning/introduction-to-code-scanning/about-code-scanning">
              Advanced code scanning
            </a>{' '}
            enabled. And we run{' '}
            <a href="https://github.com/fabpot/local-php-security-checker">
              <code>local-php-security-checker</code>
            </a>
            .
          </li>
          <li>
            Improved <strong>code documentation</strong>
          </li>
          <li>
            <strong>Tight integration</strong> with{' '}
            <a href="https://hosted.weblate.org/engage/mbin/">
              Mbin Weblate project
            </a>{' '}
            for translations (Two way sync)
          </li>
          <li>
            Last but not least, a{' '}
            <strong>
              community-focus project embracing the Collective Code Construction
              Contract
            </strong>{' '}
            (C4). No single maintainer.
          </li>
        </ul>
      </div>
    </main>
  );
}

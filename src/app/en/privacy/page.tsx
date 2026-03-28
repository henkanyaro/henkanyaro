import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Henkan Yaro",
  description:
    "Privacy policy for Henkan Yaro. Information about advertising, analytics, and data handling.",
  alternates: {
    canonical: "/en/privacy",
    languages: {
      ja: "/privacy",
      en: "/en/privacy",
    },
  },
};

export default function PrivacyPageEn() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-2">
        Privacy<span className="text-accent"> Policy</span>
      </h1>
      <p className="text-muted text-sm mb-12">Last updated: March 28, 2026</p>

      <div className="space-y-10 text-foreground">
        <section>
          <p className="leading-relaxed">
            Henkan Yaro (&quot;this site&quot;) establishes the following
            privacy policy regarding the handling of users&apos; personal
            information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 pb-2 border-b border-border">
            Advertising (Google AdSense)
          </h2>
          <p className="leading-relaxed text-muted mb-3">
            This site uses Google AdSense, an advertising service provided by
            Google LLC. Google AdSense may use cookies to display ads tailored
            to your interests.
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted">
            <li>
              Information collected via cookies does not include your name,
              address, email address, or phone number.
            </li>
            <li>
              You can opt out of data collection by disabling cookies in your
              browser settings.
            </li>
            <li>
              For more details on how Google delivers ads and uses cookies,
              please refer to{" "}
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline underline-offset-2 hover:text-accent-hover"
              >
                Google&apos;s Policies and Terms
              </a>
              .
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 pb-2 border-b border-border">
            Access Analytics
          </h2>
          <p className="leading-relaxed text-muted mb-3">
            This site may use analytics tools to improve the service. These
            tools use cookies to collect traffic data.
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted">
            <li>
              Collected data is anonymous and does not identify individuals.
            </li>
            <li>
              You can opt out by disabling cookies in your browser settings.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 pb-2 border-b border-border">
            Disclaimer
          </h2>
          <p className="leading-relaxed text-muted mb-3">
            While we strive to provide accurate information, we make no
            warranties regarding the accuracy or safety of the content on this
            site.
          </p>
          <p className="leading-relaxed text-muted mb-3">
            All tools on this site run entirely in your browser and do not send
            data to any server. However, the site operator assumes no
            responsibility for any damage or loss arising from the use of this
            site.
          </p>
          <p className="leading-relaxed text-muted">
            This site is not responsible for the content or safety of external
            sites linked from this site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 pb-2 border-b border-border">
            Contact
          </h2>
          <p className="leading-relaxed text-muted">
            For inquiries regarding this privacy policy, please use the contact
            form on this site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 pb-2 border-b border-border">
            Policy Updates
          </h2>
          <p className="leading-relaxed text-muted">
            This site may update this privacy policy as needed. Updated policies
            take effect upon posting on this page. We recommend checking back
            periodically.
          </p>
        </section>
      </div>
    </div>
  );
}

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | TeamFlow',
  description: 'Privacy Policy and data protection information for TeamFlow',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-6">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="mb-4">
            TeamFlow ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
          <h3 className="text-xl font-medium mt-4 mb-2">2.1 Personal Information</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Name and email address</li>
            <li>Profile information (avatar, timezone)</li>
            <li>Authentication credentials (encrypted)</li>
          </ul>
          
          <h3 className="text-xl font-medium mt-4 mb-2">2.2 Usage Data</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Log data (IP address, browser type, pages visited)</li>
            <li>Device information</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
          <ul className="list-disc pl-6">
            <li>To provide and maintain our service</li>
            <li>To notify you about changes to our service</li>
            <li>To provide customer support</li>
            <li>To detect, prevent and address technical issues</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Legal Basis for Processing (GDPR)</h2>
          <p className="mb-4">We process your personal data under the following legal bases:</p>
          <ul className="list-disc pl-6 mt-2">
            <li><strong>Consent:</strong> You have given clear consent for us to process your personal data</li>
            <li><strong>Contract:</strong> Processing is necessary for a contract you have with us</li>
            <li><strong>Legitimate interests:</strong> Processing is in our legitimate interests and not overridden by your rights</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Your Data Protection Rights (GDPR)</h2>
          <p className="mb-4">Under GDPR, you have the following rights:</p>
          <ul className="list-disc pl-6 mt-2">
            <li><strong>Right to access:</strong> Request copies of your personal data</li>
            <li><strong>Right to rectification:</strong> Request correction of inaccurate data</li>
            <li><strong>Right to erasure:</strong> Request deletion of your personal data</li>
            <li><strong>Right to restrict processing:</strong> Request restriction of processing your data</li>
            <li><strong>Right to data portability:</strong> Request transfer of your data</li>
            <li><strong>Right to object:</strong> Object to our processing of your data</li>
          </ul>
          <p className="mt-4">
            To exercise these rights, please contact us at: <a href="mailto:privacy@teamflow.app" className="text-blue-600 hover:underline">privacy@teamflow.app</a>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
          <p className="mb-4">
            We retain your personal data only for as long as necessary for the purposes set out in this Privacy Policy. We will retain and use your data to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Data Security</h2>
          <p className="mb-4">
            We implement appropriate technical and organizational security measures to protect your personal data. However, no method of transmission over the internet is 100% secure.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Cookies</h2>
          <p className="mb-4">
            We use cookies and similar tracking technologies. You can instruct your browser to refuse all cookies or indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. International Data Transfers</h2>
          <p className="mb-4">
            Your information may be transferred to and maintained on computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ. We ensure appropriate safeguards are in place for such transfers.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Changes to This Privacy Policy</h2>
          <p className="mb-4">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
          <p className="mb-2">
            If you have questions about this Privacy Policy, please contact us at:
          </p>
          <p className="mt-2">
            Email: <a href="mailto:privacy@teamflow.app" className="text-blue-600 hover:underline">privacy@teamflow.app</a>
          </p>
        </section>
      </div>
    </div>
  );
}

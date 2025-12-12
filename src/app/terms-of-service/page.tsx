import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | TeamFlow',
  description: 'Terms of Service for using TeamFlow',
};

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-6">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing and using TeamFlow, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
          <p className="mb-4">
            TeamFlow provides a web-based project management and collaboration platform. We reserve the right to modify, suspend, or discontinue the service at any time without prior notice.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
          <p className="mb-4">
            You are responsible for:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Maintaining the confidentiality of your account and password</li>
            <li>All activities that occur under your account</li>
            <li>Notifying us immediately of any unauthorized use</li>
            <li>Providing accurate and complete registration information</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use Policy</h2>
          <p className="mb-4">You agree NOT to use TeamFlow to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe upon intellectual property rights of others</li>
            <li>Transmit harmful, offensive, or illegal content</li>
            <li>Engage in unauthorized access or security breaches</li>
            <li>Distribute spam, malware, or phishing attempts</li>
            <li>Impersonate another person or entity</li>
            <li>Interfere with or disrupt the service</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
          <p className="mb-4">
            All content, features, and functionality of TeamFlow are owned by us and protected by international copyright, trademark, and other intellectual property laws.
          </p>
          <p className="mb-4">
            You retain all rights to content you create and upload to TeamFlow. By uploading content, you grant us a license to use, store, and display that content solely for the purpose of providing the service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Privacy and Data Protection</h2>
          <p className="mb-4">
            Your use of TeamFlow is also governed by our <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a>. We are committed to protecting your data in accordance with GDPR and other applicable data protection laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
          <p className="mb-4">
            To the maximum extent permitted by law, TeamFlow shall not be liable for:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Any indirect, incidental, special, or consequential damages</li>
            <li>Loss of profits, data, or business opportunities</li>
            <li>Service interruptions or technical issues</li>
            <li>Unauthorized access to your account or data</li>
          </ul>
          <p className="mb-4">
            Our total liability shall not exceed the amount you paid for the service in the past 12 months.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Indemnification</h2>
          <p className="mb-4">
            You agree to indemnify and hold harmless TeamFlow from any claims, damages, losses, or expenses arising from your use of the service or violation of these terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Termination</h2>
          <p className="mb-4">
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Breach of these Terms of Service</li>
            <li>Violation of applicable laws</li>
            <li>Fraudulent or harmful activity</li>
            <li>Extended periods of inactivity</li>
          </ul>
          <p className="mb-4">
            You may terminate your account at any time by contacting us or using the account deletion feature.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Changes to Terms</h2>
          <p className="mb-4">
            We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through the service. Continued use after changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Governing Law</h2>
          <p className="mb-4">
            These Terms shall be governed by the laws of the European Union and applicable member state laws, without regard to conflict of law provisions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. Dispute Resolution</h2>
          <p className="mb-4">
            Any disputes arising from these terms or your use of TeamFlow shall first be resolved through good-faith negotiations. If unresolved, disputes may be subject to arbitration or court proceedings in accordance with EU law.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">13. Contact Information</h2>
          <p className="mb-2">
            For questions about these Terms of Service, please contact us at:
          </p>
          <p className="mt-2">
            Email: <a href="mailto:legal@teamflow.app" className="text-blue-600 hover:underline">legal@teamflow.app</a>
          </p>
        </section>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { LegalDocument, LegalSection } from "@/components/legal/LegalDocument";

export const metadata: Metadata = {
  title: "Privacy Policy — Tally",
  description: "Privacy Policy for Tally, the group expense tracking app.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalDocument title="Privacy Policy">
      <LegalSection title="1. What We Collect">
        <p>
          We collect information needed to run Tally and keep your trips
          accurate:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="text-[#F8F8FF]">Account information</span> —
            your email address, display name, and profile photo when provided
            through Google OAuth.
          </li>
          <li>
            <span className="text-[#F8F8FF]">Trip and expense data</span> —
            trip names, destinations, dates, expense amounts, categories,
            notes, and the split details you enter.
          </li>
          <li>
            <span className="text-[#F8F8FF]">Usage data</span> — basic app
            interaction signals used for debugging and improving the product.
          </li>
          <li>
            <span className="text-[#F8F8FF]">Receipt images</span> — photos
            you upload for AI receipt scanning, which are processed and
            stored temporarily for that purpose.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="2. How We Use Your Data">
        <p>We use your data to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Provide the core Tally service — trip management, expense
            splitting, and balance calculation.
          </li>
          <li>
            Send in-app notifications about activity in your trips (for
            example, new expenses or settlements).
          </li>
          <li>
            Improve the product using anonymized usage patterns.
          </li>
        </ul>
        <p>We never sell your personal data to third parties.</p>
      </LegalSection>

      <LegalSection title="3. How We Store Your Data">
        <p>
          Your account and trip data are stored securely in Amazon DynamoDB.
          Receipt images are stored in encrypted cloud storage. All data
          transmitted between your device and our servers is encrypted via
          HTTPS.
        </p>
      </LegalSection>

      <LegalSection title="4. AI Receipt Scanning">
        <p>
          When you use receipt scanning, your image is sent to Anthropic&apos;s
          Claude API so we can extract merchant, amount, and line-item text.
          Anthropic does not retain your images beyond the duration of the API
          call. We may temporarily store the processed image URL for reference
          on your expense record.
        </p>
      </LegalSection>

      <LegalSection title="5. Data Sharing">
        <p>
          We do not sell or share your personal data with third parties except
          as needed to operate Tally:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="text-[#F8F8FF]">Anthropic</span> — receipt image
            processing, as described above.
          </li>
          <li>
            <span className="text-[#F8F8FF]">AWS</span> — infrastructure and
            data storage.
          </li>
          <li>
            <span className="text-[#F8F8FF]">Vercel</span> — application
            hosting.
          </li>
        </ul>
        <p>
          These providers are bound by their own privacy policies and data
          processing agreements with us.
        </p>
      </LegalSection>

      <LegalSection title="6. Your Rights">
        <p>
          You can request deletion of your account and associated personal
          data at any time by contacting us. When an account is deleted, your
          personal identifiers are anonymized. Expense amounts may remain in
          shared trip records because other members&apos; balances and history
          depend on them.
        </p>
      </LegalSection>

      <LegalSection title="7. Cookies">
        <p>
          Tally uses a single HTTP-only session cookie for authentication. We
          do not use tracking cookies or third-party advertising cookies.
        </p>
      </LegalSection>

      <LegalSection title="8. Children's Privacy">
        <p>
          Tally is not directed at children under 13. We do not knowingly
          collect personal data from children under 13. If you believe a
          child has provided us data, contact us and we will take appropriate
          steps to remove it.
        </p>
      </LegalSection>

      <LegalSection title="9. Changes to This Policy">
        <p>
          We may update this policy periodically. Significant changes will be
          communicated via in-app notification. The &quot;Last updated&quot;
          date at the top of this page will always reflect the latest
          revision.
        </p>
      </LegalSection>

      <LegalSection title="10. Contact">
        <p>
          For privacy questions or data deletion requests, email{" "}
          <a
            href="mailto:privacy@tally.app"
            className="text-[#F8F8FF] underline underline-offset-2"
          >
            privacy@tally.app
          </a>
          .
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
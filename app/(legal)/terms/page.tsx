import type { Metadata } from "next";
import { LegalDocument, LegalSection } from "@/components/legal/LegalDocument";

export const metadata: Metadata = {
  title: "Terms of Service — Tally",
  description: "Terms of Service for Tally, the group expense tracking app.",
};

export default function TermsOfServicePage() {
  return (
    <LegalDocument title="Terms of Service">
      <LegalSection title="1. What Tally Is">
        <p>
          Tally is a group expense tracking tool that helps friends and
          travel companions split costs, see who owes whom, and record
          settlements. Tally does not process, hold, or transfer real money.
          Any payments between users happen entirely outside the app — Tally
          only records that those payments occurred, based on what you enter.
        </p>
      </LegalSection>

      <LegalSection title="2. Eligibility">
        <p>
          You must be at least 13 years old to use Tally. By creating an
          account or using the service, you confirm that you meet this age
          requirement.
        </p>
      </LegalSection>

      <LegalSection title="3. Your Account">
        <p>
          You are responsible for keeping your account secure. Do not share
          your sign-in credentials, authentication codes, or sign-in links
          with anyone else. You are responsible for all activity that occurs
          under your account, including expenses and settlements recorded
          while you are signed in.
        </p>
      </LegalSection>

      <LegalSection title="4. Acceptable Use">
        <p>
          Use Tally only for lawful purposes. You may not use Tally to
          record fraudulent transactions, impersonate other people, access
          another person&apos;s account without permission, or manipulate
          another user&apos;s expense records without their knowledge. We may
          investigate and take action against accounts that abuse the
          service.
        </p>
      </LegalSection>

      <LegalSection title="5. Expense & Settlement Records">
        <p>
          Tally stores expenses and settlements as entered by users. We do
          not independently verify amounts, payers, participants, or whether
          a real-world payment was made. You and your trip members are
          responsible for the accuracy of entries in your shared trips.
        </p>
      </LegalSection>

      <LegalSection title="6. No Financial Liability">
        <p>
          Tally is not a bank, payment processor, money transmitter, or
          financial institution. We are not liable for disputes between
          users over money owed, paid, or allegedly unpaid. Any financial
          disagreement is solely between the people involved.
        </p>
      </LegalSection>

      <LegalSection title="7. Intellectual Property">
        <p>
          The Tally name, logo, product design, and software are owned by
          the Tally team. You may not copy, reproduce, redistribute, or
          reverse-engineer any part of the product without our prior written
          permission, except as allowed by applicable law.
        </p>
      </LegalSection>

      <LegalSection title="8. Termination">
        <p>
          We reserve the right to suspend or terminate accounts that violate
          these terms, or that we reasonably believe pose a risk to the
          service or other users, without prior notice.
        </p>
      </LegalSection>

      <LegalSection title="9. Changes to These Terms">
        <p>
          We may update these terms from time to time. When we do, we will
          revise the &quot;Last updated&quot; date at the top of this page.
          Continued use of Tally after changes take effect constitutes
          acceptance of the revised terms.
        </p>
      </LegalSection>

      <LegalSection title="10. Contact">
        <p>
          Questions about these terms? Reach us at{" "}
          <a
            href="mailto:support@tally.app"
            className="text-[#F8F8FF] underline underline-offset-2"
          >
            support@tally.app
          </a>
          .
        </p>
      </LegalSection>
    </LegalDocument>
  );
}

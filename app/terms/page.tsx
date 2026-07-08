import { Card, CardContent } from "../components/ui/Card";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold text-foreground md:text-3xl uppercase mb-8 text-center">
        Terms &amp; Conditions
      </h1>

      <Card>
        <CardContent className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. Warranty Coverage</h2>
            <p>
              Castrol Batteries provides a limited warranty of twenty-four (24) months from the date of purchase for all registered battery products. This warranty covers defects in materials and workmanship under normal use and service conditions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">2. Eligibility</h2>
            <p>
              To be eligible for warranty coverage, the battery must be registered within thirty (30) days of purchase through this portal. Proof of purchase (receipt or invoice) may be required when filing a warranty claim.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">3. Exclusions</h2>
            <p>This warranty does not cover:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Damage caused by misuse, abuse, neglect, or accident</li>
              <li>Damage from improper installation or maintenance</li>
              <li>Normal wear and tear or gradual capacity reduction</li>
              <li>Batteries used in applications other than their intended purpose</li>
              <li>Damage caused by overcharging, deep discharging, or use of incompatible chargers</li>
              <li>Batteries with altered, defaced, or removed serial numbers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Claim Process</h2>
            <p>
              To file a warranty claim, bring the battery to an authorised Castrol workshop or dealer. The battery will be inspected and tested. If the defect is covered under warranty, a replacement will be provided at no charge.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">5. Limitation of Liability</h2>
            <p>
              Castrol Batteries&apos; liability is limited to the replacement of the defective battery. In no event shall Castrol be liable for incidental, consequential, or indirect damages arising from the use or inability to use the product.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">6. Data Collection &amp; Privacy</h2>
            <p>
              By registering your product, you consent to the collection and storage of the personal information provided (name, email, phone number) for the purpose of warranty administration. Your data may also be used to send you promotional offers, product updates, and marketing communications from Castrol United Batteries. You may opt out of marketing communications at any time. Your data will not be shared with third parties except as required to process warranty claims.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">7. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of Singapore. Any disputes shall be subject to the exclusive jurisdiction of the courts of Singapore.
            </p>
          </section>

          <p className="text-xs text-muted-foreground pt-4 border-t">
            Last updated: July 2026
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

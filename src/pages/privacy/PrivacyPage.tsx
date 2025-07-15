import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";

export function PrivacyPage() {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleGoBack}
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold text-primary">Privacy Policy</h1>
        </div>

        <div className="prose prose-lg max-w-none space-y-8">
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              At Lexo, we place great importance on protecting your personal data. 
              This privacy policy explains how we collect, use, store and 
              protect your personal information when you use our application.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              By using Lexo, you agree to the practices described in this privacy policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Collection</h2>
            <h3 className="text-xl font-medium mb-3">Information we collect</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Account information: username, email address, date of birth</li>
              <li>Usage data: learning progress, study time, completed exercises</li>
              <li>Technical information: device type, operating system, IP address</li>
              <li>Google login data (if applicable): Google ID, public profile</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Usage</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We use your personal data to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Provide and maintain our learning services</li>
              <li>Personalize your learning experience</li>
              <li>Track your progress and offer adapted content</li>
              <li>Communicate with you regarding your account</li>
              <li>Improve our services and develop new features</li>
              <li>Ensure security and prevent fraud</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Our data retention policies and procedures are designed to help ensure that we 
              comply with our legal obligations in relation to the retention and deletion 
              of personal data.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Personal data that we process for any purpose or purposes shall be kept until 
              such time as we receive a request for deletion from you.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You can also delete your Lexo account and all your personal data 
              through the settings menu of the mobile app.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Notwithstanding the other provisions, we will retain your personal data where 
              such retention is necessary for compliance with a legal obligation to which we 
              are subject, or in order to protect your vital interests or the vital interests 
              of another natural person.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Sharing</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We do not sell, trade or rent your personal data to third parties. 
              We may share your information in the following cases:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>With your explicit consent</li>
              <li>To comply with legal obligations</li>
              <li>With service providers who help us provide our services</li>
              <li>In case of merger, acquisition or asset sale</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement appropriate technical and organizational security measures 
              to protect your personal data against unauthorized access, alteration, 
              disclosure or destruction. However, no method of transmission over the Internet 
              or electronic storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              In accordance with GDPR, you have the following rights:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Right of access:</strong> obtain a copy of your personal data</li>
              <li><strong>Right of rectification:</strong> correct inaccurate data</li>
              <li><strong>Right to erasure:</strong> request deletion of your data</li>
              <li><strong>Right to portability:</strong> receive your data in a structured format</li>
              <li><strong>Right to object:</strong> object to the processing of your data</li>
              <li><strong>Right to restriction:</strong> restrict the processing of your data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Third-party Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our application may contain links to third-party websites or use 
              third-party services (such as Google for authentication). We are not 
              responsible for the privacy practices of these third parties. We encourage 
              you to read their privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have any questions about this privacy policy or 
              wish to exercise your rights, please contact us:
            </p>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-muted-foreground">
                <strong>Email:</strong> aladdine.dev@gmail.com<br />
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

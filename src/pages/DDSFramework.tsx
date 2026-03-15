import { useState } from "react";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { ArrowRight, CheckCircle2, ChevronRight, Download } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import drRomulus from "@/assets/dr-romulus.jpeg";
import DDSHeroSection from "@/components/dds/DDSHeroSection";
import DDSFrameworkOverview from "@/components/dds/DDSFrameworkOverview";
import DDSLearnSection from "@/components/dds/DDSLearnSection";
import DDSLeadForm from "@/components/dds/DDSLeadForm";
import DDSGuideAccess from "@/components/dds/DDSGuideAccess";
import DDSQuiz from "@/components/dds/DDSQuiz";
import DDSNextStepOffer from "@/components/dds/DDSNextStepOffer";

const DIAGNOSTIC_KIT_URL = "https://link.drromulusmba.com/payment-link/69939e59e6b9117c66e733dd";

const DDSFramework = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.email.trim() || !formData.phone.trim()) return;

    setLoading(true);
    try {
      // Store in admin dashboard
      const { error } = await supabase.from("leads").insert({
        full_name: formData.firstName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        source: "dds-framework",
        status: "new",
      });
      if (error) throw error;

      // Send to GHL
      supabase.functions.invoke("ghl-dds-webhook", {
        body: {
          firstName: formData.firstName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
        },
      }).catch((err) => console.error("GHL webhook error:", err));

      setSubmitted(true);
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById("dds-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <SEOHead
        title="DDS Framework™ Breakdown Guide | Dr. Deanna Romulus"
        description="Discover the DDS Framework™ — Diagnose, Design, Scale. Learn how founders build predictable revenue by fixing structural problems first."
        canonicalUrl="/dds-framework"
      />

      <div className="min-h-screen bg-[hsl(var(--slate-deep))] text-[hsl(var(--cream))] font-body">
        <DDSHeroSection onCTAClick={scrollToForm} />
        <DDSFrameworkOverview />
        <DDSLearnSection />

        <DDSLeadForm
          submitted={submitted}
          loading={loading}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
        />

        {submitted && (
          <>
            <DDSGuideAccess />
            <DDSQuiz
              leadEmail={formData.email.trim()}
              leadFirstName={formData.firstName.trim()}
              leadPhone={formData.phone.trim()}
            />
          </>
        )}

        <DDSNextStepOffer diagnosticKitUrl={DIAGNOSTIC_KIT_URL} />

        {/* Minimal Footer */}
        <footer className="py-8 border-t border-[hsl(var(--gold)/0.1)]">
          <div className="container mx-auto px-6 text-center text-sm" style={{ color: "hsl(220 15% 45%)" }}>
            © {new Date().getFullYear()} Dr. Deanna Romulus, MBA. All rights reserved.
          </div>
        </footer>
      </div>
    </>
  );
};

export default DDSFramework;

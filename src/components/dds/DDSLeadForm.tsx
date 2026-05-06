import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  submitted: boolean;
  loading: boolean;
  formData: { firstName: string; email: string; phone: string };
  setFormData: React.Dispatch<React.SetStateAction<{ firstName: string; email: string; phone: string }>>;
  onSubmit: (e: React.FormEvent) => void;
}

const DDSLeadForm = ({ submitted, loading, formData, setFormData, onSubmit }: Props) => {
  if (submitted) return null;

  return (
    <section id="dds-form" className="py-20 md:py-28 bg-[hsl(var(--slate-medium))]">
      <div className="container mx-auto px-6 max-w-lg">
        <div className="bg-[hsl(var(--slate-deep))] border border-[hsl(var(--gold)/0.2)] rounded-2xl p-8 md:p-10">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-3">
            Get the DDS Framework Breakdown Guide
          </h2>
          <p className="text-center text-sm mb-8" >
            Enter your information below and we'll send you the DDS Framework Breakdown Guide.
          </p>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <Label htmlFor="firstName" className="text-[hsl(var(--cream))]">First Name</Label>
              <Input
                id="firstName"
                required
                maxLength={100}
                placeholder="Your first name"
                value={formData.firstName}
                onChange={(e) => setFormData((p) => ({ ...p, firstName: e.target.value }))}
                className="mt-1.5 bg-[hsl(var(--slate-medium))] border-[hsl(var(--gold)/0.2)] text-[hsl(var(--cream))] placeholder:text-muted-foreground"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-[hsl(var(--cream))]">Email Address</Label>
              <Input
                id="email"
                type="email"
                required
                maxLength={255}
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                className="mt-1.5 bg-[hsl(var(--slate-medium))] border-[hsl(var(--gold)/0.2)] text-[hsl(var(--cream))] placeholder:text-muted-foreground"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-[hsl(var(--cream))]">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                required
                maxLength={20}
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                className="mt-1.5 bg-[hsl(var(--slate-medium))] border-[hsl(var(--gold)/0.2)] text-[hsl(var(--cream))] placeholder:text-muted-foreground"
              />
            </div>

            <Button type="submit" variant="gold" size="lg" className="w-full" disabled={loading}>
              {loading ? "Sending…" : "Send Me the DDS Guide"}
            </Button>

            <p className="text-center text-xs mt-3" >
              No spam. Just the DDS Framework guide.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default DDSLeadForm;

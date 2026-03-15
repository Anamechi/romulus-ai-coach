import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const DIAGNOSTIC_KIT_URL = "https://link.drromulusmba.com/payment-link/69939e59e6b9117c66e733dd";

const QUESTIONS = [
  "Do you have a clearly defined primary offer?",
  "Is your revenue predictable month-to-month?",
  "Do you have a structured client acquisition system?",
  "Do you know the primary constraint limiting your income?",
  "Do your offers align with a clear revenue architecture?",
];

const OPTIONS = [
  { label: "Yes", value: "yes", points: 2 },
  { label: "Somewhat", value: "somewhat", points: 1 },
  { label: "No", value: "no", points: 0 },
];

// Q2 has different middle option
const OPTIONS_Q2 = [
  { label: "Yes", value: "yes", points: 2 },
  { label: "Sometimes", value: "sometimes", points: 1 },
  { label: "No", value: "no", points: 0 },
];

// Q4 has different middle option
const OPTIONS_Q4 = [
  { label: "Yes", value: "yes", points: 2 },
  { label: "Unsure", value: "unsure", points: 1 },
  { label: "No", value: "no", points: 0 },
];

function getOptionsForQuestion(index: number) {
  if (index === 1) return OPTIONS_Q2;
  if (index === 3) return OPTIONS_Q4;
  return OPTIONS;
}

function getResult(score: number) {
  if (score <= 3) {
    return {
      stage: "Awareness or Diagnosis",
      message: "Your business likely has foundational structural revenue gaps.",
      cta: "Identify your primary constraint using the Complete Income Systems Diagnostic Kit™",
    };
  }
  if (score <= 7) {
    return {
      stage: "Clarity or Architecture",
      message: "Your business has some structure but may be missing key revenue architecture components.",
      cta: "Use the diagnostic kit to identify the next structural upgrade.",
    };
  }
  return {
    stage: "Systems or Scale",
    message: "Your business shows strong structural foundations.",
    cta: "Use the diagnostic kit to optimize your revenue architecture.",
  };
}

interface Props {
  leadEmail: string;
  leadFirstName: string;
  leadPhone: string;
}

const DDSQuiz = ({ leadEmail, leadFirstName, leadPhone }: Props) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === QUESTIONS.length;

  const calculateScore = () => {
    let total = 0;
    QUESTIONS.forEach((_, i) => {
      const opts = getOptionsForQuestion(i);
      const selected = answers[i];
      const opt = opts.find((o) => o.value === selected);
      if (opt) total += opt.points;
    });
    return total;
  };

  const handleSubmitQuiz = () => {
    if (!allAnswered) return;
    const score = calculateScore();
    const result = getResult(score);

    // Send quiz score to GHL
    supabase.functions.invoke("ghl-dds-webhook", {
      body: {
        firstName: leadFirstName,
        email: leadEmail,
        phone: leadPhone,
        quizScore: score,
        quizStage: result.stage,
      },
    }).catch((err) => console.error("GHL quiz update error:", err));

    setShowResult(true);
  };

  const score = calculateScore();
  const result = getResult(score);

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-6 max-w-2xl">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Discover Your DDS Founder Score
          </h2>
          <p className="text-lg" style={{ color: "hsl(220 15% 70%)" }}>
            Answer 5 quick questions to see how structurally prepared your business is for predictable revenue.
          </p>
        </div>

        {!showResult ? (
          <div className="space-y-8">
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2" style={{ color: "hsl(220 15% 60%)" }}>
                <span>{answeredCount} of {QUESTIONS.length} answered</span>
                <span>{Math.round((answeredCount / QUESTIONS.length) * 100)}%</span>
              </div>
              <Progress value={(answeredCount / QUESTIONS.length) * 100} className="h-2 bg-[hsl(var(--slate-medium))]" />
            </div>

            {QUESTIONS.map((question, qIndex) => {
              const opts = getOptionsForQuestion(qIndex);
              return (
                <div
                  key={qIndex}
                  className="bg-[hsl(var(--slate-medium))] border border-[hsl(var(--gold)/0.15)] rounded-xl p-6"
                >
                  <p className="font-medium mb-4 text-lg">
                    <span className="text-[hsl(var(--gold))] mr-2">{qIndex + 1}.</span>
                    {question}
                  </p>
                  <RadioGroup
                    value={answers[qIndex] || ""}
                    onValueChange={(val) => setAnswers((prev) => ({ ...prev, [qIndex]: val }))}
                    className="flex flex-col sm:flex-row gap-3"
                  >
                    {opts.map((opt) => (
                      <Label
                        key={opt.value}
                        htmlFor={`q${qIndex}-${opt.value}`}
                        className={`flex items-center gap-2 cursor-pointer rounded-lg border px-4 py-3 transition-all ${
                          answers[qIndex] === opt.value
                            ? "border-[hsl(var(--gold))] bg-[hsl(var(--gold)/0.1)]"
                            : "border-[hsl(var(--gold)/0.15)] hover:border-[hsl(var(--gold)/0.3)]"
                        }`}
                      >
                        <RadioGroupItem
                          value={opt.value}
                          id={`q${qIndex}-${opt.value}`}
                          className="border-[hsl(var(--gold)/0.4)] text-[hsl(var(--gold))]"
                        />
                        <span className="text-[hsl(var(--cream))]">{opt.label}</span>
                      </Label>
                    ))}
                  </RadioGroup>
                </div>
              );
            })}

            <div className="text-center pt-4">
              <Button
                variant="gold"
                size="lg"
                onClick={handleSubmitQuiz}
                disabled={!allAnswered}
              >
                See My DDS Score
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
            <div className="bg-[hsl(var(--slate-medium))] border border-[hsl(var(--gold)/0.2)] rounded-2xl p-8 md:p-10">
              <p className="text-[hsl(var(--gold))] font-medium tracking-wide uppercase text-sm mb-2">
                Your DDS Founder Score
              </p>
              <p className="font-display text-6xl font-bold mb-2 text-[hsl(var(--gold))]">
                {score}<span className="text-2xl text-[hsl(var(--cream))]">/10</span>
              </p>
              <p className="text-[hsl(var(--gold-light))] font-medium text-lg mb-4">
                Stage: {result.stage}
              </p>
              <p className="text-lg mb-8" style={{ color: "hsl(220 15% 70%)" }}>
                {result.message}
              </p>

              <div className="border-t border-[hsl(var(--gold)/0.15)] pt-6">
                <p className="text-sm mb-4" style={{ color: "hsl(220 15% 60%)" }}>
                  {result.cta}
                </p>
                <Button variant="gold" size="lg" asChild>
                  <a href={DIAGNOSTIC_KIT_URL} target="_blank" rel="noopener noreferrer">
                    Get the Diagnostic Kit — $27
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DDSQuiz;

import { Button } from "@/components/ui/button";
import bookImage from "@/assets/systems-before-scale-book.png";

export const BookSection = () => {
  return (
    <section className="bg-white">
      <div className="container mx-auto px-6 lg:px-12 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="flex justify-center lg:justify-end">
            <img
              src={bookImage}
              alt="Systems Before Scale, a book by Dr. Deanna Romulus"
              className="max-w-md w-full h-auto"
              loading="lazy"
            />
          </div>
          <div className="max-w-xl">
            <p className="text-accent uppercase mb-6" style={{ letterSpacing: "0.3em", fontSize: "0.75rem" }}>
              The Book
            </p>
            <h2
              className="text-primary font-normal leading-[1.15] mb-6"
              style={{ fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)", letterSpacing: "-0.005em" }}
            >
              Systems Before Scale
            </h2>
            <p className="text-primary/80 text-lg leading-relaxed mb-10" style={{ maxWidth: "52ch" }}>
              Why your business feels hard — and the structure that makes it predictable.
            </p>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-none h-auto px-8 py-4 text-base"
            >
              <a href="/methodology">Learn More</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

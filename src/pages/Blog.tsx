import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, User } from "lucide-react";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

const featuredPost = {
  slug: "7-automation-wins-entrepreneurs",
  title: "7 Automation Wins Every Entrepreneur Should Implement This Quarter",
  excerpt: "Stop trading time for money. These proven automations will save you 15+ hours weekly while improving your customer experience.",
  category: "Automation",
  readTime: "8 min read",
  author: "Dr. Romulus",
  date: "Dec 10, 2024",
};

const posts = [
  {
    slug: "fundability-score-guide",
    title: "The Complete Guide to Business Fundability in 2024",
    excerpt: "Learn how to build a fundable business that banks actually want to work with.",
    category: "Fundability",
    readTime: "12 min read",
    author: "Dr. Romulus",
    date: "Dec 5, 2024",
  },
  {
    slug: "scaling-without-burnout",
    title: "Scaling Without Burnout: The Systems-First Approach",
    excerpt: "Why most entrepreneurs hit a ceiling at $500K and how to break through it.",
    category: "Strategy",
    readTime: "10 min read",
    author: "Dr. Romulus",
    date: "Nov 28, 2024",
  },
  {
    slug: "ai-tools-small-business",
    title: "5 AI Tools That Are Actually Worth Your Time",
    excerpt: "Cut through the noise. Here are the AI tools delivering real ROI for small businesses.",
    category: "AI & Technology",
    readTime: "7 min read",
    author: "Dr. Romulus",
    date: "Nov 20, 2024",
  },
  {
    slug: "entity-structure-mistakes",
    title: "The 3 Entity Structure Mistakes Costing You Thousands",
    excerpt: "Most entrepreneurs set up their business structure wrong. Here's how to fix it.",
    category: "Business Structure",
    readTime: "9 min read",
    author: "Dr. Romulus",
    date: "Nov 15, 2024",
  },
  {
    slug: "coaching-vs-consulting",
    title: "Coaching vs Consulting: Which Do You Actually Need?",
    excerpt: "Understanding the difference could save you time, money, and frustration.",
    category: "Coaching",
    readTime: "6 min read",
    author: "Dr. Romulus",
    date: "Nov 8, 2024",
  },
];

const categories = ["All", "Automation", "Strategy", "Fundability", "AI & Technology", "Business Structure", "Coaching"];

export default function Blog() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-gold/10 text-gold font-body text-sm font-medium mb-6">
              Insights & Resources
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Strategic <span className="text-gradient-gold">Insights</span> for Growth
            </h1>
            <p className="font-body text-lg text-muted-foreground">
              Actionable strategies, frameworks, and insights to help you build 
              a business that runs without you.
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-full font-body text-sm transition-all ${
                  cat === "All"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:border-gold/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <Link
              to={`/blog/${featuredPost.slug}`}
              className="block p-8 md:p-12 rounded-2xl bg-hero-gradient text-cream hover:shadow-xl transition-all duration-300 group"
            >
              <span className="inline-block px-3 py-1 rounded-full bg-gold/20 text-gold font-body text-xs font-semibold mb-6">
                Featured
              </span>
              <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-cream mb-4 group-hover:text-gold transition-colors">
                {featuredPost.title}
              </h2>
              <p className="font-body text-cream/70 text-lg mb-6 max-w-2xl">
                {featuredPost.excerpt}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-cream/60 font-body text-sm">
                <span className="px-3 py-1 rounded-full bg-cream/10">{featuredPost.category}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {featuredPost.readTime}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {featuredPost.author}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="group p-6 rounded-xl bg-card border border-border hover:border-gold/30 hover:shadow-lg transition-all duration-300"
                >
                  <span className="inline-block px-3 py-1 rounded-full bg-gold/10 text-gold font-body text-xs font-medium mb-4">
                    {post.category}
                  </span>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3 group-hover:text-gold transition-colors">
                    {post.title}
                  </h3>
                  <p className="font-body text-muted-foreground mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-muted-foreground font-body text-sm">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </span>
                    <span>{post.date}</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Articles
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Get Weekly Insights
            </h2>
            <p className="font-body text-muted-foreground mb-8">
              Join 5,000+ entrepreneurs receiving actionable strategies every Tuesday.
            </p>
            <NewsletterForm variant="inline" source="Website – Blog – Weekly Insights" />
          </div>
        </div>
      </section>
    </Layout>
  );
}

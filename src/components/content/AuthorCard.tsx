import { User, CheckCircle } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface AuthorInfo {
  full_name: string;
  credentials?: string | null;
  bio?: string | null;
  photo_url?: string | null;
}

interface AuthorCardProps {
  author?: AuthorInfo | null;
  reviewer?: AuthorInfo | null;
  authorLabel?: string;
  reviewerLabel?: string;
  showBio?: boolean;
  compact?: boolean;
}

export function AuthorCard({ 
  author, 
  reviewer, 
  authorLabel = 'Written by',
  reviewerLabel = 'Reviewed by',
  showBio = false,
  compact = false 
}: AuthorCardProps) {
  if (!author && !reviewer) return null;

  if (compact) {
    return (
      <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
        {author && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {author.photo_url ? (
                <OptimizedImage 
                  src={author.photo_url} 
                  alt={author.full_name}
                  containerClassName="w-full h-full rounded-full"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="h-5 w-5 text-primary" />
              )}
            </div>
            <div>
              <span>{authorLabel} </span>
              <span className="font-medium text-foreground">{author.full_name}</span>
              {author.credentials && (
                <span className="text-xs ml-1">({author.credentials})</span>
              )}
            </div>
          </div>
        )}
        {reviewer && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {reviewer.photo_url ? (
                <OptimizedImage 
                  src={reviewer.photo_url} 
                  alt={reviewer.full_name}
                  containerClassName="w-full h-full rounded-full"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <CheckCircle className="h-5 w-5 text-accent" />
              )}
            </div>
            <div>
              <span>{reviewerLabel} </span>
              <span className="font-medium text-foreground">{reviewer.full_name}</span>
              {reviewer.credentials && (
                <span className="text-xs ml-1">({reviewer.credentials})</span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-8">
      {author && (
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {author.photo_url ? (
              <OptimizedImage 
                src={author.photo_url} 
                alt={author.full_name}
                containerClassName="w-full h-full rounded-full"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="h-8 w-8 text-primary" />
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">{authorLabel}</p>
            <p className="font-semibold text-foreground">{author.full_name}</p>
            {author.credentials && (
              <p className="text-sm text-muted-foreground">{author.credentials}</p>
            )}
            {showBio && author.bio && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{author.bio}</p>
            )}
          </div>
        </div>
      )}
      {reviewer && (
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {reviewer.photo_url ? (
              <OptimizedImage 
                src={reviewer.photo_url} 
                alt={reviewer.full_name}
                containerClassName="w-full h-full rounded-full"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <CheckCircle className="h-8 w-8 text-accent" />
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">{reviewerLabel}</p>
            <p className="font-semibold text-foreground">{reviewer.full_name}</p>
            {reviewer.credentials && (
              <p className="text-sm text-muted-foreground">{reviewer.credentials}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

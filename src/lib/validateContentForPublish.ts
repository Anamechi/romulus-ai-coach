export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

export function validateBlogPostForPublish(post: {
  title?: string;
  content?: string;
  excerpt?: string;
  author_id?: string | null;
  reviewer_id?: string | null;
  topic_id?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  speakable_summary?: string | null;
  cover_image_url?: string | null;
}): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Required fields
  if (!post.title?.trim()) {
    errors.push({ field: 'title', message: 'Title is required', severity: 'error' });
  }

  if (!post.content?.trim()) {
    errors.push({ field: 'content', message: 'Content is required', severity: 'error' });
  }

  if (!post.excerpt?.trim()) {
    errors.push({ field: 'excerpt', message: 'Excerpt is required', severity: 'error' });
  }

  // E-E-A-T requirements
  if (!post.author_id) {
    errors.push({ field: 'author_id', message: 'Author is required for E-E-A-T compliance', severity: 'error' });
  }

  if (!post.reviewer_id) {
    warnings.push({ field: 'reviewer_id', message: 'Reviewer is recommended for E-E-A-T compliance', severity: 'warning' });
  }

  // SEO requirements
  if (!post.meta_title?.trim()) {
    errors.push({ field: 'meta_title', message: 'Meta title is required for SEO', severity: 'error' });
  } else if (post.meta_title.length > 60) {
    warnings.push({ field: 'meta_title', message: 'Meta title should be under 60 characters', severity: 'warning' });
  }

  if (!post.meta_description?.trim()) {
    errors.push({ field: 'meta_description', message: 'Meta description is required for SEO', severity: 'error' });
  } else if (post.meta_description.length > 160) {
    warnings.push({ field: 'meta_description', message: 'Meta description should be under 160 characters', severity: 'warning' });
  }

  // Speakable content
  if (!post.speakable_summary?.trim()) {
    warnings.push({ field: 'speakable_summary', message: 'Speakable summary recommended for voice search', severity: 'warning' });
  } else {
    const wordCount = post.speakable_summary.trim().split(/\s+/).length;
    if (wordCount < 40 || wordCount > 60) {
      warnings.push({ 
        field: 'speakable_summary', 
        message: `Speakable summary should be 40-60 words (currently ${wordCount})`, 
        severity: 'warning' 
      });
    }
  }

  // Topic assignment
  if (!post.topic_id) {
    warnings.push({ field: 'topic_id', message: 'Topic assignment recommended for content organization', severity: 'warning' });
  }

  // Cover image
  if (!post.cover_image_url?.trim()) {
    warnings.push({ field: 'cover_image_url', message: 'Cover image recommended for social sharing', severity: 'warning' });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export function validateFAQForPublish(faq: {
  question?: string;
  answer?: string;
  author_id?: string | null;
  reviewer_id?: string | null;
  topic_id?: string | null;
  speakable_answer?: string | null;
}): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Required fields
  if (!faq.question?.trim()) {
    errors.push({ field: 'question', message: 'Question is required', severity: 'error' });
  }

  if (!faq.answer?.trim()) {
    errors.push({ field: 'answer', message: 'Answer is required', severity: 'error' });
  }

  // E-E-A-T
  if (!faq.author_id) {
    warnings.push({ field: 'author_id', message: 'Author is recommended for E-E-A-T compliance', severity: 'warning' });
  }

  if (!faq.reviewer_id) {
    warnings.push({ field: 'reviewer_id', message: 'Reviewer is recommended for E-E-A-T compliance', severity: 'warning' });
  }

  // Speakable
  if (!faq.speakable_answer?.trim()) {
    warnings.push({ field: 'speakable_answer', message: 'Speakable answer recommended for voice search', severity: 'warning' });
  } else {
    const wordCount = faq.speakable_answer.trim().split(/\s+/).length;
    if (wordCount < 40 || wordCount > 60) {
      warnings.push({ 
        field: 'speakable_answer', 
        message: `Speakable answer should be 40-60 words (currently ${wordCount})`, 
        severity: 'warning' 
      });
    }
  }

  // Topic
  if (!faq.topic_id) {
    warnings.push({ field: 'topic_id', message: 'Topic assignment recommended', severity: 'warning' });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export function validateQAPageForPublish(qa: {
  question?: string;
  answer?: string;
  author_id?: string | null;
  reviewer_id?: string | null;
  topic_id?: string | null;
  speakable_answer?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
}): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Required fields
  if (!qa.question?.trim()) {
    errors.push({ field: 'question', message: 'Question is required', severity: 'error' });
  }

  if (!qa.answer?.trim()) {
    errors.push({ field: 'answer', message: 'Answer is required', severity: 'error' });
  }

  // SEO
  if (!qa.meta_title?.trim()) {
    warnings.push({ field: 'meta_title', message: 'Meta title recommended for SEO', severity: 'warning' });
  }

  if (!qa.meta_description?.trim()) {
    warnings.push({ field: 'meta_description', message: 'Meta description recommended for SEO', severity: 'warning' });
  }

  // E-E-A-T
  if (!qa.author_id) {
    warnings.push({ field: 'author_id', message: 'Author is recommended', severity: 'warning' });
  }

  // Speakable
  if (!qa.speakable_answer?.trim()) {
    warnings.push({ field: 'speakable_answer', message: 'Speakable answer recommended for voice search', severity: 'warning' });
  }

  // Topic
  if (!qa.topic_id) {
    warnings.push({ field: 'topic_id', message: 'Topic assignment recommended', severity: 'warning' });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

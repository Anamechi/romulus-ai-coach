import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useQAPages, useCreateQAPage, useUpdateQAPage, useDeleteQAPage } from "@/hooks/useQAPages";
import { useTopics } from "@/hooks/useTopics";
import { useAuthors } from "@/hooks/useAuthors";
import { useReviewers } from "@/hooks/useReviewers";
import { useLogAudit } from "@/hooks/useAuditLog";
import { useSaveRevision } from "@/hooks/useContentRevisions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2, Eye, EyeOff, AlertTriangle, History, Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { validateQAPageForPublish, ValidationResult } from "@/lib/validateContentForPublish";
import { ValidationDisplay } from "@/components/admin/ValidationDisplay";
import { RevisionHistory } from "@/components/admin/RevisionHistory";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function QAPages() {
  const { data: qaPages, isLoading } = useQAPages();
  const { data: topics } = useTopics();
  const { data: authors } = useAuthors();
  const { data: reviewers } = useReviewers();
  const createQA = useCreateQAPage();
  const updateQA = useUpdateQAPage();
  const deleteQA = useDeleteQAPage();
  const logAudit = useLogAudit();
  const saveRevision = useSaveRevision();
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");
  const [editingQA, setEditingQA] = useState<any>(null);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [forcePublish, setForcePublish] = useState(false);
  const [bulkInput, setBulkInput] = useState("");
  const [bulkTopicId, setBulkTopicId] = useState("");
  const [bulkAuthorId, setBulkAuthorId] = useState("");
  const [bulkReviewerId, setBulkReviewerId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [form, setForm] = useState({
    question: "", answer: "", slug: "", speakable_answer: "",
    status: "draft", topic_id: "", author_id: "", reviewer_id: "",
    meta_title: "", meta_description: "",
  });

  const resetForm = () => {
    setForm({ question: "", answer: "", slug: "", speakable_answer: "", status: "draft", topic_id: "", author_id: "", reviewer_id: "", meta_title: "", meta_description: "" });
    setEditingQA(null);
    setValidation(null);
    setForcePublish(false);
  };

  const generateSlug = (question: string) => {
    return question
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 60);
  };

  const handleBulkCreate = async () => {
    if (!bulkInput.trim()) {
      toast.error("Please enter Q&A pairs");
      return;
    }

    setIsProcessing(true);
    let items: { question: string; answer: string }[] = [];

    // Try parsing as JSON first
    try {
      const parsed = JSON.parse(bulkInput);
      if (Array.isArray(parsed)) {
        items = parsed.filter(item => item.question && item.answer);
      }
    } catch {
      // Parse as line-separated format: Q: question / A: answer or question||answer
      const lines = bulkInput.split('\n').filter(l => l.trim());
      let currentQ = '';
      
      for (const line of lines) {
        if (line.includes('||')) {
          const [q, a] = line.split('||').map(s => s.trim());
          if (q && a) items.push({ question: q, answer: a });
        } else if (line.toLowerCase().startsWith('q:')) {
          currentQ = line.slice(2).trim();
        } else if (line.toLowerCase().startsWith('a:') && currentQ) {
          items.push({ question: currentQ, answer: line.slice(2).trim() });
          currentQ = '';
        }
      }
    }

    if (items.length === 0) {
      toast.error("No valid Q&A pairs found. Use JSON format or Q:/A: or question||answer format");
      setIsProcessing(false);
      return;
    }

    let created = 0;
    let failed = 0;

    for (const item of items) {
      try {
        await createQA.mutateAsync({
          question: item.question,
          answer: item.answer,
          slug: generateSlug(item.question),
          status: 'draft',
          topic_id: bulkTopicId || null,
          author_id: bulkAuthorId || null,
          reviewer_id: bulkReviewerId || null,
        });
        created++;
      } catch (error) {
        failed++;
        console.error('Failed to create Q&A:', item.question, error);
      }
    }

    queryClient.invalidateQueries({ queryKey: ['qa-pages'] });
    setIsProcessing(false);
    setIsBulkOpen(false);
    setBulkInput("");
    setBulkTopicId("");
    setBulkAuthorId("");
    setBulkReviewerId("");
    
    if (failed > 0) {
      toast.warning(`Created ${created} Q&A pages, ${failed} failed`);
    } else {
      toast.success(`Created ${created} Q&A pages successfully`);
    }
  };

  const runValidation = () => {
    const result = validateQAPageForPublish({
      question: form.question,
      answer: form.answer,
      author_id: form.author_id || null,
      reviewer_id: form.reviewer_id || null,
      topic_id: form.topic_id || null,
      speakable_answer: form.speakable_answer || null,
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
    });
    setValidation(result);
    return result;
  };

  const handleSubmit = async () => {
    if (form.status === 'published' && !forcePublish) {
      const result = runValidation();
      if (!result.isValid) {
        toast.error('Please fix validation errors before publishing');
        return;
      }
    }

    const data = { ...form, topic_id: form.topic_id || null, author_id: form.author_id || null, reviewer_id: form.reviewer_id || null };
    if (editingQA) {
      await updateQA.mutateAsync({ id: editingQA.id, ...data });
      // Save revision
      saveRevision.mutate({
        entity_type: 'qa_page',
        entity_id: editingQA.id,
        content_snapshot: data,
        change_summary: 'Updated Q&A page',
      });
      logAudit.mutate({
        action: 'update',
        entity_type: 'qa_page',
        entity_id: editingQA.id,
        entity_title: form.question,
      });
    } else {
      await createQA.mutateAsync(data);
      logAudit.mutate({
        action: 'create',
        entity_type: 'qa_page',
        entity_title: form.question,
      });
    }
    setIsOpen(false);
    resetForm();
  };

  const handleRestoreRevision = async (snapshot: Record<string, any>) => {
    if (!editingQA) return;
    setForm({
      question: snapshot.question || '',
      answer: snapshot.answer || '',
      slug: snapshot.slug || '',
      speakable_answer: snapshot.speakable_answer || '',
      status: snapshot.status || 'draft',
      topic_id: snapshot.topic_id || '',
      author_id: snapshot.author_id || '',
      reviewer_id: snapshot.reviewer_id || '',
      meta_title: snapshot.meta_title || '',
      meta_description: snapshot.meta_description || '',
    });
    setActiveTab('edit');
  };

  const handleEdit = (qa: any) => {
    setEditingQA(qa);
    setForm({ question: qa.question, answer: qa.answer, slug: qa.slug, speakable_answer: qa.speakable_answer || "", status: qa.status, topic_id: qa.topic_id || "", author_id: qa.author_id || "", reviewer_id: qa.reviewer_id || "", meta_title: qa.meta_title || "", meta_description: qa.meta_description || "" });
    setValidation(null);
    setIsOpen(true);
  };

  const handleDelete = async (qa: any) => {
    if (confirm('Delete this Q&A page?')) {
      await deleteQA.mutateAsync(qa.id);
      logAudit.mutate({
        action: 'delete',
        entity_type: 'qa_page',
        entity_id: qa.id,
        entity_title: qa.question,
      });
    }
  };

  const toggleStatus = async (qa: any) => {
    const newStatus = qa.status === 'published' ? 'draft' : 'published';
    
    if (newStatus === 'published') {
      const result = validateQAPageForPublish({
        question: qa.question,
        answer: qa.answer,
        author_id: qa.author_id,
        reviewer_id: qa.reviewer_id,
        topic_id: qa.topic_id,
        speakable_answer: qa.speakable_answer,
        meta_title: qa.meta_title,
        meta_description: qa.meta_description,
      });
      if (!result.isValid) {
        toast.error('Cannot publish: ' + result.errors.map((e: any) => e.message).join(', '));
        return;
      }
    }

    await updateQA.mutateAsync({ id: qa.id, status: newStatus });
    logAudit.mutate({
      action: newStatus === 'published' ? 'publish' : 'unpublish',
      entity_type: 'qa_page',
      entity_id: qa.id,
      entity_title: qa.question,
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Q&A Pages</h1>
            <p className="text-muted-foreground">Manage short question and answer pages for AEO.</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isBulkOpen} onOpenChange={setIsBulkOpen}>
              <DialogTrigger asChild>
                <Button variant="outline"><Upload className="h-4 w-4 mr-2" />Bulk Create</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle>Bulk Create Q&A Pages</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Q&A Pairs</Label>
                    <Textarea 
                      rows={10} 
                      value={bulkInput} 
                      onChange={(e) => setBulkInput(e.target.value)}
                      placeholder={`Enter Q&A pairs in one of these formats:

JSON format:
[{"question": "What is X?", "answer": "X is..."}, ...]

Line format (Q:/A:):
Q: What is X?
A: X is...

Or pipe format:
What is X?||X is...
What is Y?||Y is...`}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Topic (optional)</Label>
                      <Select value={bulkTopicId} onValueChange={setBulkTopicId}>
                        <SelectTrigger><SelectValue placeholder="Select topic" /></SelectTrigger>
                        <SelectContent>
                          {topics?.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Author (optional)</Label>
                      <Select value={bulkAuthorId} onValueChange={setBulkAuthorId}>
                        <SelectTrigger><SelectValue placeholder="Select author" /></SelectTrigger>
                        <SelectContent>
                          {authors?.map((a) => <SelectItem key={a.id} value={a.id}>{a.full_name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Reviewer (optional)</Label>
                      <Select value={bulkReviewerId} onValueChange={setBulkReviewerId}>
                        <SelectTrigger><SelectValue placeholder="Select reviewer" /></SelectTrigger>
                        <SelectContent>
                          {reviewers?.map((r) => <SelectItem key={r.id} value={r.id}>{r.full_name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    All Q&A pages will be created as drafts. Slugs will be auto-generated from questions.
                  </p>
                  <Button onClick={handleBulkCreate} disabled={isProcessing || !bulkInput.trim()} className="w-full">
                    {isProcessing ? "Creating..." : "Create Q&A Pages"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={isOpen} onOpenChange={(o) => { setIsOpen(o); if (!o) { resetForm(); setActiveTab('edit'); } }}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" />Add Q&A</Button>
              </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>{editingQA ? "Edit" : "Create"} Q&A Page</DialogTitle></DialogHeader>
              
              {editingQA ? (
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="edit">Edit</TabsTrigger>
                    <TabsTrigger value="history" className="flex items-center gap-2">
                      <History className="h-4 w-4" />
                      History
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="edit" className="space-y-4 mt-4">
                    <div>
                      <Label>Question *</Label>
                      <Input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
                    </div>
                    <div>
                      <Label>Slug *</Label>
                      <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="url-friendly-slug" />
                    </div>
                    <div>
                      <Label>Answer *</Label>
                      <Textarea rows={6} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} />
                    </div>
                    <div>
                      <Label>Speakable Answer</Label>
                      <Textarea rows={3} value={form.speakable_answer} onChange={(e) => setForm({ ...form, speakable_answer: e.target.value })} placeholder="40-60 word summary for voice search" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Status</Label>
                        <Select value={form.status} onValueChange={(v) => {
                          setForm({ ...form, status: v });
                          if (v === 'published') runValidation();
                        }}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Topic</Label>
                        <Select value={form.topic_id} onValueChange={(v) => setForm({ ...form, topic_id: v })}>
                          <SelectTrigger><SelectValue placeholder="Select topic" /></SelectTrigger>
                          <SelectContent>{topics?.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Author</Label>
                        <Select value={form.author_id} onValueChange={(v) => setForm({ ...form, author_id: v })}>
                          <SelectTrigger><SelectValue placeholder="Select author" /></SelectTrigger>
                          <SelectContent>{authors?.map((a) => <SelectItem key={a.id} value={a.id}>{a.full_name}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Reviewer</Label>
                        <Select value={form.reviewer_id} onValueChange={(v) => setForm({ ...form, reviewer_id: v })}>
                          <SelectTrigger><SelectValue placeholder="Select reviewer" /></SelectTrigger>
                          <SelectContent>{reviewers?.map((r) => <SelectItem key={r.id} value={r.id}>{r.full_name}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>Meta Title</Label>
                      <Input value={form.meta_title} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} />
                    </div>
                    <div>
                      <Label>Meta Description</Label>
                      <Textarea rows={2} value={form.meta_description} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} />
                    </div>

                    {form.status === 'published' && (
                      <div className="pt-4 space-y-4">
                        <Button type="button" variant="outline" onClick={runValidation}>
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Validate for Publishing
                        </Button>
                        <ValidationDisplay validation={validation} />
                        {validation && !validation.isValid && (
                          <div className="flex items-center gap-2">
                            <Switch id="force" checked={forcePublish} onCheckedChange={setForcePublish} />
                            <Label htmlFor="force" className="text-sm text-muted-foreground">
                              Force publish anyway
                            </Label>
                          </div>
                        )}
                      </div>
                    )}

                    <Button onClick={handleSubmit} disabled={!form.question || !form.slug || !form.answer} className="w-full">Update Q&A</Button>
                  </TabsContent>
                  
                  <TabsContent value="history" className="mt-4">
                    <RevisionHistory
                      entityType="qa_page"
                      entityId={editingQA.id}
                      onRestore={handleRestoreRevision}
                    />
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label>Question *</Label>
                    <Input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
                  </div>
                  <div>
                    <Label>Slug *</Label>
                    <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="url-friendly-slug" />
                  </div>
                  <div>
                    <Label>Answer *</Label>
                    <Textarea rows={6} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} />
                  </div>
                  <div>
                    <Label>Speakable Answer</Label>
                    <Textarea rows={3} value={form.speakable_answer} onChange={(e) => setForm({ ...form, speakable_answer: e.target.value })} placeholder="40-60 word summary for voice search" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Status</Label>
                      <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Topic</Label>
                      <Select value={form.topic_id} onValueChange={(v) => setForm({ ...form, topic_id: v })}>
                        <SelectTrigger><SelectValue placeholder="Select topic" /></SelectTrigger>
                        <SelectContent>{topics?.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Author</Label>
                      <Select value={form.author_id} onValueChange={(v) => setForm({ ...form, author_id: v })}>
                        <SelectTrigger><SelectValue placeholder="Select author" /></SelectTrigger>
                        <SelectContent>{authors?.map((a) => <SelectItem key={a.id} value={a.id}>{a.full_name}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Reviewer</Label>
                      <Select value={form.reviewer_id} onValueChange={(v) => setForm({ ...form, reviewer_id: v })}>
                        <SelectTrigger><SelectValue placeholder="Select reviewer" /></SelectTrigger>
                        <SelectContent>{reviewers?.map((r) => <SelectItem key={r.id} value={r.id}>{r.full_name}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Meta Title</Label>
                    <Input value={form.meta_title} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} />
                  </div>
                  <div>
                    <Label>Meta Description</Label>
                    <Textarea rows={2} value={form.meta_description} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} />
                  </div>
                  <Button onClick={handleSubmit} disabled={!form.question || !form.slug || !form.answer} className="w-full">Create Q&A</Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="text-center">Loading...</TableCell></TableRow>
            ) : qaPages?.map((qa) => (
              <TableRow key={qa.id}>
                <TableCell className="font-medium">{qa.question}</TableCell>
                <TableCell><Badge variant={qa.status === "published" ? "default" : "secondary"}>{qa.status}</Badge></TableCell>
                <TableCell>{topics?.find((t) => t.id === qa.topic_id)?.name || "-"}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant={qa.status === 'published' ? "default" : "outline"}
                      onClick={() => toggleStatus(qa)}
                      className={qa.status === 'published' ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      {qa.status === 'published' ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(qa)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(qa)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}

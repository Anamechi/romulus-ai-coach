import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useQAPages, useCreateQAPage, useUpdateQAPage, useDeleteQAPage } from "@/hooks/useQAPages";
import { useTopics } from "@/hooks/useTopics";
import { useAuthors } from "@/hooks/useAuthors";
import { useReviewers } from "@/hooks/useReviewers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function QAPages() {
  const { data: qaPages, isLoading } = useQAPages();
  const { data: topics } = useTopics();
  const { data: authors } = useAuthors();
  const { data: reviewers } = useReviewers();
  const createQA = useCreateQAPage();
  const updateQA = useUpdateQAPage();
  const deleteQA = useDeleteQAPage();

  const [isOpen, setIsOpen] = useState(false);
  const [editingQA, setEditingQA] = useState<any>(null);
  const [form, setForm] = useState({
    question: "", answer: "", slug: "", speakable_answer: "",
    status: "draft", topic_id: "", author_id: "", reviewer_id: "",
    meta_title: "", meta_description: "",
  });

  const resetForm = () => {
    setForm({ question: "", answer: "", slug: "", speakable_answer: "", status: "draft", topic_id: "", author_id: "", reviewer_id: "", meta_title: "", meta_description: "" });
    setEditingQA(null);
  };

  const handleSubmit = async () => {
    const data = { ...form, topic_id: form.topic_id || null, author_id: form.author_id || null, reviewer_id: form.reviewer_id || null };
    if (editingQA) {
      await updateQA.mutateAsync({ id: editingQA.id, ...data });
    } else {
      await createQA.mutateAsync(data);
    }
    setIsOpen(false);
    resetForm();
  };

  const handleEdit = (qa: any) => {
    setEditingQA(qa);
    setForm({ question: qa.question, answer: qa.answer, slug: qa.slug, speakable_answer: qa.speakable_answer || "", status: qa.status, topic_id: qa.topic_id || "", author_id: qa.author_id || "", reviewer_id: qa.reviewer_id || "", meta_title: qa.meta_title || "", meta_description: qa.meta_description || "" });
    setIsOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Q&A Pages</h1>
            <p className="text-muted-foreground">Manage short question and answer pages for AEO.</p>
          </div>
          <Dialog open={isOpen} onOpenChange={(o) => { setIsOpen(o); if (!o) resetForm(); }}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />Add Q&A</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>{editingQA ? "Edit" : "Create"} Q&A Page</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><Label>Question *</Label><Input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} /></div>
                <div><Label>Slug *</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="url-friendly-slug" /></div>
                <div><Label>Answer *</Label><Textarea rows={6} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} /></div>
                <div><Label>Speakable Answer</Label><Textarea rows={3} value={form.speakable_answer} onChange={(e) => setForm({ ...form, speakable_answer: e.target.value })} placeholder="40-60 word summary for voice search" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Status</Label><Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="published">Published</SelectItem></SelectContent></Select></div>
                  <div><Label>Topic</Label><Select value={form.topic_id} onValueChange={(v) => setForm({ ...form, topic_id: v })}><SelectTrigger><SelectValue placeholder="Select topic" /></SelectTrigger><SelectContent>{topics?.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent></Select></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Author</Label><Select value={form.author_id} onValueChange={(v) => setForm({ ...form, author_id: v })}><SelectTrigger><SelectValue placeholder="Select author" /></SelectTrigger><SelectContent>{authors?.map((a) => <SelectItem key={a.id} value={a.id}>{a.full_name}</SelectItem>)}</SelectContent></Select></div>
                  <div><Label>Reviewer</Label><Select value={form.reviewer_id} onValueChange={(v) => setForm({ ...form, reviewer_id: v })}><SelectTrigger><SelectValue placeholder="Select reviewer" /></SelectTrigger><SelectContent>{reviewers?.map((r) => <SelectItem key={r.id} value={r.id}>{r.full_name}</SelectItem>)}</SelectContent></Select></div>
                </div>
                <div><Label>Meta Title</Label><Input value={form.meta_title} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} /></div>
                <div><Label>Meta Description</Label><Textarea rows={2} value={form.meta_description} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} /></div>
                <Button onClick={handleSubmit} disabled={!form.question || !form.slug || !form.answer} className="w-full">{editingQA ? "Update" : "Create"} Q&A</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <Table>
          <TableHeader><TableRow><TableHead>Question</TableHead><TableHead>Status</TableHead><TableHead>Topic</TableHead><TableHead className="w-24">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {isLoading ? <TableRow><TableCell colSpan={4} className="text-center">Loading...</TableCell></TableRow> : qaPages?.map((qa) => (
              <TableRow key={qa.id}>
                <TableCell className="font-medium">{qa.question}</TableCell>
                <TableCell><Badge variant={qa.status === "published" ? "default" : "secondary"}>{qa.status}</Badge></TableCell>
                <TableCell>{topics?.find((t) => t.id === qa.topic_id)?.name || "-"}</TableCell>
                <TableCell><div className="flex gap-2"><Button size="icon" variant="ghost" onClick={() => handleEdit(qa)}><Pencil className="h-4 w-4" /></Button><Button size="icon" variant="ghost" onClick={() => deleteQA.mutate(qa.id)}><Trash2 className="h-4 w-4" /></Button></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}

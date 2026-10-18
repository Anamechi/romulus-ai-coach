import { useMemo, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Video, MessageSquare, Smile, Users, Eye, Download, UserCheck, UserPlus } from "lucide-react";

const TAG_REG = "webinar watched - registered";
const TAG_WALK = "webinar watched - not registered";

interface WebinarEvent {
  id: string;
  created_at: string;
  webinar_slug: string;
  session_id: string | null;
  display_name: string | null;
  email: string | null;
  contact_token: string | null;
  group_tag: string | null;
  event_type: string; // join | message | agent_reply | reaction
  content: string | null;
  video_time: number | null;
}

interface Attendee {
  session_id: string;
  display_name: string | null;
  email: string | null;
  group_tag: string | null;
  messages: number;
  reactions: number;
  firstSeen: string;
  events: WebinarEvent[];
}

export default function Webinars() {
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["webinar-events"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("webinar_chat_events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5000);
      if (error) throw error;
      return (data || []) as unknown as WebinarEvent[];
    },
  });

  const slugs = useMemo(() => {
    const s = new Set<string>();
    rows.forEach((r) => r.webinar_slug && s.add(r.webinar_slug));
    return Array.from(s);
  }, [rows]);

  const [slug, setSlug] = useState<string>("");
  const activeSlug = slug || slugs[0] || "referrals-are-not-a-pipeline";
  const events = useMemo(() => rows.filter((r) => r.webinar_slug === activeSlug), [rows, activeSlug]);

  const stats = useMemo(() => {
    const bySession = new Map<string, Attendee>();
    let questions = 0;
    let reactions = 0;
    const reactionCounts = new Map<string, number>();
    const emails = new Set<string>();

    // oldest first for readable threads
    const ordered = [...events].sort((a, b) => a.created_at.localeCompare(b.created_at));
    ordered.forEach((e) => {
      const sid = e.session_id || e.id;
      if (!bySession.has(sid)) {
        bySession.set(sid, {
          session_id: sid,
          display_name: e.display_name,
          email: e.email,
          group_tag: e.group_tag,
          messages: 0,
          reactions: 0,
          firstSeen: e.created_at,
          events: [],
        });
      }
      const a = bySession.get(sid)!;
      a.events.push(e);
      if (e.display_name && !a.display_name) a.display_name = e.display_name;
      if (e.email && !a.email) a.email = e.email;
      if (e.group_tag && !a.group_tag) a.group_tag = e.group_tag;
      if (e.email) emails.add(e.email.toLowerCase());
      if (e.event_type === "message") { questions++; a.messages++; }
      if (e.event_type === "reaction") {
        reactions++; a.reactions++;
        const k = e.content || "?";
        reactionCounts.set(k, (reactionCounts.get(k) || 0) + 1);
      }
    });

    const attendees = Array.from(bySession.values()).sort(
      (a, b) => (b.messages + b.reactions) - (a.messages + a.reactions)
    );
    const registered = attendees.filter((a) => a.group_tag === TAG_REG).length;
    const walkins = attendees.filter((a) => a.group_tag === TAG_WALK).length;
    const topReactions = Array.from(reactionCounts.entries()).sort((a, b) => b[1] - a[1]);
    const questionList = ordered.filter((e) => e.event_type === "message");

    return { attendees, registered, walkins, questions, reactions, topReactions, uniquePeople: emails.size || attendees.length, questionList };
  }, [events]);

  function exportCsv() {
    const header = ["created_at", "event_type", "display_name", "email", "group_tag", "content", "session_id"];
    const esc = (v: any) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const lines = [header.join(",")].concat(
      [...events]
        .sort((a, b) => a.created_at.localeCompare(b.created_at))
        .map((e) => [e.created_at, e.event_type, e.display_name, e.email, e.group_tag, e.content, e.session_id].map(esc).join(","))
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `webinar-engagement_${activeSlug}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const groupLabel = (g: string | null) =>
    g === TAG_REG ? "Registered" : g === TAG_WALK ? "Walk-in" : "Unknown";

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Video className="h-8 w-8" />
              Webinars
            </h1>
            <p className="text-muted-foreground">Engagement during your webinars: who was in the room, what they asked, and how they reacted.</p>
          </div>
          <div className="flex items-center gap-2">
            {slugs.length > 1 && (
              <select
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                value={activeSlug}
                onChange={(e) => setSlug(e.target.value)}
              >
                {slugs.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            )}
            <Button variant="outline" size="sm" onClick={exportCsv} disabled={!events.length}>
              <Download className="h-4 w-4 mr-2" /> Export CSV
            </Button>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><Users className="h-4 w-4" /> Attendees</CardTitle></CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.attendees.length}</div>
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-3">
                <span className="flex items-center gap-1"><UserCheck className="h-3 w-3" /> {stats.registered} registered</span>
                <span className="flex items-center gap-1"><UserPlus className="h-3 w-3" /> {stats.walkins} walk-in</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Questions asked</CardTitle></CardHeader>
            <CardContent><div className="text-3xl font-bold">{stats.questions}</div><div className="text-xs text-muted-foreground mt-1">messages typed in the chat</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><Smile className="h-4 w-4" /> Reactions</CardTitle></CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.reactions}</div>
              <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-2">
                {stats.topReactions.length ? stats.topReactions.map(([emo, n]) => (
                  <span key={emo}>{emo} {n}</span>
                )) : <span>none yet</span>}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><Users className="h-4 w-4" /> Unique people</CardTitle></CardHeader>
            <CardContent><div className="text-3xl font-bold">{stats.uniquePeople}</div><div className="text-xs text-muted-foreground mt-1">by email where known</div></CardContent>
          </Card>
        </div>

        {isLoading && <p className="text-muted-foreground">Loading engagement...</p>}

        {!isLoading && !events.length && (
          <Card><CardContent className="py-10 text-center text-muted-foreground">
            No engagement recorded yet. Questions and reactions appear here as people join and chat during a webinar.
          </CardContent></Card>
        )}

        {/* Questions asked */}
        {!!stats.questionList.length && (
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5" /> Questions and messages</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {stats.questionList.map((q) => (
                <div key={q.id} className="border-b last:border-0 pb-3 last:pb-0">
                  <div className="text-sm">{q.content}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {q.display_name || q.email || "Anonymous"}
                    {q.email && q.display_name ? ` (${q.email})` : ""}
                    {" · "}{format(new Date(q.created_at), "MMM d, HH:mm")}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Attendees */}
        {!!stats.attendees.length && (
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Attendees</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead className="text-right">Messages</TableHead>
                    <TableHead className="text-right">Reactions</TableHead>
                    <TableHead className="w-16">Thread</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.attendees.map((a) => (
                    <TableRow key={a.session_id}>
                      <TableCell className="font-medium">{a.display_name || <span className="text-muted-foreground">Unknown</span>}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{a.email || "—"}</TableCell>
                      <TableCell><Badge variant={a.group_tag === TAG_REG ? "default" : "secondary"}>{groupLabel(a.group_tag)}</Badge></TableCell>
                      <TableCell className="text-right">{a.messages}</TableCell>
                      <TableCell className="text-right">{a.reactions}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="icon" variant="ghost"><Eye className="h-4 w-4" /></Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-xl">
                            <DialogHeader>
                              <DialogTitle>{a.display_name || a.email || "Attendee"} · {groupLabel(a.group_tag)}</DialogTitle>
                            </DialogHeader>
                            <ScrollArea className="h-[420px] pr-4">
                              <div className="space-y-3">
                                {a.events.map((e) => (
                                  <div key={e.id} className="text-sm">
                                    {e.event_type === "join" && <div className="text-xs text-muted-foreground italic">Joined · {format(new Date(e.created_at), "HH:mm")}</div>}
                                    {e.event_type === "message" && <div className="bg-primary/10 rounded-lg p-2"><span className="text-xs text-muted-foreground block mb-0.5">Asked · {format(new Date(e.created_at), "HH:mm")}</span>{e.content}</div>}
                                    {e.event_type === "agent_reply" && <div className="bg-muted rounded-lg p-2"><span className="text-xs text-accent block mb-0.5">Assistant · {format(new Date(e.created_at), "HH:mm")}</span>{e.content}</div>}
                                    {e.event_type === "reaction" && <div className="text-xs text-muted-foreground">Reacted {e.content} · {format(new Date(e.created_at), "HH:mm")}</div>}
                                  </div>
                                ))}
                              </div>
                            </ScrollArea>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}

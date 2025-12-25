import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Users, Mail, Phone, Building2, DollarSign, Calendar, Loader2, Target, AlertCircle } from "lucide-react";
import { format } from "date-fns";

type Application = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  business_name: string | null;
  business_stage: string | null;
  revenue_range: string | null;
  challenges: string | null;
  goals: string | null;
  how_found_us: string | null;
  status: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  reviewing: "bg-blue-100 text-blue-700 border-blue-200",
  interview: "bg-purple-100 text-purple-700 border-purple-200",
  accepted: "bg-green-100 text-green-700 border-green-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
  withdrawn: "bg-gray-100 text-gray-700 border-gray-200",
};

export default function Applications() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [editStatus, setEditStatus] = useState("");

  const { data: applications, isLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Application[];
    },
  });

  const updateAppMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes: string }) => {
      const { error } = await supabase
        .from("applications")
        .update({ status, notes })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast({ title: "Application updated successfully" });
      setSelectedApp(null);
    },
    onError: (error) => {
      console.error("Error updating application:", error);
      toast({ title: "Error updating application", variant: "destructive" });
    },
  });

  const filteredApps = applications?.filter((app) => {
    const matchesSearch =
      app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.business_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleOpenApp = (app: Application) => {
    setSelectedApp(app);
    setEditNotes(app.notes || "");
    setEditStatus(app.status || "pending");
  };

  const handleSaveApp = () => {
    if (!selectedApp) return;
    updateAppMutation.mutate({
      id: selectedApp.id,
      status: editStatus,
      notes: editNotes,
    });
  };

  const stats = {
    total: applications?.length || 0,
    pending: applications?.filter((a) => a.status === "pending").length || 0,
    reviewing: applications?.filter((a) => a.status === "reviewing").length || 0,
    accepted: applications?.filter((a) => a.status === "accepted").length || 0,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display text-foreground">Applications</h1>
          <p className="text-muted-foreground mt-1">
            Manage coaching program applications
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Applications</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-muted-foreground">Pending Review</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.reviewing}</div>
              <div className="text-sm text-muted-foreground">In Review</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
              <div className="text-sm text-muted-foreground">Accepted</div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-display">All Applications</CardTitle>
            <CardDescription>Click on an application to view full details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or business..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewing">Reviewing</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : filteredApps?.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No applications found</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Business</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApps?.map((app) => (
                      <TableRow
                        key={app.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleOpenApp(app)}
                      >
                        <TableCell>
                          <div>
                            <div className="font-medium">{app.full_name}</div>
                            <div className="text-sm text-muted-foreground">{app.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{app.business_name || "—"}</TableCell>
                        <TableCell>{app.revenue_range || "—"}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={statusColors[app.status || "pending"]}
                          >
                            {app.status || "pending"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(app.created_at), "MMM d, yyyy")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Application Detail Dialog */}
      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="font-display">Application Details</DialogTitle>
            <DialogDescription>
              Review application and update status
            </DialogDescription>
          </DialogHeader>

          {selectedApp && (
            <ScrollArea className="max-h-[65vh] pr-4">
              <div className="space-y-6">
                {/* Contact Info */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-lg">
                        <Mail className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Email</div>
                        <a
                          href={`mailto:${selectedApp.email}`}
                          className="font-medium hover:text-accent text-sm"
                        >
                          {selectedApp.email}
                        </a>
                      </div>
                    </div>

                    {selectedApp.phone && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-lg">
                          <Phone className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Phone</div>
                          <a
                            href={`tel:${selectedApp.phone}`}
                            className="font-medium hover:text-accent text-sm"
                          >
                            {selectedApp.phone}
                          </a>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-lg">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Submitted</div>
                        <div className="font-medium text-sm">
                          {format(new Date(selectedApp.created_at), "PPpp")}
                        </div>
                      </div>
                    </div>

                    {selectedApp.how_found_us && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-lg">
                          <Search className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Found via</div>
                          <div className="font-medium text-sm capitalize">
                            {selectedApp.how_found_us}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Business Info */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Business Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-lg">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Business</div>
                        <div className="font-medium text-sm">
                          {selectedApp.business_name || "—"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-lg">
                        <DollarSign className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Revenue</div>
                        <div className="font-medium text-sm">
                          {selectedApp.revenue_range || "—"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedApp.business_stage && (
                    <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Business Stage</div>
                      <div className="text-sm">{selectedApp.business_stage}</div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Challenges & Goals */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Challenges & Goals
                  </h3>

                  {selectedApp.challenges && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                        <span className="text-sm font-medium">Biggest Challenge</span>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg text-sm whitespace-pre-wrap">
                        {selectedApp.challenges}
                      </div>
                    </div>
                  )}

                  {selectedApp.goals && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Goals</span>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg text-sm whitespace-pre-wrap">
                        {selectedApp.goals}
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Status */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Status
                  </label>
                  <Select value={editStatus} onValueChange={setEditStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewing">Reviewing</SelectItem>
                      <SelectItem value="interview">Interview Scheduled</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="withdrawn">Withdrawn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Internal Notes
                  </label>
                  <Textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Add internal notes about this application..."
                    rows={4}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end pt-4 border-t sticky bottom-0 bg-background">
                  <Button variant="outline" onClick={() => setSelectedApp(null)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveApp}
                    disabled={updateAppMutation.isPending}
                  >
                    {updateAppMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

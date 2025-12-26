import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAuditLogs } from "@/hooks/useAuditLog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { History, Search } from "lucide-react";

const actionColors: Record<string, string> = {
  create: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  update: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  delete: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  publish: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  unpublish: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
};

export default function AuditLog() {
  const [entityType, setEntityType] = useState<string>("");
  const [action, setAction] = useState<string>("");

  const { data: logs, isLoading } = useAuditLogs({
    entityType: entityType || undefined,
    action: action || undefined,
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <History className="h-8 w-8" />
              Audit Log
            </h1>
            <p className="text-muted-foreground">Track all content changes and system actions.</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 flex-wrap">
          <Select value={entityType} onValueChange={setEntityType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="blog_post">Blog Posts</SelectItem>
              <SelectItem value="faq">FAQs</SelectItem>
              <SelectItem value="qa_page">Q&A Pages</SelectItem>
              <SelectItem value="author">Authors</SelectItem>
              <SelectItem value="reviewer">Reviewers</SelectItem>
              <SelectItem value="topic">Topics</SelectItem>
            </SelectContent>
          </Select>

          <Select value={action} onValueChange={setAction}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Actions</SelectItem>
              <SelectItem value="create">Create</SelectItem>
              <SelectItem value="update">Update</SelectItem>
              <SelectItem value="delete">Delete</SelectItem>
              <SelectItem value="publish">Publish</SelectItem>
              <SelectItem value="unpublish">Unpublish</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Log Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Changes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">Loading...</TableCell>
                </TableRow>
              ) : logs && logs.length > 0 ? (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(log.created_at), "MMM d, yyyy HH:mm")}
                    </TableCell>
                    <TableCell>
                      <Badge className={actionColors[log.action] || ""}>
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="capitalize">{log.entity_type.replace("_", " ")}</TableCell>
                    <TableCell className="font-medium max-w-xs truncate">
                      {log.entity_title || "-"}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      {log.changes ? (
                        <span className="text-xs text-muted-foreground">
                          {Object.keys(log.changes).length} fields changed
                        </span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No audit logs found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}

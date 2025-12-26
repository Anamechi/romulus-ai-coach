import { AdminLayout } from "@/components/admin/AdminLayout";
import { useCitationHealthChecks, useRunHealthCheck, useCitationHealthStats } from "@/hooks/useCitationHealth";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, RefreshCw, CheckCircle, AlertTriangle, XCircle, ExternalLink } from "lucide-react";
import { format } from "date-fns";

const statusConfig = {
  healthy: { color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", icon: CheckCircle },
  warning: { color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200", icon: AlertTriangle },
  dead: { color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", icon: XCircle },
  pending: { color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200", icon: RefreshCw },
};

export default function CitationHealth() {
  const { data: citations, isLoading } = useCitationHealthChecks();
  const { data: stats } = useCitationHealthStats();
  const runHealthCheck = useRunHealthCheck();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Citation Health</h1>
            <p className="text-muted-foreground">Monitor and maintain citation quality.</p>
          </div>
          <Button 
            onClick={() => runHealthCheck.mutate(undefined)} 
            disabled={runHealthCheck.isPending}
          >
            {runHealthCheck.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Run Health Check
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Citations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.total || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Healthy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">{stats?.healthy || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Warnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-500">{stats?.warning || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <XCircle className="h-4 w-4 text-destructive" />
                Dead Links
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{stats?.dead || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Citations Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Citation</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>HTTP</TableHead>
                <TableHead>Response Time</TableHead>
                <TableHead>Last Checked</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">Loading...</TableCell>
                </TableRow>
              ) : citations && citations.length > 0 ? (
                citations.map((citation) => {
                  const status = citation.health_check?.status || "pending";
                  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
                  const StatusIcon = config.icon;

                  return (
                    <TableRow key={citation.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate max-w-xs">{citation.title}</span>
                          <a href={citation.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                          </a>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {citation.source_name || new URL(citation.url).hostname}
                      </TableCell>
                      <TableCell>
                        <Badge className={config.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {citation.health_check?.http_status || "-"}
                      </TableCell>
                      <TableCell>
                        {citation.health_check?.response_time_ms 
                          ? `${citation.health_check.response_time_ms}ms` 
                          : "-"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {citation.health_check?.last_checked_at
                          ? format(new Date(citation.health_check.last_checked_at), "MMM d, HH:mm")
                          : "Never"}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No citations found
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

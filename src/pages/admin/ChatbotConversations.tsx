import { AdminLayout } from "@/components/admin/AdminLayout";
import { useChatConversations } from "@/hooks/useChatbot";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { MessageSquare, Eye, User, Bot } from "lucide-react";

export default function ChatbotConversations() {
  const { data: conversations, isLoading } = useChatConversations();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <MessageSquare className="h-8 w-8" />
            Chatbot Conversations
          </h1>
          <p className="text-muted-foreground">View and manage chatbot interactions.</p>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Visitor</TableHead>
                <TableHead>Lead</TableHead>
                <TableHead>Messages</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">Loading...</TableCell>
                </TableRow>
              ) : conversations && conversations.length > 0 ? (
                conversations.map((conv) => (
                  <TableRow key={conv.id}>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(conv.created_at), "MMM d, yyyy HH:mm")}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {conv.visitor_id.substring(0, 8)}...
                    </TableCell>
                    <TableCell>
                      {conv.lead ? (
                        <span className="font-medium">{conv.lead.full_name || conv.lead.email}</span>
                      ) : (
                        <span className="text-muted-foreground">Anonymous</span>
                      )}
                    </TableCell>
                    <TableCell>{conv.messages?.length || 0}</TableCell>
                    <TableCell>
                      <Badge variant={conv.status === "active" ? "default" : "secondary"}>
                        {conv.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Conversation Details</DialogTitle>
                          </DialogHeader>
                          <ScrollArea className="h-[400px] pr-4">
                            <div className="space-y-4">
                              {conv.messages?.map((msg, idx) => (
                                <div
                                  key={idx}
                                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
                                >
                                  {msg.role === "assistant" && (
                                    <div className="p-2 bg-primary/10 rounded-full h-fit">
                                      <Bot className="h-4 w-4 text-primary" />
                                    </div>
                                  )}
                                  <div
                                    className={`max-w-[80%] p-3 rounded-lg ${
                                      msg.role === "user"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted"
                                    }`}
                                  >
                                    <p className="text-sm">{msg.content}</p>
                                    <p className="text-xs opacity-70 mt-1">
                                      {format(new Date(msg.timestamp), "HH:mm")}
                                    </p>
                                  </div>
                                  {msg.role === "user" && (
                                    <div className="p-2 bg-muted rounded-full h-fit">
                                      <User className="h-4 w-4" />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No conversations yet
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

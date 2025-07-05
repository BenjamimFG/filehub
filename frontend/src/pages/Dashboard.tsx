import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, FileIcon, Users } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { mockProjects } from "@/data/mockProjects";
import { mockDocuments } from "@/data/mockDocuments";
import { mockUsers } from "@/data/mockUsers";
import { Progress } from "@/components/ui/progress";

const Dashboard: React.FC = () => {
  // Calculate some stats for the dashboard
  const activeProjects = mockProjects.filter(
    (p) => p.status === "Ativo"
  ).length;
  const completedProjects = mockProjects.filter(
    (p) => p.status === "Concluído"
  ).length;
  const activeUsers = mockUsers.filter((u) => u.status === "Ativo").length;
  const recentDocuments = [...mockDocuments]
    .sort(
      (a, b) =>
        new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    )
    .slice(0, 5);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="ml-auto flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 opacity-50" />
            <span className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        <Tabs defaultValue="projects" className="space-y-4">
          <TabsList>
            <TabsTrigger value="projects">Projetos Recentes</TabsTrigger>
            <TabsTrigger value="documents">Documentos Recentes</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Projetos Recentes</CardTitle>
                <CardDescription>
                  Visão geral dos projetos mais recentes no sistema.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="px-4 py-3 text-sm font-medium">Nome</th>
                        <th className="px-4 py-3 text-sm font-medium">
                          Status
                        </th>
                        <th className="px-4 py-3 text-sm font-medium">
                          Data de Início
                        </th>
                        <th className="px-4 py-3 text-sm font-medium">
                          Data de Término
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...mockProjects]
                        .sort(
                          (a, b) =>
                            new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime()
                        )
                        .slice(0, 5)
                        .map((project) => (
                          <tr
                            key={project.id}
                            className="border-b transition-colors hover:bg-muted/50"
                          >
                            <td className="px-4 py-3 text-sm">
                              {project.name}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  project.status === "Ativo"
                                    ? "bg-green-50 text-green-700"
                                    : project.status === "Concluído"
                                    ? "bg-blue-50 text-blue-700"
                                    : "bg-yellow-50 text-yellow-700"
                                }`}
                              >
                                {project.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {new Date(project.startDate).toLocaleDateString(
                                "pt-BR"
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {new Date(project.endDate).toLocaleDateString(
                                "pt-BR"
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Documentos Recentes</CardTitle>
                <CardDescription>
                  Documentos adicionados ou atualizados recentemente.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="px-4 py-3 text-sm font-medium">Nome</th>
                        <th className="px-4 py-3 text-sm font-medium">Tipo</th>
                        <th className="px-4 py-3 text-sm font-medium">
                          Tamanho
                        </th>
                        <th className="px-4 py-3 text-sm font-medium">
                          Data de Upload
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentDocuments.map((document) => (
                        <tr
                          key={document.id}
                          className="border-b transition-colors hover:bg-muted/50"
                        >
                          <td className="px-4 py-3 text-sm">{document.name}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800">
                              {document.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">{document.size}</td>
                          <td className="px-4 py-3 text-sm">
                            {new Date(document.uploadDate).toLocaleDateString(
                              "pt-BR"
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Dashboard;

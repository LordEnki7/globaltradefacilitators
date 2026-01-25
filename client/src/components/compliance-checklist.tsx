import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle2, Circle, Lock, ChevronDown, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { 
  EXPORTER_CHECKLIST_PHASES, 
  IMPORTER_CHECKLIST_PHASES, 
  type TransactionChecklist,
  type ChecklistPhase 
} from "@shared/schema";
import { cn } from "@/lib/utils";

interface ComplianceChecklistProps {
  transactionId: string;
}

export function ComplianceChecklist({ transactionId }: ComplianceChecklistProps) {
  const { user } = useAuth();
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({});

  const { data: checklist, isLoading } = useQuery<TransactionChecklist>({
    queryKey: ["/api/checklists", transactionId]
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({ itemId, checked, type }: { itemId: string; checked: boolean; type: "exporter" | "importer" }) => {
      return apiRequest("PATCH", `/api/checklists/${transactionId}/item`, { itemId, checked, type });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/checklists", transactionId] });
    }
  });

  const togglePhase = (phaseId: string) => {
    setExpandedPhases(prev => ({ ...prev, [phaseId]: !prev[phaseId] }));
  };

  const isPhaseExpanded = (phaseId: string) => expandedPhases[phaseId] !== false;

  const getPhaseProgress = (phase: ChecklistPhase, checklistData: Record<string, boolean>) => {
    const completed = phase.items.filter(item => checklistData[item.id]).length;
    return { completed, total: phase.items.length, percentage: phase.items.length > 0 ? (completed / phase.items.length) * 100 : 0 };
  };

  const getTotalProgress = (phases: ChecklistPhase[], checklistData: Record<string, boolean>) => {
    const totalItems = phases.reduce((sum, phase) => sum + phase.items.length, 0);
    const completedItems = phases.reduce((sum, phase) => 
      sum + phase.items.filter(item => checklistData[item.id]).length, 0);
    return { completed: completedItems, total: totalItems, percentage: totalItems > 0 ? (completedItems / totalItems) * 100 : 0 };
  };

  const isPhaseBlocked = (phases: ChecklistPhase[], phaseIndex: number, checklistData: Record<string, boolean>) => {
    for (let i = 0; i < phaseIndex; i++) {
      const prevPhase = phases[i];
      if (prevPhase.hasStopGate) {
        const blockingItems = prevPhase.items.filter(item => item.isBlocking);
        const allBlockingCompleted = blockingItems.every(item => checklistData[item.id]);
        if (!allBlockingCompleted) {
          return { blocked: true, message: prevPhase.stopGateMessage };
        }
      }
    }
    return { blocked: false };
  };

  const renderPhase = (
    phase: ChecklistPhase, 
    phaseIndex: number, 
    phases: ChecklistPhase[],
    checklistData: Record<string, boolean>, 
    type: "exporter" | "importer"
  ) => {
    const progress = getPhaseProgress(phase, checklistData);
    const expanded = isPhaseExpanded(`${type}_${phase.id}`);
    const blockStatus = isPhaseBlocked(phases, phaseIndex, checklistData);

    return (
      <div key={phase.id} className="border rounded-md overflow-hidden" data-testid={`phase-${type}-${phase.id}`}>
        <button
          onClick={() => togglePhase(`${type}_${phase.id}`)}
          className="w-full flex items-center justify-between p-3 hover-elevate text-left"
          data-testid={`button-toggle-${type}-${phase.id}`}
        >
          <div className="flex items-center gap-3">
            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            <div className="flex items-center gap-2">
              {blockStatus.blocked ? (
                <Lock className="h-4 w-4 text-amber-500" />
              ) : progress.completed === progress.total ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="font-medium">Phase {phaseIndex + 1}: {phase.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{progress.completed}/{progress.total}</span>
            <div className="w-20">
              <Progress value={progress.percentage} className="h-2" />
            </div>
          </div>
        </button>

        {expanded && (
          <div className="border-t bg-muted/30 p-3 space-y-2">
            {blockStatus.blocked && (
              <div className="flex items-center gap-2 p-2 bg-amber-500/10 border border-amber-500/30 rounded-md text-amber-500 text-sm mb-3">
                <AlertTriangle className="h-4 w-4" />
                <span>{blockStatus.message}</span>
              </div>
            )}
            
            {phase.items.map((item) => {
              const isChecked = checklistData[item.id] || false;
              const isDisabled = blockStatus.blocked || updateItemMutation.isPending;

              return (
                <div 
                  key={item.id} 
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-md",
                    isDisabled ? "opacity-50" : "hover-elevate"
                  )}
                  data-testid={`checklist-item-${item.id}`}
                >
                  <Checkbox
                    id={item.id}
                    checked={isChecked}
                    disabled={isDisabled}
                    onCheckedChange={(checked) => {
                      updateItemMutation.mutate({ itemId: item.id, checked: !!checked, type });
                    }}
                    data-testid={`checkbox-${item.id}`}
                  />
                  <label 
                    htmlFor={item.id} 
                    className={cn(
                      "flex-1 text-sm cursor-pointer",
                      isChecked && "line-through text-muted-foreground"
                    )}
                  >
                    {item.label}
                    {item.isBlocking && (
                      <Badge variant="outline" className="ml-2 text-xs">Required</Badge>
                    )}
                  </label>
                </div>
              );
            })}

            {phase.hasStopGate && (
              <div className="flex items-center gap-2 p-2 bg-destructive/10 border border-destructive/30 rounded-md text-destructive text-sm mt-2">
                <AlertTriangle className="h-4 w-4" />
                <span>{phase.stopGateMessage}</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderChecklist = (
    phases: ChecklistPhase[], 
    checklistData: Record<string, boolean>, 
    type: "exporter" | "importer",
    title: string
  ) => {
    const totalProgress = getTotalProgress(phases, checklistData);

    return (
      <div className="space-y-4" data-testid={`checklist-${type}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {totalProgress.completed}/{totalProgress.total} completed
            </span>
            <Badge variant={totalProgress.percentage === 100 ? "default" : "secondary"}>
              {Math.round(totalProgress.percentage)}%
            </Badge>
          </div>
        </div>
        
        <Progress value={totalProgress.percentage} className="h-3" />
        
        <div className="space-y-2">
          {phases.map((phase, index) => renderPhase(phase, index, phases, checklistData, type))}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-pulse text-muted-foreground">Loading checklist...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const exporterData = checklist?.exporterChecklist || {};
  const importerData = checklist?.importerChecklist || {};

  const defaultTab = user?.role === "importer" ? "importer" : "exporter";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Master Compliance Checklist
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="exporter" data-testid="tab-exporter-checklist">
              Exporter (U.S. Side)
            </TabsTrigger>
            <TabsTrigger value="importer" data-testid="tab-importer-checklist">
              Importer (Destination)
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="exporter" className="mt-0">
            {renderChecklist(EXPORTER_CHECKLIST_PHASES, exporterData, "exporter", "Exporter Compliance Checklist")}
          </TabsContent>
          
          <TabsContent value="importer" className="mt-0">
            {renderChecklist(IMPORTER_CHECKLIST_PHASES, importerData, "importer", "Importer Compliance Checklist")}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

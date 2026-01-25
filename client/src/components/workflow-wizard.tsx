import { useQuery, useMutation } from "@tanstack/react-query";
import { CheckCircle2, Circle, Timer, ChevronRight, Sparkles, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { WORKFLOW_PHASES, TRANSACTION_TEMPLATES } from "@shared/schema";
import type { TransactionWorkflow, WorkflowPhase, TransactionTemplate } from "@shared/schema";

interface WorkflowWizardProps {
  transactionId: string;
}

export function WorkflowWizard({ transactionId }: WorkflowWizardProps) {
  const { data: workflow, isLoading } = useQuery<TransactionWorkflow>({
    queryKey: ["/api/workflows", transactionId]
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, completed }: { taskId: string; completed: boolean }) => {
      return apiRequest("PATCH", `/api/workflows/${transactionId}/task`, { taskId, completed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workflows", transactionId] });
    }
  });

  const advancePhaseMutation = useMutation({
    mutationFn: async (nextPhase: string) => {
      return apiRequest("PATCH", `/api/workflows/${transactionId}/phase`, { phase: nextPhase });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workflows", transactionId] });
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/3" />
            <div className="h-20 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentPhaseIndex = WORKFLOW_PHASES.findIndex(p => p.id === workflow?.currentPhase);
  const currentPhase = WORKFLOW_PHASES[currentPhaseIndex] || WORKFLOW_PHASES[0];
  const nextPhase = WORKFLOW_PHASES[currentPhaseIndex + 1];

  const template = workflow?.templateId 
    ? TRANSACTION_TEMPLATES.find(t => t.id === workflow.templateId) 
    : null;

  const getTaskId = (phaseId: string, taskIndex: number) => `${phaseId}_task_${taskIndex}`;

  const getPhaseProgress = (phase: WorkflowPhase) => {
    const taskIds = phase.tasks.map((_, i) => getTaskId(phase.id, i));
    const completed = taskIds.filter(id => workflow?.completedTasks[id]).length;
    return { completed, total: phase.tasks.length };
  };

  const currentProgress = getPhaseProgress(currentPhase);
  const overallProgress = WORKFLOW_PHASES.reduce((acc, phase, i) => {
    if (i < currentPhaseIndex) {
      return acc + phase.tasks.length;
    } else if (i === currentPhaseIndex) {
      return acc + currentProgress.completed;
    }
    return acc;
  }, 0);

  const totalTasks = WORKFLOW_PHASES.reduce((acc, phase) => acc + phase.tasks.length, 0);
  const overallPercentage = Math.round((overallProgress / totalTasks) * 100);

  const canAdvance = currentProgress.completed === currentProgress.total && nextPhase;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Timer className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">90-Day Workflow</CardTitle>
                <CardDescription>
                  {template ? `Using ${template.name} template` : "Standard GSM-102 workflow"}
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="text-primary border-primary">
              {overallPercentage}% Complete
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={overallPercentage} className="h-2" />
          
          <div className="flex justify-between mt-4 overflow-x-auto pb-2">
            {WORKFLOW_PHASES.map((phase, index) => {
              const isCompleted = index < currentPhaseIndex;
              const isCurrent = index === currentPhaseIndex;
              const progress = getPhaseProgress(phase);
              
              return (
                <div 
                  key={phase.id} 
                  className={`flex flex-col items-center min-w-[80px] ${
                    isCurrent ? "text-primary" : isCompleted ? "text-green-500" : "text-muted-foreground"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted 
                      ? "bg-green-500/20" 
                      : isCurrent 
                        ? "bg-primary/20 ring-2 ring-primary" 
                        : "bg-muted"
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <span className="text-xs font-medium">{index + 1}</span>
                    )}
                  </div>
                  <span className="text-xs mt-1 text-center whitespace-nowrap">{phase.name}</span>
                  <span className="text-[10px] text-muted-foreground">{phase.dayRange}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Phase {currentPhaseIndex + 1}: {currentPhase.name}
              </CardTitle>
              <CardDescription>{currentPhase.dayRange} - {currentPhase.description}</CardDescription>
            </div>
            <Badge variant="secondary">
              {currentProgress.completed}/{currentProgress.total} tasks
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {currentPhase.tasks.map((task, index) => {
              const taskId = getTaskId(currentPhase.id, index);
              const isCompleted = workflow?.completedTasks[taskId] || false;
              
              return (
                <div 
                  key={taskId}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    isCompleted 
                      ? "bg-green-500/5 border-green-500/20" 
                      : "bg-card border-border"
                  }`}
                >
                  <Checkbox
                    id={taskId}
                    checked={isCompleted}
                    onCheckedChange={(checked) => {
                      updateTaskMutation.mutate({ taskId, completed: !!checked });
                    }}
                    data-testid={`checkbox-${taskId}`}
                  />
                  <label 
                    htmlFor={taskId}
                    className={`flex-1 text-sm cursor-pointer ${
                      isCompleted ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {task}
                  </label>
                  {isCompleted && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-border">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              Required to Advance
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {currentPhase.requiredToAdvance.map((req, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Circle className="h-2 w-2 fill-current" />
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {nextPhase && (
            <div className="flex justify-end pt-2">
              <Button
                onClick={() => advancePhaseMutation.mutate(nextPhase.id)}
                disabled={!canAdvance || advancePhaseMutation.isPending}
                className="gap-2"
                data-testid="button-advance-phase"
              >
                {canAdvance ? (
                  <>
                    Advance to {nextPhase.name}
                    <ChevronRight className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Complete all tasks to advance
                  </>
                )}
              </Button>
            </div>
          )}

          {!nextPhase && currentProgress.completed === currentProgress.total && (
            <div className="flex items-center justify-center gap-2 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="font-medium text-green-500">Workflow Complete!</span>
            </div>
          )}
        </CardContent>
      </Card>

      {template && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Template Requirements</CardTitle>
            <CardDescription>Country-specific compliance for {template.country}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {template.countrySpecificRequirements.map((req, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <Circle className="h-2 w-2 fill-muted-foreground text-muted-foreground" />
                  {req}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


import React from "react";
import { TypingStats } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, AlertCircle, Clock, Keyboard, Activity } from "lucide-react";

interface PerformanceStatsProps {
  stats: TypingStats | null;
  isActive: boolean;
  currentPosition: number;
  totalLength: number;
}

const PerformanceStats: React.FC<PerformanceStatsProps> = ({
  stats,
  isActive,
  currentPosition,
  totalLength,
}) => {
  // Calculate progress percentage
  const progressPercentage = Math.round((currentPosition / totalLength) * 100);

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <StatItem 
            icon={<Activity className="h-4 w-4 text-blue-500" />}
            label="WPM" 
            value={stats ? stats.wpm.toString() : "0"} 
            suffix=""
          />
          <StatItem 
            icon={<Trophy className="h-4 w-4 text-yellow-500" />}
            label="Accuracy" 
            value={stats ? stats.accuracy.toString() : "100"} 
            suffix="%"
          />
          <StatItem 
            icon={<AlertCircle className="h-4 w-4 text-red-500" />}
            label="Errors" 
            value={stats ? stats.errors.toString() : "0"} 
            suffix=""
          />
          <StatItem 
            icon={<Clock className="h-4 w-4 text-green-500" />}
            label="Time" 
            value={stats ? stats.time.toString() : "0"} 
            suffix="s"
          />
        </div>
        
        {isActive && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1 text-xs">
              <span>Progress</span>
              <span>{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} max={100} className="h-2" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  suffix: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon, label, value, suffix }) => {
  return (
    <div className="flex flex-col items-center justify-center p-2 border rounded-md bg-card">
      <div className="flex items-center gap-1 mb-1">
        {icon}
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
      </div>
      <p className="text-xl font-bold">
        {value}
        <span className="text-sm font-normal">{suffix}</span>
      </p>
    </div>
  );
};

export default PerformanceStats;

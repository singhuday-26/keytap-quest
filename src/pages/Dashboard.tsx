
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProgress } from "@/services/snippetService";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Code, Keyboard, Clock, AlertTriangle, BarChart } from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart as RechartsBarChart, Bar, Legend
} from "recharts";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [progressData, setProgressData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirect if not logged in
    if (!loading && !user) {
      navigate("/auth");
    } else if (user) {
      loadUserProgress();
    }
  }, [user, loading, navigate]);

  const loadUserProgress = async () => {
    try {
      setIsLoading(true);
      const progress = await getUserProgress(user!.id);
      setProgressData(progress);
    } catch (error) {
      console.error("Error loading progress:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatChartData = () => {
    if (!progressData.length) return [];
    
    return progressData.map((entry, index) => ({
      name: `Session ${progressData.length - index}`,
      wpm: entry.wpm,
      accuracy: entry.accuracy,
      date: new Date(entry.completed_at).toLocaleDateString(),
      language: entry.code_snippets?.language,
      difficulty: entry.code_snippets?.difficulty,
    })).reverse();
  };

  const aggregateByLanguage = () => {
    if (!progressData.length) return [];
    
    const languages = {} as Record<string, { sessions: number, totalWpm: number, totalAccuracy: number }>;
    
    progressData.forEach(entry => {
      const language = entry.code_snippets?.language || 'unknown';
      
      if (!languages[language]) {
        languages[language] = { sessions: 0, totalWpm: 0, totalAccuracy: 0 };
      }
      
      languages[language].sessions += 1;
      languages[language].totalWpm += entry.wpm;
      languages[language].totalAccuracy += entry.accuracy;
    });
    
    return Object.entries(languages).map(([language, stats]) => ({
      language,
      sessions: stats.sessions,
      avgWpm: Math.round(stats.totalWpm / stats.sessions),
      avgAccuracy: Math.round(stats.totalAccuracy / stats.sessions),
    }));
  };

  const calculateAverages = () => {
    if (!progressData.length) return { wpm: 0, accuracy: 0, sessions: 0 };
    
    const totalWpm = progressData.reduce((sum, entry) => sum + entry.wpm, 0);
    const totalAccuracy = progressData.reduce((sum, entry) => sum + entry.accuracy, 0);
    
    return {
      wpm: Math.round(totalWpm / progressData.length),
      accuracy: Math.round(totalAccuracy / progressData.length),
      sessions: progressData.length
    };
  };

  const averages = calculateAverages();
  const chartData = formatChartData();
  const languageData = aggregateByLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header 
        selectedLanguage="javascript" 
        onLanguageChange={() => {}} 
      />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Your Progress Dashboard</h1>
            <Button onClick={() => navigate("/")} variant="outline">
              Practice Now
            </Button>
          </div>
          
          {isLoading ? (
            <Card className="my-8">
              <CardHeader>
                <CardTitle>Loading your progress data...</CardTitle>
              </CardHeader>
            </Card>
          ) : progressData.length === 0 ? (
            <Card className="my-8">
              <CardHeader>
                <CardTitle>No practice sessions yet</CardTitle>
                <CardDescription>
                  Complete some typing exercises to see your progress here!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate("/")} className="mt-4">
                  Start Practicing
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard 
                  icon={<Keyboard className="h-5 w-5 text-blue-500" />}
                  title="Average WPM"
                  value={averages.wpm}
                  description="Your typing speed"
                />
                <StatCard 
                  icon={<Trophy className="h-5 w-5 text-yellow-500" />}
                  title="Average Accuracy"
                  value={averages.accuracy}
                  description="Your typing precision"
                  suffix="%"
                />
                <StatCard 
                  icon={<Code className="h-5 w-5 text-green-500" />}
                  title="Total Sessions"
                  value={averages.sessions}
                  description="Practice sessions completed"
                />
                <StatCard 
                  icon={<Clock className="h-5 w-5 text-purple-500" />}
                  title="Last Session"
                  value={new Date(progressData[0]?.completed_at).toLocaleDateString()}
                  description="Your most recent practice"
                  isText
                />
              </div>
              
              <Tabs defaultValue="performance" className="w-full">
                <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 mb-8">
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="languages">Languages</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="performance">
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Over Time</CardTitle>
                      <CardDescription>
                        Track your WPM and accuracy across practice sessions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis yAxisId="left" orientation="left" />
                            <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                            <Tooltip />
                            <Legend />
                            <Line 
                              yAxisId="left"
                              type="monotone" 
                              dataKey="wpm" 
                              name="WPM" 
                              stroke="#3b82f6" 
                              activeDot={{ r: 8 }}
                            />
                            <Line 
                              yAxisId="right"
                              type="monotone" 
                              dataKey="accuracy" 
                              name="Accuracy %" 
                              stroke="#10b981" 
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="languages">
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance By Language</CardTitle>
                      <CardDescription>
                        Compare your typing skills across different programming languages
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBarChart data={languageData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="language" />
                            <YAxis yAxisId="left" orientation="left" />
                            <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                            <Tooltip />
                            <Legend />
                            <Bar 
                              yAxisId="left"
                              dataKey="avgWpm" 
                              name="Avg WPM" 
                              fill="#3b82f6" 
                            />
                            <Bar 
                              yAxisId="right"
                              dataKey="avgAccuracy" 
                              name="Avg Accuracy %" 
                              fill="#10b981" 
                            />
                          </RechartsBarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="history">
                  <Card>
                    <CardHeader>
                      <CardTitle>Practice History</CardTitle>
                      <CardDescription>
                        Your recent typing practice sessions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <div className="grid grid-cols-5 font-medium border-b bg-muted/50">
                          <div className="p-3">Date</div>
                          <div className="p-3">Language</div>
                          <div className="p-3">Difficulty</div>
                          <div className="p-3">WPM</div>
                          <div className="p-3">Accuracy</div>
                        </div>
                        {progressData.slice(0, 10).map((entry, index) => (
                          <div 
                            key={index} 
                            className="grid grid-cols-5 border-b last:border-b-0"
                          >
                            <div className="p-3 truncate">
                              {new Date(entry.completed_at).toLocaleDateString()}
                            </div>
                            <div className="p-3 capitalize truncate">
                              {entry.code_snippets?.language || '-'}
                            </div>
                            <div className="p-3 capitalize truncate">
                              {entry.code_snippets?.difficulty || '-'}
                            </div>
                            <div className="p-3">{entry.wpm}</div>
                            <div className="p-3">{entry.accuracy}%</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </main>
      
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>KeyTap Quest - Improve your coding speed and accuracy</p>
        </div>
      </footer>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  description: string;
  suffix?: string;
  isText?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, description, suffix = "", isText = false }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="font-medium text-sm">{title}</span>
      </div>
      <div className={`text-2xl font-bold ${isText ? "text-base" : ""}`}>
        {value}{suffix}
      </div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </CardContent>
  </Card>
);

export default Dashboard;

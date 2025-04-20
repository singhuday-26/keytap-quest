
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Database, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { checkSnippetCount, seedSnippets } from '@/services/seedService';
import { useToast } from '@/components/ui/use-toast';

const DbSeedingUtil = () => {
  const [snippetCount, setSnippetCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkDatabase();
  }, []);

  const checkDatabase = async () => {
    setIsLoading(true);
    try {
      const count = await checkSnippetCount();
      setSnippetCount(count);
    } catch (error) {
      console.error("Error checking database:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    try {
      const { count, error } = await seedSnippets();
      
      if (error) {
        toast({
          title: "Database Seeding Failed",
          description: error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Database Seeded Successfully",
          description: `Added ${count} code snippets to the database.`,
        });
        setSnippetCount(count);
      }
    } catch (error) {
      console.error("Error seeding database:", error);
      toast({
        title: "Database Seeding Failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Status
        </CardTitle>
        <CardDescription>
          Check and manage the code snippets in the database
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4">
            {snippetCount === 0 ? (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>No snippets found</AlertTitle>
                <AlertDescription>
                  Your database doesn't have any code snippets. 
                  Click the button below to seed the database with code snippets.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert>
                <Check className="h-4 w-4" />
                <AlertTitle>Database is ready</AlertTitle>
                <AlertDescription>
                  Found {snippetCount} code snippets in the database.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline"
          onClick={checkDatabase}
          disabled={isLoading || isSeeding}
        >
          Refresh
        </Button>
        <Button
          onClick={handleSeedDatabase}
          disabled={isLoading || isSeeding || (snippetCount && snippetCount > 0)}
        >
          {isSeeding ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Seeding...
            </>
          ) : (
            'Seed Database'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DbSeedingUtil;

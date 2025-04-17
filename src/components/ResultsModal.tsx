
import React from "react";
import { TypingStats } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RefreshCw, Share } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
  stats: TypingStats;
}

const ResultsModal: React.FC<ResultsModalProps> = ({
  isOpen,
  onClose,
  onReset,
  stats,
}) => {
  const getFeedbackMessage = () => {
    // WPM-based feedback
    if (stats.wpm > 80) {
      return "Incredible speed! You're a coding maestro!";
    } else if (stats.wpm > 60) {
      return "Great speed! You're typing like a pro!";
    } else if (stats.wpm > 40) {
      return "Good job! Your typing speed is solid!";
    } else if (stats.wpm > 20) {
      return "Nice work! Keep practicing to increase your speed.";
    } else {
      return "Good start! Focus on accuracy first, then speed will follow.";
    }
  };

  const handleShare = () => {
    const text = `I just completed a code typing exercise with ${stats.wpm} WPM and ${stats.accuracy}% accuracy on KeyTap Quest! #KeyTapQuest #CodeTyping`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(text).then(() => {
      alert("Results copied to clipboard!");
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Exercise Complete!</DialogTitle>
          <DialogDescription className="text-center pt-2">
            {getFeedbackMessage()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Speed:</span>
            <span className="text-lg font-bold">{stats.wpm} WPM</span>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium">Accuracy:</span>
              <span className="text-lg font-bold">{stats.accuracy}%</span>
            </div>
            <Progress 
              value={stats.accuracy} 
              max={100} 
              className="h-2" 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="border rounded-md p-3 text-center">
              <span className="text-sm text-muted-foreground">Time</span>
              <p className="text-lg font-bold">{stats.time}s</p>
            </div>
            <div className="border rounded-md p-3 text-center">
              <span className="text-sm text-muted-foreground">Errors</span>
              <p className="text-lg font-bold">{stats.errors}</p>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button 
            variant="secondary" 
            onClick={handleShare}
            className="gap-2 w-full sm:w-auto"
          >
            <Share className="h-4 w-4" />
            Share Result
          </Button>
          <Button 
            onClick={() => {
              onReset();
              onClose();
            }}
            className="gap-2 w-full sm:w-auto"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResultsModal;

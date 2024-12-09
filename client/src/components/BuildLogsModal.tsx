import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type BuildLogsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  logs: string[];
};

export function BuildLogsModal({ isOpen, onClose, logs }: BuildLogsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Build Logs</DialogTitle>
          <DialogDescription>
            Here are the build logs for the repository:
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 max-h-96 overflow-y-auto">
          {logs.map((log, index) => (
            <p key={index} className="text-sm">{log}</p>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
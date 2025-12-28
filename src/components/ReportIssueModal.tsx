import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';
import { Upload, X } from 'lucide-react';


const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  priority: z.enum(['low', 'medium', 'high']),
});

type FormData = z.infer<typeof formSchema>;

interface ReportIssueModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tool: any;
}

export default function ReportIssueModal({ open, onOpenChange, tool }: ReportIssueModalProps) {
  const { toast } = useToast();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    name: '',
    email: '',
    priority: 'medium',
    title: '',
    description: '',
  },
});

  const onSubmit = async (data: FormData) => {
  try {
    const formData = new FormData();

    formData.append('tool', tool?.name || 'Unknown');
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('priority', data.priority);

    if (uploadedFile) {
      formData.append('file', uploadedFile);
    }

    const res = await fetch(
      'https://backend-for-testing-9h8v.onrender.com/api/report-issue',
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!res.ok) throw new Error('Failed');

    toast({
      title: 'Issue Reported Successfully',
      description: 'Our team has been notified via email.',
    });

    reset();
    setUploadedFile(null);
    onOpenChange(false);
  } catch (err) {
    toast({
      title: 'Submission Failed',
      description: 'Please try again later.',
      variant: 'destructive',
    });
  }
};


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  if (!tool) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-white dark:bg-dark-card text-heading-dark dark:text-dark-text sm:max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-normal">
            Report Issue with {tool.name}
          </DialogTitle>
          <DialogDescription className="text-body-text dark:text-dark-muted">
            Help us improve by reporting any issues or bugs you've encountered
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          {/* Name & Email */}
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="font-ui mb-1.5 sm:mb-2 block text-xs sm:text-sm font-medium">
                Your Name
              </label>
              <input
                id="name"
                type="text"
                {...register('name')}
                className="h-10 sm:h-11 w-full rounded-lg border border-border bg-light-gray dark:bg-dark-hover px-3 sm:px-4 text-sm text-heading-dark dark:text-dark-text placeholder:text-muted-text dark:placeholder:text-dark-muted focus:border-mint-accent focus:bg-white dark:focus:bg-dark-card focus:outline-none focus:ring-2 focus:ring-mint-accent/20"
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="font-ui mb-1.5 sm:mb-2 block text-xs sm:text-sm font-medium">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className="h-10 sm:h-11 w-full rounded-lg border border-border bg-light-gray dark:bg-dark-hover px-3 sm:px-4 text-sm text-heading-dark dark:text-dark-text placeholder:text-muted-text dark:placeholder:text-dark-muted focus:border-mint-accent focus:bg-white dark:focus:bg-dark-card focus:outline-none focus:ring-2 focus:ring-mint-accent/20"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Issue Title */}
          <div>
            <label htmlFor="title" className="font-ui mb-1.5 sm:mb-2 block text-xs sm:text-sm font-medium">
              Issue Title
            </label>
            <input
              id="title"
              type="text"
              {...register('title')}
              className="h-10 sm:h-11 w-full rounded-lg border border-border bg-light-gray dark:bg-dark-hover px-3 sm:px-4 text-sm text-heading-dark dark:text-dark-text placeholder:text-muted-text dark:placeholder:text-dark-muted focus:border-mint-accent focus:bg-white dark:focus:bg-dark-card focus:outline-none focus:ring-2 focus:ring-mint-accent/20"
              placeholder="Brief description of the issue"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="font-ui mb-1.5 sm:mb-2 block text-xs sm:text-sm font-medium">
              Detailed Description
            </label>
            <textarea
              id="description"
              {...register('description')}
              rows={4}
              className="w-full rounded-lg border border-border bg-light-gray dark:bg-dark-hover px-3 sm:px-4 py-2 sm:py-3 text-sm text-heading-dark dark:text-dark-text placeholder:text-muted-text dark:placeholder:text-dark-muted focus:border-mint-accent focus:bg-white dark:focus:bg-dark-card focus:outline-none focus:ring-2 focus:ring-mint-accent/20"
              placeholder="Please provide as much detail as possible about the issue..."
            />
            {errors.description && (
              <p className="mt-1 text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Priority & File Upload */}
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="priority" className="font-ui mb-1.5 sm:mb-2 block text-xs sm:text-sm font-medium">
                Priority Level
              </label>
              <select
                id="priority"
                {...register('priority')}
                className="h-10 sm:h-11 w-full rounded-lg border border-border bg-light-gray dark:bg-dark-hover px-3 sm:px-4 text-sm text-heading-dark dark:text-dark-text focus:border-mint-accent focus:outline-none focus:ring-2 focus:ring-mint-accent/20"
              >
                <option value="low" className="bg-white dark:bg-dark-card text-heading-dark dark:text-dark-text">Low - Minor inconvenience</option>
                <option value="medium" className="bg-white dark:bg-dark-card text-heading-dark dark:text-dark-text">Medium - Affects workflow</option>
                <option value="high" className="bg-white dark:bg-dark-card text-heading-dark dark:text-dark-text">High - Critical issue</option>
              </select>
            </div>

            <div>
              <label className="font-ui mb-1.5 sm:mb-2 block text-xs sm:text-sm font-medium">
                Attach Screenshot/Video
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="flex h-10 sm:h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-light-gray dark:bg-dark-hover text-xs sm:text-sm text-body-text dark:text-dark-muted transition-all hover:border-mint-accent hover:bg-soft-mint dark:hover:bg-mint-accent/10 hover:text-forest-green dark:hover:text-mint-accent"
                >
                  <Upload className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="truncate">{uploadedFile ? uploadedFile.name : 'Upload file'}</span>
                </label>
                {uploadedFile && (
                  <button
                    type="button"
                    onClick={() => setUploadedFile(null)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-gray-200 p-1 hover:bg-gray-300"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 border-t border-border pt-4 sm:pt-6">
            <Button
              type="button"
              onClick={() => {
                reset();
                setUploadedFile(null);
                onOpenChange(false);
              }}
              variant="outline"
              className="rounded-full border-border dark:border-dark-border h-10 sm:h-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-full bg-mint-accent text-forest-dark hover:bg-mint-accent/90 h-10 sm:h-auto"
            >
              Submit Issue Report
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

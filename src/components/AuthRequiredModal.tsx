import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
// import { useLocation } from "react-router-dom";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AuthRequiredModal({ open, onClose }: Props) {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl bg-white dark:bg-dark-card">

        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-gray-900 dark:text-white">
            <Shield className="h-5 w-5 text-mint-accent" />
            Login Required
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-600 dark:text-gray-300">
          Want to use tools? Use them by logging in.
        </p>

        <Button
          className="mt-4 w-full bg-mint-accent text-forest-dark hover:bg-mint-accent/90"
          onClick={() => {
            onClose();   
            navigate("/login");
            }}
        >
          Login
        </Button>

      </DialogContent>
    </Dialog>
  );
}

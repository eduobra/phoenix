export interface NotificationItem {
  title: string;
  description: string;
  icon: React.ElementType;
  type: "toggle" | "banner" | "email";
}

export interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}
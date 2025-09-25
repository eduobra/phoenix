import AuthGuard from "@/components/AuthGuard";

export default function ProfilePage() {
  return (
    <AuthGuard>
      <div>Profile Content Here</div>
    </AuthGuard>
  );
}

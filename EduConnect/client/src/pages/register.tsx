import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";

export default function Register() {
  const [, navigate] = useLocation();
  const [form, setForm] = useState({ email: "", password: "", firstName: "", lastName: "", role: "learner" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await apiRequest("POST", "/api/auth/register", form);
      const data = await res.json();
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create account</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm mb-1">First name</label>
            <Input value={form.firstName} onChange={(e) => update("firstName", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Last name</label>
            <Input value={form.lastName} onChange={(e) => update("lastName", e.target.value)} />
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <Input value={form.email} onChange={(e) => update("email", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <Input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">Role</label>
          <select className="w-full border rounded px-3 py-2" value={form.role} onChange={(e) => update("role", e.target.value)}>
            <option value="learner">Learner</option>
            <option value="teacher">Teacher</option>
            <option value="abet">ABET</option>
          </select>
          {form.role === "teacher" && (
            <p className="text-xs text-gray-500 mt-1">Teachers require admin approval before login.</p>
          )}
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <div className="flex gap-2">
          <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create account"}</Button>
          <Button type="button" variant="secondary" onClick={() => navigate("/login")}>Sign in</Button>
        </div>
      </form>
    </div>
  );
}



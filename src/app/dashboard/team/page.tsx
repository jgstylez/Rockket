"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Rocket,
  Plus,
  UserPlus,
  Mail,
  Trash2,
  Crown,
  Shield,
  User,
} from "lucide-react";

interface TeamMember {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function TeamPage() {
  const { user, tenant } = useAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteData, setInviteData] = useState({
    email: "",
    name: "",
    role: "member",
  });
  const [isInviting, setIsInviting] = useState(false);

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/tenants/users");

      if (response.ok) {
        const data = await response.json();
        setMembers(data.users);
      } else {
        console.error("Failed to load team members");
      }
    } catch (error) {
      console.error("Error loading team members:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsInviting(true);

    try {
      const response = await fetch("/api/tenants/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inviteData),
      });

      if (response.ok) {
        const data = await response.json();
        setMembers((prev) => [...prev, data.user]);
        setInviteData({ email: "", name: "", role: "member" });
        setShowInviteForm(false);
        alert(`Invitation sent! Temporary password: ${data.user.tempPassword}`);
      } else {
        const error = await response.json();
        alert(`Failed to invite member: ${error.error}`);
      }
    } catch (error) {
      console.error("Error inviting member:", error);
      alert("Failed to invite member");
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this team member?")) {
      return;
    }

    try {
      const response = await fetch(`/api/tenants/users?userId=${memberId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMembers((prev) => prev.filter((member) => member.id !== memberId));
      } else {
        alert("Failed to remove team member");
      }
    } catch (error) {
      console.error("Error removing member:", error);
      alert("Failed to remove team member");
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case "admin":
        return <Shield className="h-4 w-4 text-blue-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "owner":
        return "Owner";
      case "admin":
        return "Admin";
      case "member":
        return "Member";
      case "viewer":
        return "Viewer";
      default:
        return role;
    }
  };

  if (!user || !tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p>Loading team...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Rocket className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">Rockket</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Team Management</h1>
            <p className="text-muted-foreground">
              Manage your {tenant.name} team members and their permissions.
            </p>
          </div>

          {/* Invite Member Section */}
          <div className="bg-card rounded-lg border p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Invite Team Members</h2>
              <Button
                onClick={() => setShowInviteForm(!showInviteForm)}
                variant={showInviteForm ? "outline" : "default"}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                {showInviteForm ? "Cancel" : "Invite Member"}
              </Button>
            </div>

            {showInviteForm && (
              <form onSubmit={handleInviteMember} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      value={inviteData.email}
                      onChange={(e) =>
                        setInviteData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="input-field"
                      placeholder="colleague@company.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      value={inviteData.name}
                      onChange={(e) =>
                        setInviteData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="input-field"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Role</label>
                    <select
                      value={inviteData.role}
                      onChange={(e) =>
                        setInviteData((prev) => ({
                          ...prev,
                          role: e.target.value,
                        }))
                      }
                      className="input-field"
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowInviteForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isInviting}>
                    <Mail className="h-4 w-4 mr-2" />
                    {isInviting ? "Sending..." : "Send Invitation"}
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Team Members List */}
          <div className="bg-card rounded-lg border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">
                Team Members ({members.length})
              </h2>
            </div>

            {isLoading ? (
              <div className="p-8 text-center">
                <div className="loading-spinner mx-auto mb-4"></div>
                <p>Loading team members...</p>
              </div>
            ) : (
              <div className="divide-y">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="p-6 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {member.name?.charAt(0) ||
                            member.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {member.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getRoleIcon(member.role)}
                        <span className="text-sm font-medium">
                          {getRoleLabel(member.role)}
                        </span>
                      </div>
                      {member.role !== "owner" && user.role === "owner" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

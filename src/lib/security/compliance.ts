export interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  category: string;
  severity: "low" | "medium" | "high" | "critical";
  enabled: boolean;
  conditions: ComplianceCondition[];
  actions: ComplianceAction[];
}

export interface ComplianceCondition {
  field: string;
  operator:
    | "equals"
    | "not_equals"
    | "contains"
    | "not_contains"
    | "greater_than"
    | "less_than";
  value: any;
  logic?: "AND" | "OR";
}

export interface ComplianceAction {
  type: "block" | "warn" | "log" | "notify";
  message: string;
  data?: Record<string, any>;
}

export interface ComplianceViolation {
  id: string;
  ruleId: string;
  userId: string;
  tenantId: string;
  severity: string;
  message: string;
  data: Record<string, any>;
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
}

export interface SecurityEvent {
  id: string;
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  userId?: string;
  tenantId: string;
  description: string;
  data: Record<string, any>;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

// Predefined compliance rules
export const COMPLIANCE_RULES: ComplianceRule[] = [
  {
    id: "password-strength",
    name: "Password Strength Requirements",
    description: "Enforce strong password requirements",
    category: "Authentication",
    severity: "high",
    enabled: true,
    conditions: [
      {
        field: "password",
        operator: "not_contains",
        value:
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
      },
    ],
    actions: [
      {
        type: "block",
        message:
          "Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters",
      },
    ],
  },
  {
    id: "session-timeout",
    name: "Session Timeout",
    description: "Enforce session timeout for inactive users",
    category: "Session Management",
    severity: "medium",
    enabled: true,
    conditions: [
      {
        field: "lastActivity",
        operator: "less_than",
        value: "30 minutes ago",
      },
    ],
    actions: [
      {
        type: "block",
        message: "Session expired due to inactivity",
      },
    ],
  },
  {
    id: "data-encryption",
    name: "Data Encryption",
    description: "Ensure sensitive data is encrypted",
    category: "Data Protection",
    severity: "critical",
    enabled: true,
    conditions: [
      {
        field: "dataType",
        operator: "equals",
        value: "sensitive",
      },
      {
        field: "encrypted",
        operator: "equals",
        value: false,
        logic: "AND",
      },
    ],
    actions: [
      {
        type: "block",
        message: "Sensitive data must be encrypted before storage",
      },
    ],
  },
  {
    id: "access-control",
    name: "Access Control",
    description: "Enforce role-based access control",
    category: "Authorization",
    severity: "high",
    enabled: true,
    conditions: [
      {
        field: "userRole",
        operator: "not_equals",
        value: "required_role",
      },
    ],
    actions: [
      {
        type: "block",
        message: "Insufficient permissions to access this resource",
      },
    ],
  },
  {
    id: "audit-logging",
    name: "Audit Logging",
    description: "Log all administrative actions",
    category: "Audit",
    severity: "medium",
    enabled: true,
    conditions: [
      {
        field: "actionType",
        operator: "contains",
        value: "admin",
      },
    ],
    actions: [
      {
        type: "log",
        message: "Administrative action logged for audit purposes",
        data: {
          logLevel: "info",
          includeUserContext: true,
        },
      },
    ],
  },
];

export class ComplianceEngine {
  private rules: ComplianceRule[];

  constructor(rules: ComplianceRule[] = COMPLIANCE_RULES) {
    this.rules = rules;
  }

  async evaluateRule(
    rule: ComplianceRule,
    context: Record<string, any>
  ): Promise<boolean> {
    if (!rule.enabled) {
      return true;
    }

    for (const condition of rule.conditions) {
      const fieldValue = this.getFieldValue(context, condition.field);
      const conditionMet = this.evaluateCondition(fieldValue, condition);

      if (!conditionMet) {
        return true; // Rule not violated
      }
    }

    return false; // Rule violated
  }

  async checkCompliance(context: Record<string, any>): Promise<{
    violations: ComplianceViolation[];
    passed: boolean;
  }> {
    const violations: ComplianceViolation[] = [];

    for (const rule of this.rules) {
      const isViolated = !(await this.evaluateRule(rule, context));

      if (isViolated) {
        const violation: ComplianceViolation = {
          id: `violation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          ruleId: rule.id,
          userId: context.userId || "",
          tenantId: context.tenantId || "",
          severity: rule.severity,
          message: rule.actions[0]?.message || "Compliance rule violated",
          data: context,
          timestamp: new Date(),
          resolved: false,
        };

        violations.push(violation);
      }
    }

    return {
      violations,
      passed: violations.length === 0,
    };
  }

  private getFieldValue(context: Record<string, any>, field: string): any {
    const keys = field.split(".");
    let value = context;

    for (const key of keys) {
      if (value && typeof value === "object" && key in value) {
        value = value[key];
      } else {
        return undefined;
      }
    }

    return value;
  }

  private evaluateCondition(
    fieldValue: any,
    condition: ComplianceCondition
  ): boolean {
    if (fieldValue === undefined) {
      return false;
    }

    switch (condition.operator) {
      case "equals":
        return fieldValue === condition.value;
      case "not_equals":
        return fieldValue !== condition.value;
      case "contains":
        return String(fieldValue).includes(String(condition.value));
      case "not_contains":
        return !String(fieldValue).includes(String(condition.value));
      case "greater_than":
        return Number(fieldValue) > Number(condition.value);
      case "less_than":
        return Number(fieldValue) < Number(condition.value);
      default:
        return false;
    }
  }

  addRule(rule: ComplianceRule): void {
    this.rules.push(rule);
  }

  removeRule(ruleId: string): void {
    this.rules = this.rules.filter((rule) => rule.id !== ruleId);
  }

  updateRule(ruleId: string, updates: Partial<ComplianceRule>): void {
    const ruleIndex = this.rules.findIndex((rule) => rule.id === ruleId);
    if (ruleIndex !== -1) {
      this.rules[ruleIndex] = { ...this.rules[ruleIndex], ...updates };
    }
  }

  getRules(): ComplianceRule[] {
    return [...this.rules];
  }

  getRuleById(ruleId: string): ComplianceRule | undefined {
    return this.rules.find((rule) => rule.id === ruleId);
  }
}

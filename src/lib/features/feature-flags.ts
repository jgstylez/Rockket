import { db } from "@/lib/db/client";

export interface FeatureFlagVariant {
  id: string;
  name: string;
  value: any;
  weight: number;
}

export interface FeatureFlagRule {
  id: string;
  condition: string;
  variant: string;
  weight: number;
}

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  variants: FeatureFlagVariant[];
  rules: FeatureFlagRule[];
  createdAt: Date;
  updatedAt: Date;
}

export async function getFeatureFlag(
  name: string
): Promise<FeatureFlag | null> {
  const flag = await db.featureFlag.findUnique({
    where: { name },
  });

  if (!flag) {
    return null;
  }

  return {
    id: flag.id,
    name: flag.name,
    description: flag.description,
    enabled: flag.enabled,
    variants: JSON.parse(flag.variants as string),
    rules: JSON.parse(flag.rules as string),
    createdAt: flag.createdAt,
    updatedAt: flag.updatedAt,
  };
}

export async function createFeatureFlag(data: {
  name: string;
  description: string;
  enabled?: boolean;
  variants?: FeatureFlagVariant[];
  rules?: FeatureFlagRule[];
}): Promise<FeatureFlag> {
  const flag = await db.featureFlag.create({
    data: {
      name: data.name,
      description: data.description,
      enabled: data.enabled || false,
      variants: JSON.stringify(data.variants || []),
      rules: JSON.stringify(data.rules || []),
    },
  });

  return {
    id: flag.id,
    name: flag.name,
    description: flag.description,
    enabled: flag.enabled,
    variants: JSON.parse(flag.variants as string),
    rules: JSON.parse(flag.rules as string),
    createdAt: flag.createdAt,
    updatedAt: flag.updatedAt,
  };
}

export async function updateFeatureFlag(
  name: string,
  data: {
    description?: string;
    enabled?: boolean;
    variants?: FeatureFlagVariant[];
    rules?: FeatureFlagRule[];
  }
): Promise<FeatureFlag | null> {
  const updateData: any = {};
  if (data.description !== undefined) updateData.description = data.description;
  if (data.enabled !== undefined) updateData.enabled = data.enabled;
  if (data.variants !== undefined)
    updateData.variants = JSON.stringify(data.variants);
  if (data.rules !== undefined) updateData.rules = JSON.stringify(data.rules);

  const flag = await db.featureFlag.update({
    where: { name },
    data: updateData,
  });

  return {
    id: flag.id,
    name: flag.name,
    description: flag.description,
    enabled: flag.enabled,
    variants: JSON.parse(flag.variants as string),
    rules: JSON.parse(flag.rules as string),
    createdAt: flag.createdAt,
    updatedAt: flag.updatedAt,
  };
}

export async function deleteFeatureFlag(name: string): Promise<boolean> {
  try {
    await db.featureFlag.delete({
      where: { name },
    });
    return true;
  } catch (error) {
    console.error("Delete feature flag error:", error);
    return false;
  }
}

export async function getAllFeatureFlags(): Promise<FeatureFlag[]> {
  const flags = await db.featureFlag.findMany({
    orderBy: { createdAt: "desc" },
  });

  return flags.map((flag) => ({
    id: flag.id,
    name: flag.name,
    description: flag.description,
    enabled: flag.enabled,
    variants: JSON.parse(flag.variants as string),
    rules: JSON.parse(flag.rules as string),
    createdAt: flag.createdAt,
    updatedAt: flag.updatedAt,
  }));
}

export function evaluateFeatureFlag(
  flag: FeatureFlag,
  userId?: string,
  tenantId?: string,
  context?: Record<string, any>
): { enabled: boolean; variant?: string; value?: any } {
  if (!flag.enabled) {
    return { enabled: false };
  }

  // Check rules first
  for (const rule of flag.rules) {
    if (evaluateRule(rule, userId, tenantId, context)) {
      const variant = flag.variants.find((v) => v.id === rule.variant);
      if (variant) {
        return { enabled: true, variant: variant.name, value: variant.value };
      }
    }
  }

  // Default to first variant if no rules match
  if (flag.variants.length > 0) {
    const defaultVariant = flag.variants[0];
    return {
      enabled: true,
      variant: defaultVariant.name,
      value: defaultVariant.value,
    };
  }

  return { enabled: true };
}

function evaluateRule(
  rule: FeatureFlagRule,
  userId?: string,
  tenantId?: string,
  context?: Record<string, any>
): boolean {
  try {
    // Simple rule evaluation - in production, you'd use a more sophisticated rule engine
    const conditions = rule.condition.split(" AND ");

    for (const condition of conditions) {
      const [key, operator, value] = condition.trim().split(" ");

      let actualValue: any;
      switch (key) {
        case "userId":
          actualValue = userId;
          break;
        case "tenantId":
          actualValue = tenantId;
          break;
        default:
          actualValue = context?.[key];
      }

      if (!evaluateCondition(actualValue, operator, value)) {
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("Rule evaluation error:", error);
    return false;
  }
}

function evaluateCondition(
  actual: any,
  operator: string,
  expected: string
): boolean {
  switch (operator) {
    case "==":
      return actual == expected;
    case "!=":
      return actual != expected;
    case ">":
      return Number(actual) > Number(expected);
    case "<":
      return Number(actual) < Number(expected);
    case ">=":
      return Number(actual) >= Number(expected);
    case "<=":
      return Number(actual) <= Number(expected);
    case "contains":
      return String(actual).includes(expected);
    case "startsWith":
      return String(actual).startsWith(expected);
    case "endsWith":
      return String(actual).endsWith(expected);
    default:
      return false;
  }
}

import { BuilderComponent } from "./components";

export interface BusinessRule {
  id: string;
  name: string;
  description: string;
  condition: string;
  action: string;
  priority: number;
  enabled: boolean;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: string;
  steps: WorkflowStep[];
  conditions: WorkflowCondition[];
  enabled: boolean;
}

export interface WorkflowStep {
  id: string;
  type: "action" | "condition" | "delay" | "notification";
  name: string;
  config: Record<string, any>;
  nextStepId?: string;
}

export interface WorkflowCondition {
  id: string;
  field: string;
  operator: "equals" | "not_equals" | "contains" | "greater_than" | "less_than";
  value: any;
  logic: "AND" | "OR";
}

export interface BusinessLogicContext {
  user: {
    id: string;
    role: string;
    permissions: string[];
  };
  data: Record<string, any>;
  environment: "development" | "staging" | "production";
}

export interface BusinessLogicEngine {
  rules: BusinessRule[];
  workflows: Workflow[];
  context: BusinessLogicContext;
}

export class BusinessLogicBuilder {
  private engine: BusinessLogicEngine;

  constructor() {
    this.engine = {
      rules: [],
      workflows: [],
      context: {
        user: { id: "", role: "", permissions: [] },
        data: {},
        environment: "development",
      },
    };
  }

  // Business Rules Management
  addRule(rule: Omit<BusinessRule, "id">): BusinessRule {
    const newRule: BusinessRule = {
      id: `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...rule,
    };
    this.engine.rules.push(newRule);
    return newRule;
  }

  updateRule(ruleId: string, updates: Partial<BusinessRule>): boolean {
    const ruleIndex = this.engine.rules.findIndex((rule) => rule.id === ruleId);
    if (ruleIndex === -1) return false;

    this.engine.rules[ruleIndex] = {
      ...this.engine.rules[ruleIndex],
      ...updates,
    };
    return true;
  }

  removeRule(ruleId: string): boolean {
    const ruleIndex = this.engine.rules.findIndex((rule) => rule.id === ruleId);
    if (ruleIndex === -1) return false;

    this.engine.rules.splice(ruleIndex, 1);
    return true;
  }

  // Workflow Management
  addWorkflow(workflow: Omit<Workflow, "id">): Workflow {
    const newWorkflow: Workflow = {
      id: `workflow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...workflow,
    };
    this.engine.workflows.push(newWorkflow);
    return newWorkflow;
  }

  updateWorkflow(workflowId: string, updates: Partial<Workflow>): boolean {
    const workflowIndex = this.engine.workflows.findIndex(
      (workflow) => workflow.id === workflowId
    );
    if (workflowIndex === -1) return false;

    this.engine.workflows[workflowIndex] = {
      ...this.engine.workflows[workflowIndex],
      ...updates,
    };
    return true;
  }

  removeWorkflow(workflowId: string): boolean {
    const workflowIndex = this.engine.workflows.findIndex(
      (workflow) => workflow.id === workflowId
    );
    if (workflowIndex === -1) return false;

    this.engine.workflows.splice(workflowIndex, 1);
    return true;
  }

  // Business Logic Execution
  evaluateRules(context: BusinessLogicContext): BusinessRule[] {
    return this.engine.rules.filter((rule) => {
      if (!rule.enabled) return false;

      try {
        // Simple rule evaluation - in production, use a proper rule engine
        return this.evaluateCondition(rule.condition, context);
      } catch (error) {
        console.error(`Error evaluating rule ${rule.id}:`, error);
        return false;
      }
    });
  }

  executeWorkflow(workflowId: string, context: BusinessLogicContext): boolean {
    const workflow = this.engine.workflows.find((w) => w.id === workflowId);
    if (!workflow || !workflow.enabled) return false;

    try {
      // Check workflow conditions
      const conditionsMet = this.evaluateWorkflowConditions(
        workflow.conditions,
        context
      );
      if (!conditionsMet) return false;

      // Execute workflow steps
      this.executeWorkflowSteps(workflow.steps, context);
      return true;
    } catch (error) {
      console.error(`Error executing workflow ${workflowId}:`, error);
      return false;
    }
  }

  // Component Business Logic Integration
  addBusinessLogicToComponent(
    component: BuilderComponent,
    businessLogic: {
      rules?: BusinessRule[];
      workflows?: Workflow[];
      triggers?: string[];
    }
  ): BuilderComponent {
    return {
      ...component,
      props: {
        ...component.props,
        businessLogic: {
          rules: businessLogic.rules || [],
          workflows: businessLogic.workflows || [],
          triggers: businessLogic.triggers || [],
        },
      },
    };
  }

  // Pre-built Business Logic Templates
  getEcommerceLogic(): { rules: BusinessRule[]; workflows: Workflow[] } {
    return {
      rules: [
        {
          id: "cart_validation",
          name: "Cart Validation",
          description: "Validate cart before checkout",
          condition: "cart.items.length > 0 && cart.total > 0",
          action: "allow_checkout",
          priority: 1,
          enabled: true,
        },
        {
          id: "inventory_check",
          name: "Inventory Check",
          description: "Check product availability",
          condition: "product.inventory > 0",
          action: "allow_purchase",
          priority: 2,
          enabled: true,
        },
      ],
      workflows: [
        {
          id: "checkout_process",
          name: "Checkout Process",
          description: "Complete checkout workflow",
          trigger: "checkout_initiated",
          steps: [
            {
              id: "validate_cart",
              type: "condition",
              name: "Validate Cart",
              config: { condition: "cart.items.length > 0" },
            },
            {
              id: "calculate_totals",
              type: "action",
              name: "Calculate Totals",
              config: { action: "calculate_totals" },
            },
            {
              id: "process_payment",
              type: "action",
              name: "Process Payment",
              config: { action: "process_payment" },
            },
          ],
          conditions: [],
          enabled: true,
        },
      ],
    };
  }

  getSaaSLogic(): { rules: BusinessRule[]; workflows: Workflow[] } {
    return {
      rules: [
        {
          id: "subscription_access",
          name: "Subscription Access",
          description: "Check user subscription status",
          condition: "user.subscription.active === true",
          action: "allow_access",
          priority: 1,
          enabled: true,
        },
        {
          id: "feature_access",
          name: "Feature Access",
          description: "Check feature permissions",
          condition: "user.permissions.includes(feature)",
          action: "allow_feature",
          priority: 2,
          enabled: true,
        },
      ],
      workflows: [
        {
          id: "user_onboarding",
          name: "User Onboarding",
          description: "New user onboarding process",
          trigger: "user_registered",
          steps: [
            {
              id: "send_welcome_email",
              type: "notification",
              name: "Send Welcome Email",
              config: { type: "email", template: "welcome" },
            },
            {
              id: "create_user_profile",
              type: "action",
              name: "Create User Profile",
              config: { action: "create_profile" },
            },
          ],
          conditions: [],
          enabled: true,
        },
      ],
    };
  }

  getContentLogic(): { rules: BusinessRule[]; workflows: Workflow[] } {
    return {
      rules: [
        {
          id: "content_approval",
          name: "Content Approval",
          description: "Require approval for content publication",
          condition: "content.status === 'draft' && user.role === 'editor'",
          action: "require_approval",
          priority: 1,
          enabled: true,
        },
      ],
      workflows: [
        {
          id: "content_publishing",
          name: "Content Publishing",
          description: "Content publication workflow",
          trigger: "content_published",
          steps: [
            {
              id: "notify_subscribers",
              type: "notification",
              name: "Notify Subscribers",
              config: { type: "email", template: "new_content" },
            },
            {
              id: "update_sitemap",
              type: "action",
              name: "Update Sitemap",
              config: { action: "update_sitemap" },
            },
          ],
          conditions: [],
          enabled: true,
        },
      ],
    };
  }

  // Helper Methods
  private evaluateCondition(
    condition: string,
    context: BusinessLogicContext
  ): boolean {
    // Simple condition evaluation - in production, use a proper expression evaluator
    try {
      // Replace context variables in condition
      let evaluatedCondition = condition;
      Object.entries(context.data).forEach(([key, value]) => {
        evaluatedCondition = evaluatedCondition.replace(
          new RegExp(`\\b${key}\\b`, "g"),
          JSON.stringify(value)
        );
      });

      // This is a simplified evaluation - in production, use a safe expression evaluator
      return eval(evaluatedCondition);
    } catch (error) {
      console.error("Error evaluating condition:", error);
      return false;
    }
  }

  private evaluateWorkflowConditions(
    conditions: WorkflowCondition[],
    context: BusinessLogicContext
  ): boolean {
    if (conditions.length === 0) return true;

    let result = true;
    let logicOperator = "AND";

    for (const condition of conditions) {
      const fieldValue = this.getNestedValue(context.data, condition.field);
      const conditionResult = this.evaluateConditionValue(
        fieldValue,
        condition.operator,
        condition.value
      );

      if (logicOperator === "AND") {
        result = result && conditionResult;
      } else {
        result = result || conditionResult;
      }

      logicOperator = condition.logic;
    }

    return result;
  }

  private executeWorkflowSteps(
    steps: WorkflowStep[],
    context: BusinessLogicContext
  ): void {
    for (const step of steps) {
      this.executeWorkflowStep(step, context);
    }
  }

  private executeWorkflowStep(
    step: WorkflowStep,
    context: BusinessLogicContext
  ): void {
    switch (step.type) {
      case "action":
        this.executeAction(step.config, context);
        break;
      case "notification":
        this.sendNotification(step.config, context);
        break;
      case "delay":
        // In a real implementation, this would be handled asynchronously
        console.log(`Delay: ${step.config.duration}ms`);
        break;
      case "condition":
        // Conditions are evaluated in the workflow execution
        break;
    }
  }

  private executeAction(
    config: Record<string, any>,
    context: BusinessLogicContext
  ): void {
    console.log("Executing action:", config.action, "with context:", context);
    // Implement action execution logic
  }

  private sendNotification(
    config: Record<string, any>,
    context: BusinessLogicContext
  ): void {
    console.log(
      "Sending notification:",
      config.type,
      "template:",
      config.template
    );
    // Implement notification logic
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  }

  private evaluateConditionValue(
    fieldValue: any,
    operator: string,
    expectedValue: any
  ): boolean {
    switch (operator) {
      case "equals":
        return fieldValue === expectedValue;
      case "not_equals":
        return fieldValue !== expectedValue;
      case "contains":
        return String(fieldValue).includes(String(expectedValue));
      case "greater_than":
        return Number(fieldValue) > Number(expectedValue);
      case "less_than":
        return Number(fieldValue) < Number(expectedValue);
      default:
        return false;
    }
  }

  // Export business logic configuration
  exportConfiguration(): BusinessLogicEngine {
    return { ...this.engine };
  }

  // Import business logic configuration
  importConfiguration(config: BusinessLogicEngine): void {
    this.engine = { ...config };
  }
}

import { BuilderComponent } from "./components";
import { BusinessRule, Workflow } from "./business-logic";

export interface BusinessLogicComponent extends BuilderComponent {
  businessLogic: {
    rules: BusinessRule[];
    workflows: Workflow[];
    triggers: string[];
    dataBindings: DataBinding[];
    validations: Validation[];
  };
}

export interface DataBinding {
  id: string;
  field: string;
  source: "form" | "api" | "user" | "session";
  target: string;
  transform?: string;
}

export interface Validation {
  id: string;
  field: string;
  type: "required" | "email" | "phone" | "number" | "custom";
  message: string;
  condition?: string;
}

export interface BusinessFormComponent extends BusinessLogicComponent {
  type: "BusinessForm";
  formConfig: {
    fields: FormField[];
    submitAction: string;
    validationRules: Validation[];
    businessRules: BusinessRule[];
  };
}

export interface FormField {
  id: string;
  name: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "select"
    | "checkbox"
    | "textarea";
  label: string;
  placeholder?: string;
  required: boolean;
  validation: Validation[];
  businessLogic: {
    rules: BusinessRule[];
    workflows: Workflow[];
  };
}

export interface BusinessWorkflowComponent extends BusinessLogicComponent {
  type: "BusinessWorkflow";
  workflowConfig: {
    workflow: Workflow;
    triggers: string[];
    conditions: WorkflowCondition[];
    dataFlow: DataFlow[];
  };
}

export interface WorkflowCondition {
  id: string;
  field: string;
  operator: "equals" | "not_equals" | "contains" | "greater_than" | "less_than";
  value: any;
  logic: "AND" | "OR";
}

export interface DataFlow {
  id: string;
  from: string;
  to: string;
  transform?: string;
  condition?: string;
}

export interface BusinessCheckoutComponent extends BusinessLogicComponent {
  type: "BusinessCheckout";
  checkoutConfig: {
    paymentMethods: string[];
    shippingOptions: ShippingOption[];
    taxCalculation: TaxRule[];
    discountRules: DiscountRule[];
    businessRules: BusinessRule[];
  };
}

export interface ShippingOption {
  id: string;
  name: string;
  cost: number;
  conditions: string[];
}

export interface TaxRule {
  id: string;
  name: string;
  rate: number;
  conditions: string[];
}

export interface DiscountRule {
  id: string;
  name: string;
  type: "percentage" | "fixed";
  value: number;
  conditions: string[];
}

export interface BusinessDashboardComponent extends BusinessLogicComponent {
  type: "BusinessDashboard";
  dashboardConfig: {
    widgets: DashboardWidget[];
    dataSources: DataSource[];
    refreshInterval: number;
    businessRules: BusinessRule[];
  };
}

export interface DashboardWidget {
  id: string;
  type: "chart" | "table" | "metric" | "list";
  title: string;
  dataSource: string;
  config: Record<string, any>;
  businessLogic: {
    rules: BusinessRule[];
    workflows: Workflow[];
  };
}

export interface DataSource {
  id: string;
  name: string;
  type: "api" | "database" | "file";
  endpoint: string;
  authentication?: Record<string, any>;
  transform?: string;
}

// Enhanced Component Library with Business Logic
export const BUSINESS_COMPONENT_LIBRARY: BusinessLogicComponent[] = [
  // Business Forms
  {
    id: "business-form",
    type: "BusinessForm",
    name: "Business Form",
    category: "Business Logic",
    description: "Form with business rules and validation",
    icon: "📝",
    props: {
      className: "p-6 bg-white border rounded-lg",
      formConfig: {
        fields: [],
        submitAction: "process_form",
        validationRules: [],
        businessRules: [],
      },
    },
    businessLogic: {
      rules: [],
      workflows: [],
      triggers: ["form_submit", "field_change"],
      dataBindings: [],
      validations: [],
    },
  },
  {
    id: "user-registration-form",
    type: "BusinessForm",
    name: "User Registration Form",
    category: "Business Logic",
    description: "User registration with business logic",
    icon: "👤",
    props: {
      className: "p-6 bg-white border rounded-lg",
      formConfig: {
        fields: [
          {
            id: "email",
            name: "email",
            type: "email",
            label: "Email Address",
            placeholder: "Enter your email",
            required: true,
            validation: [
              {
                id: "email_required",
                field: "email",
                type: "required",
                message: "Email is required",
              },
              {
                id: "email_format",
                field: "email",
                type: "email",
                message: "Please enter a valid email",
              },
            ],
            businessLogic: {
              rules: [],
              workflows: [],
            },
          },
          {
            id: "password",
            name: "password",
            type: "password",
            label: "Password",
            placeholder: "Enter your password",
            required: true,
            validation: [
              {
                id: "password_required",
                field: "password",
                type: "required",
                message: "Password is required",
              },
            ],
            businessLogic: {
              rules: [],
              workflows: [],
            },
          },
        ],
        submitAction: "register_user",
        validationRules: [],
        businessRules: [],
      },
    },
    businessLogic: {
      rules: [
        {
          id: "email_uniqueness",
          name: "Email Uniqueness",
          description: "Check if email is already registered",
          condition: "!user.email_exists",
          action: "allow_registration",
          priority: 1,
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
      triggers: ["form_submit", "email_change"],
      dataBindings: [
        {
          id: "email_binding",
          field: "email",
          source: "form",
          target: "user.email",
        },
      ],
      validations: [],
    },
  },

  // Business Workflows
  {
    id: "business-workflow",
    type: "BusinessWorkflow",
    name: "Business Workflow",
    category: "Business Logic",
    description: "Workflow with business logic and automation",
    icon: "⚡",
    props: {
      className: "p-6 bg-white border rounded-lg",
      workflowConfig: {
        workflow: {
          id: "default_workflow",
          name: "Default Workflow",
          description: "Default business workflow",
          trigger: "manual",
          steps: [],
          conditions: [],
          enabled: true,
        },
        triggers: [],
        conditions: [],
        dataFlow: [],
      },
    },
    businessLogic: {
      rules: [],
      workflows: [],
      triggers: ["workflow_start", "workflow_complete"],
      dataBindings: [],
      validations: [],
    },
  },

  // Business Checkout
  {
    id: "business-checkout",
    type: "BusinessCheckout",
    name: "Business Checkout",
    category: "Business Logic",
    description: "Checkout process with business rules",
    icon: "🛒",
    props: {
      className: "p-6 bg-white border rounded-lg",
      checkoutConfig: {
        paymentMethods: ["stripe", "paypal"],
        shippingOptions: [
          {
            id: "standard",
            name: "Standard Shipping",
            cost: 5.99,
            conditions: ["order_total > 50"],
          },
        ],
        taxCalculation: [
          {
            id: "sales_tax",
            name: "Sales Tax",
            rate: 0.08,
            conditions: ["shipping_address.state"],
          },
        ],
        discountRules: [
          {
            id: "first_order",
            name: "First Order Discount",
            type: "percentage",
            value: 10,
            conditions: ["user.is_new_customer"],
          },
        ],
        businessRules: [],
      },
    },
    businessLogic: {
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
      triggers: ["checkout_start", "payment_success", "order_complete"],
      dataBindings: [
        {
          id: "cart_binding",
          field: "cart",
          source: "session",
          target: "checkout.cart",
        },
      ],
      validations: [],
    },
  },

  // Business Dashboard
  {
    id: "business-dashboard",
    type: "BusinessDashboard",
    name: "Business Dashboard",
    category: "Business Logic",
    description: "Dashboard with business metrics and logic",
    icon: "📊",
    props: {
      className: "p-6 bg-white border rounded-lg",
      dashboardConfig: {
        widgets: [
          {
            id: "sales_metric",
            type: "metric",
            title: "Total Sales",
            dataSource: "sales_api",
            config: { format: "currency" },
            businessLogic: {
              rules: [],
              workflows: [],
            },
          },
        ],
        dataSources: [
          {
            id: "sales_api",
            name: "Sales API",
            type: "api",
            endpoint: "/api/sales",
            authentication: { type: "bearer" },
          },
        ],
        refreshInterval: 30000,
        businessRules: [],
      },
    },
    businessLogic: {
      rules: [
        {
          id: "data_refresh",
          name: "Data Refresh",
          description: "Refresh data based on user activity",
          condition: "user.is_active",
          action: "refresh_data",
          priority: 1,
          enabled: true,
        },
      ],
      workflows: [],
      triggers: ["data_update", "user_interaction"],
      dataBindings: [],
      validations: [],
    },
  },
];

// Business Logic Component Factory
export class BusinessComponentFactory {
  static createBusinessForm(config: {
    fields: FormField[];
    submitAction: string;
    businessRules?: BusinessRule[];
    workflows?: Workflow[];
  }): BusinessFormComponent {
    return {
      id: `business_form_${Date.now()}`,
      type: "BusinessForm",
      name: "Business Form",
      category: "Business Logic",
      description: "Form with business logic",
      icon: "📝",
      props: {
        className: "p-6 bg-white border rounded-lg",
        formConfig: {
          fields: config.fields,
          submitAction: config.submitAction,
          validationRules: [],
          businessRules: config.businessRules || [],
        },
      },
      formConfig: {
        fields: config.fields,
        submitAction: config.submitAction,
        validationRules: [],
        businessRules: config.businessRules || [],
      },
      businessLogic: {
        rules: config.businessRules || [],
        workflows: config.workflows || [],
        triggers: ["form_submit", "field_change"],
        dataBindings: [],
        validations: [],
      },
    };
  }

  static createBusinessWorkflow(config: {
    workflow: Workflow;
    triggers: string[];
    conditions: WorkflowCondition[];
  }): BusinessWorkflowComponent {
    return {
      id: `business_workflow_${Date.now()}`,
      type: "BusinessWorkflow",
      name: "Business Workflow",
      category: "Business Logic",
      description: "Workflow with business logic",
      icon: "⚡",
      props: {
        className: "p-6 bg-white border rounded-lg",
        workflowConfig: {
          workflow: config.workflow,
          triggers: config.triggers,
          conditions: config.conditions,
          dataFlow: [],
        },
      },
      workflowConfig: {
        workflow: config.workflow,
        triggers: config.triggers,
        conditions: config.conditions,
        dataFlow: [],
      },
      businessLogic: {
        rules: [],
        workflows: [config.workflow],
        triggers: config.triggers,
        dataBindings: [],
        validations: [],
      },
    };
  }

  static createBusinessCheckout(config: {
    paymentMethods: string[];
    shippingOptions: ShippingOption[];
    businessRules: BusinessRule[];
  }): BusinessCheckoutComponent {
    return {
      id: `business_checkout_${Date.now()}`,
      type: "BusinessCheckout",
      name: "Business Checkout",
      category: "Business Logic",
      description: "Checkout with business logic",
      icon: "🛒",
      props: {
        className: "p-6 bg-white border rounded-lg",
        checkoutConfig: {
          paymentMethods: config.paymentMethods,
          shippingOptions: config.shippingOptions,
          taxCalculation: [],
          discountRules: [],
          businessRules: config.businessRules,
        },
      },
      checkoutConfig: {
        paymentMethods: config.paymentMethods,
        shippingOptions: config.shippingOptions,
        taxCalculation: [],
        discountRules: [],
        businessRules: config.businessRules,
      },
      businessLogic: {
        rules: config.businessRules,
        workflows: [],
        triggers: ["checkout_start", "payment_success"],
        dataBindings: [],
        validations: [],
      },
    };
  }
}

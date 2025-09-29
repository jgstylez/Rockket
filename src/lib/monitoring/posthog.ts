import { PostHog } from "posthog-js";

// Initialize PostHog
let posthog: PostHog | null = null;

export function initPostHog() {
  if (typeof window !== "undefined" && !posthog) {
    posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host:
        process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
      person_profiles: "identified_only",
      capture_pageview: false, // We'll handle this manually
      capture_pageleave: true,
      loaded: (posthog) => {
        if (process.env.NODE_ENV === "development") {
          console.log("PostHog loaded");
        }
      },
    });
  }
  return posthog;
}

export function getPostHog() {
  if (!posthog) {
    posthog = initPostHog();
  }
  return posthog;
}

// Analytics tracking utilities
export class AnalyticsTracker {
  static identify(user: {
    id: string;
    email: string;
    name: string;
    tenantId: string;
    role: string;
    plan?: string;
  }) {
    const posthog = getPostHog();
    if (posthog) {
      posthog.identify(user.id, {
        email: user.email,
        name: user.name,
        tenantId: user.tenantId,
        role: user.role,
        plan: user.plan,
        $set: {
          email: user.email,
          name: user.name,
          tenantId: user.tenantId,
          role: user.role,
          plan: user.plan,
        },
      });
    }
  }

  static track(event: string, properties?: Record<string, any>) {
    const posthog = getPostHog();
    if (posthog) {
      posthog.capture(event, {
        ...properties,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        pathname: window.location.pathname,
      });
    }
  }

  static page(pageName: string, properties?: Record<string, any>) {
    const posthog = getPostHog();
    if (posthog) {
      posthog.capture("$pageview", {
        $current_url: window.location.href,
        page_name: pageName,
        ...properties,
      });
    }
  }

  static setUserProperties(properties: Record<string, any>) {
    const posthog = getPostHog();
    if (posthog) {
      posthog.people.set(properties);
    }
  }

  static setGroup(
    groupType: string,
    groupKey: string,
    properties?: Record<string, any>
  ) {
    const posthog = getPostHog();
    if (posthog) {
      posthog.group(groupType, groupKey, properties);
    }
  }

  static reset() {
    const posthog = getPostHog();
    if (posthog) {
      posthog.reset();
    }
  }
}

// Business event tracking
export class BusinessAnalytics {
  static trackUserRegistration(user: {
    id: string;
    email: string;
    name: string;
    tenantId: string;
    source?: string;
  }) {
    AnalyticsTracker.identify({
      id: user.id,
      email: user.email,
      name: user.name,
      tenantId: user.tenantId,
      role: "owner",
    });

    AnalyticsTracker.track("user_registered", {
      user_id: user.id,
      tenant_id: user.tenantId,
      source: user.source || "direct",
      registration_date: new Date().toISOString(),
    });

    AnalyticsTracker.setGroup("tenant", user.tenantId, {
      created_at: new Date().toISOString(),
      plan: "free",
    });
  }

  static trackTenantCreation(tenant: {
    id: string;
    name: string;
    slug: string;
    plan: string;
    ownerId: string;
  }) {
    AnalyticsTracker.track("tenant_created", {
      tenant_id: tenant.id,
      tenant_name: tenant.name,
      tenant_slug: tenant.slug,
      plan: tenant.plan,
      owner_id: tenant.ownerId,
      creation_date: new Date().toISOString(),
    });

    AnalyticsTracker.setGroup("tenant", tenant.id, {
      name: tenant.name,
      slug: tenant.slug,
      plan: tenant.plan,
      created_at: new Date().toISOString(),
    });
  }

  static trackAIGeneration(
    userId: string,
    tenantId: string,
    prompt: string,
    provider: string,
    result: {
      success: boolean;
      tokens?: number;
      cost?: number;
      duration?: number;
    }
  ) {
    AnalyticsTracker.track("ai_generation", {
      user_id: userId,
      tenant_id: tenantId,
      prompt_length: prompt.length,
      provider,
      success: result.success,
      tokens: result.tokens,
      cost: result.cost,
      duration: result.duration,
      timestamp: new Date().toISOString(),
    });
  }

  static trackVisualBuilderUsage(
    userId: string,
    tenantId: string,
    action: string,
    component?: string,
    projectId?: string
  ) {
    AnalyticsTracker.track("visual_builder_usage", {
      user_id: userId,
      tenant_id: tenantId,
      action,
      component,
      project_id: projectId,
      timestamp: new Date().toISOString(),
    });
  }

  static trackContentCreation(
    userId: string,
    tenantId: string,
    contentType: string,
    contentId: string
  ) {
    AnalyticsTracker.track("content_created", {
      user_id: userId,
      tenant_id: tenantId,
      content_type: contentType,
      content_id: contentId,
      timestamp: new Date().toISOString(),
    });
  }

  static trackEcommerceActivity(
    userId: string,
    tenantId: string,
    activity: string,
    productId?: string,
    orderId?: string,
    amount?: number
  ) {
    AnalyticsTracker.track("ecommerce_activity", {
      user_id: userId,
      tenant_id: tenantId,
      activity,
      product_id: productId,
      order_id: orderId,
      amount,
      timestamp: new Date().toISOString(),
    });
  }

  static trackPaymentEvent(
    userId: string,
    tenantId: string,
    event: string,
    amount: number,
    currency: string,
    plan?: string
  ) {
    AnalyticsTracker.track("payment_event", {
      user_id: userId,
      tenant_id: tenantId,
      event,
      amount,
      currency,
      plan,
      timestamp: new Date().toISOString(),
    });
  }

  static trackFeatureUsage(
    userId: string,
    tenantId: string,
    feature: string,
    action: string,
    metadata?: Record<string, any>
  ) {
    AnalyticsTracker.track("feature_usage", {
      user_id: userId,
      tenant_id: tenantId,
      feature,
      action,
      metadata,
      timestamp: new Date().toISOString(),
    });
  }
}

// User journey tracking
export class UserJourneyTracker {
  static trackOnboardingStep(
    userId: string,
    tenantId: string,
    step: string,
    completed: boolean
  ) {
    AnalyticsTracker.track("onboarding_step", {
      user_id: userId,
      tenant_id: tenantId,
      step,
      completed,
      timestamp: new Date().toISOString(),
    });
  }

  static trackDashboardUsage(
    userId: string,
    tenantId: string,
    section: string,
    action: string
  ) {
    AnalyticsTracker.track("dashboard_usage", {
      user_id: userId,
      tenant_id: tenantId,
      section,
      action,
      timestamp: new Date().toISOString(),
    });
  }

  static trackAPICall(
    userId: string,
    tenantId: string,
    endpoint: string,
    method: string,
    statusCode: number,
    duration: number
  ) {
    AnalyticsTracker.track("api_call", {
      user_id: userId,
      tenant_id: tenantId,
      endpoint,
      method,
      status_code: statusCode,
      duration,
      timestamp: new Date().toISOString(),
    });
  }
}

// Performance tracking
export class PerformanceAnalytics {
  static trackPageLoad(
    pageName: string,
    loadTime: number,
    metadata?: Record<string, any>
  ) {
    AnalyticsTracker.track("page_load", {
      page_name: pageName,
      load_time: loadTime,
      ...metadata,
      timestamp: new Date().toISOString(),
    });
  }

  static trackComponentRender(
    componentName: string,
    renderTime: number,
    props?: Record<string, any>
  ) {
    AnalyticsTracker.track("component_render", {
      component_name: componentName,
      render_time: renderTime,
      props,
      timestamp: new Date().toISOString(),
    });
  }

  static trackDatabaseQuery(
    query: string,
    duration: number,
    success: boolean,
    tenantId: string
  ) {
    AnalyticsTracker.track("database_query", {
      query: query.substring(0, 100), // Truncate for privacy
      duration,
      success,
      tenant_id: tenantId,
      timestamp: new Date().toISOString(),
    });
  }
}

// A/B testing utilities
export class ABTesting {
  static getFeatureFlag(
    flagName: string,
    defaultValue: boolean = false
  ): boolean {
    const posthog = getPostHog();
    if (posthog) {
      return posthog.isFeatureEnabled(flagName) ?? defaultValue;
    }
    return defaultValue;
  }

  static getFeatureFlagValue(flagName: string, defaultValue: any = null): any {
    const posthog = getPostHog();
    if (posthog) {
      return posthog.getFeatureFlag(flagName) ?? defaultValue;
    }
    return defaultValue;
  }

  static trackFeatureFlagExposure(flagName: string, value: any) {
    AnalyticsTracker.track("feature_flag_exposure", {
      flag_name: flagName,
      flag_value: value,
      timestamp: new Date().toISOString(),
    });
  }
}

// React hooks for analytics
export function useAnalytics() {
  return {
    track: AnalyticsTracker.track,
    identify: AnalyticsTracker.identify,
    page: AnalyticsTracker.page,
    setUserProperties: AnalyticsTracker.setUserProperties,
  };
}

export function useFeatureFlag(
  flagName: string,
  defaultValue: boolean = false
) {
  const [value, setValue] = React.useState(defaultValue);

  React.useEffect(() => {
    const posthog = getPostHog();
    if (posthog) {
      const flagValue = posthog.isFeatureEnabled(flagName) ?? defaultValue;
      setValue(flagValue);
    }
  }, [flagName, defaultValue]);

  return value;
}

// Export PostHog instance for direct access
export { posthog };
export default AnalyticsTracker;

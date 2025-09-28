// User Types
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: UserRole
  tenantId: string
  createdAt: Date
  updatedAt: Date
}

export type UserRole = 'admin' | 'owner' | 'member' | 'viewer'

// Tenant Types
export interface Tenant {
  id: string
  name: string
  slug: string
  domain?: string
  settings: TenantSettings
  plan: Plan
  status: TenantStatus
  createdAt: Date
  updatedAt: Date
}

export interface TenantSettings {
  branding: BrandingSettings
  features: FeatureSettings
  integrations: IntegrationSettings
  notifications: NotificationSettings
}

export interface BrandingSettings {
  logo?: string
  favicon?: string
  primaryColor: string
  secondaryColor: string
  customCss?: string
}

export interface FeatureSettings {
  aiGenerator: boolean
  visualBuilder: boolean
  cms: boolean
  ecommerce: boolean
  analytics: boolean
  billing: boolean
}

export interface IntegrationSettings {
  stripe?: StripeSettings
  email?: EmailSettings
  analytics?: AnalyticsSettings
}

export interface StripeSettings {
  customerId: string
  subscriptionId?: string
  paymentMethodId?: string
}

export interface EmailSettings {
  provider: 'resend' | 'sendgrid' | 'mailgun'
  apiKey: string
  fromEmail: string
  fromName: string
}

export interface AnalyticsSettings {
  provider: 'posthog' | 'mixpanel' | 'amplitude'
  apiKey: string
  trackingId: string
}

export interface NotificationSettings {
  email: boolean
  push: boolean
  sms: boolean
}

export type Plan = 'free' | 'starter' | 'professional' | 'enterprise'
export type TenantStatus = 'active' | 'suspended' | 'cancelled'

// Feature Flag Types
export interface FeatureFlag {
  id: string
  name: string
  description: string
  enabled: boolean
  variants: FeatureFlagVariant[]
  rules: FeatureFlagRule[]
  createdAt: Date
  updatedAt: Date
}

export interface FeatureFlagVariant {
  id: string
  name: string
  value: any
  weight: number
}

export interface FeatureFlagRule {
  id: string
  condition: string
  variant: string
  weight: number
}

export interface FeatureFlagContext {
  flags: Record<string, boolean>
  isLoading: boolean
  isEnabled: (flagName: string) => boolean
  getVariant: (flagName: string) => string
}

// AI Types
export interface AIGeneration {
  id: string
  type: AIGenerationType
  prompt: string
  result: string
  metadata: Record<string, any>
  cost: number
  tokens: number
  userId: string
  tenantId: string
  createdAt: Date
}

export type AIGenerationType = 'text' | 'image' | 'code' | 'design' | 'content'

export interface AIProvider {
  id: string
  name: string
  type: 'openai' | 'anthropic' | 'google' | 'custom'
  apiKey: string
  baseUrl?: string
  enabled: boolean
  costPerToken: number
  rateLimit: number
}

// Content Types
export interface Content {
  id: string
  title: string
  slug: string
  type: ContentType
  status: ContentStatus
  content: string
  metadata: ContentMetadata
  tenantId: string
  authorId: string
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
}

export type ContentType = 'page' | 'post' | 'product' | 'course' | 'template'
export type ContentStatus = 'draft' | 'published' | 'archived'

export interface ContentMetadata {
  seo: SEOMetadata
  social: SocialMetadata
  custom: Record<string, any>
}

export interface SEOMetadata {
  title?: string
  description?: string
  keywords?: string[]
  canonical?: string
  robots?: string
}

export interface SocialMetadata {
  title?: string
  description?: string
  image?: string
  twitterCard?: string
}

// E-commerce Types
export interface Product {
  id: string
  name: string
  description: string
  price: number
  currency: string
  sku: string
  inventory: number
  images: string[]
  variants: ProductVariant[]
  tenantId: string
  createdAt: Date
  updatedAt: Date
}

export interface ProductVariant {
  id: string
  name: string
  price: number
  sku: string
  inventory: number
  attributes: Record<string, string>
}

export interface Order {
  id: string
  customerId: string
  items: OrderItem[]
  total: number
  currency: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  shippingAddress: Address
  billingAddress: Address
  tenantId: string
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  productId: string
  variantId?: string
  quantity: number
  price: number
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface Address {
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
}

// Analytics Types
export interface AnalyticsEvent {
  id: string
  event: string
  properties: Record<string, any>
  userId?: string
  sessionId: string
  tenantId: string
  timestamp: Date
}

export interface AnalyticsMetric {
  name: string
  value: number
  dimensions: Record<string, string>
  timestamp: Date
}

// API Types
export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// Form Types
export interface FormField {
  id: string
  name: string
  type: FormFieldType
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
  validation?: ValidationRule[]
}

export type FormFieldType = 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'file'

export interface ValidationRule {
  type: 'required' | 'email' | 'min' | 'max' | 'pattern'
  value?: any
  message: string
}

// Notification Types
export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  userId: string
  tenantId: string
  createdAt: Date
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error'

// File Types
export interface FileUpload {
  id: string
  name: string
  size: number
  type: string
  url: string
  tenantId: string
  uploadedBy: string
  createdAt: Date
}

// Integration Types
export interface Integration {
  id: string
  name: string
  type: IntegrationType
  status: IntegrationStatus
  config: Record<string, any>
  tenantId: string
  createdAt: Date
  updatedAt: Date
}

export type IntegrationType = 'stripe' | 'email' | 'analytics' | 'crm' | 'marketing' | 'custom'
export type IntegrationStatus = 'active' | 'inactive' | 'error' | 'pending'

// Workflow Types
export interface Workflow {
  id: string
  name: string
  description: string
  triggers: WorkflowTrigger[]
  actions: WorkflowAction[]
  status: WorkflowStatus
  tenantId: string
  createdAt: Date
  updatedAt: Date
}

export interface WorkflowTrigger {
  id: string
  type: TriggerType
  config: Record<string, any>
}

export interface WorkflowAction {
  id: string
  type: ActionType
  config: Record<string, any>
}

export type TriggerType = 'webhook' | 'schedule' | 'event' | 'form_submission'
export type ActionType = 'email' | 'webhook' | 'database' | 'notification'
export type WorkflowStatus = 'active' | 'inactive' | 'draft'

// Error Types
export interface AppError {
  code: string
  message: string
  details?: Record<string, any>
  stack?: string
}

// Theme Types
export interface Theme {
  id: string
  name: string
  colors: ThemeColors
  typography: ThemeTypography
  spacing: ThemeSpacing
  components: Record<string, any>
}

export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  foreground: string
  muted: string
  border: string
}

export interface ThemeTypography {
  fontFamily: string
  fontSize: Record<string, string>
  fontWeight: Record<string, number>
  lineHeight: Record<string, string>
}

export interface ThemeSpacing {
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
  xxl: string
}

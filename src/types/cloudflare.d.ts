declare module "cloudflare:workers" {
  export interface Queue {
    send(message: unknown): Promise<void>;
    sendBatch(messages: unknown[]): Promise<void>;
  }

  export interface Fetcher {
    fetch(input: RequestInfo, init?: RequestInit): Promise<Response>;
  }
  export interface DurableObjectStub {
    name?: string;
    id: DurableObjectId;
    fetch(
      requestOrUrl: Request | string,
      init?: RequestInit
    ): Promise<Response>;
  }

  export interface DurableObjectId {
    toString(): string;
    equals(other: DurableObjectId): boolean;
    name?: string;
  }

  export interface DurableObjectNamespace {
    newUniqueId(options?: { jurisdiction?: string }): DurableObjectId;
    idFromName(name: string): DurableObjectId;
    idFromString(id: string): DurableObjectId;
    get(id: DurableObjectId): DurableObjectStub;
  }
  export interface Response extends globalThis.Response {
    webSocket?: WebSocket;
  }

  export interface ResponseInit extends globalThis.ResponseInit {
    webSocket?: WebSocket;
  }
  export class WebSocketPair {
    0: WebSocket;
    1: WebSocket;
  }

  export interface WebSocketEvent {
    type: string;
    data: string | ArrayBuffer;
    timeStamp: number;
  }

  export interface WebSocketCloseEvent extends WebSocketEvent {
    code: number;
    reason: string;
    wasClean: boolean;
  }

  export interface WebSocketErrorEvent extends WebSocketEvent {
    error: Error;
    message: string;
  }

  export interface WebSocket {
    accept(): void;
    send(message: string | ArrayBuffer | ArrayBufferView): void;
    close(code?: number, reason?: string): void;
    addEventListener(
      type: "message",
      handler: (event: WebSocketEvent) => void
    ): void;
    addEventListener(
      type: "close",
      handler: (event: WebSocketCloseEvent) => void
    ): void;
    addEventListener(
      type: "error",
      handler: (event: WebSocketErrorEvent) => void
    ): void;
    removeEventListener(
      type: "message",
      handler: (event: WebSocketEvent) => void
    ): void;
    removeEventListener(
      type: "close",
      handler: (event: WebSocketCloseEvent) => void
    ): void;
    removeEventListener(
      type: "error",
      handler: (event: WebSocketErrorEvent) => void
    ): void;
  }
  export interface KVNamespace {
    get(key: string, options?: KVNamespaceGetOptions): Promise<string | null>;
    get(
      key: string,
      type: "text",
      options?: KVNamespaceGetOptions
    ): Promise<string | null>;
    get<ExpectedValue = unknown>(
      key: string,
      type: "json",
      options?: KVNamespaceGetOptions
    ): Promise<ExpectedValue | null>;
    get(
      key: string,
      type: "arrayBuffer",
      options?: KVNamespaceGetOptions
    ): Promise<ArrayBuffer | null>;
    get(
      key: string,
      type: "stream",
      options?: KVNamespaceGetOptions
    ): Promise<ReadableStream | null>;
    put(
      key: string,
      value: string | ReadableStream | ArrayBuffer | FormData,
      options?: KVNamespacePutOptions
    ): Promise<void>;
    delete(key: string): Promise<void>;
    list(options?: KVNamespaceListOptions): Promise<KVNamespaceListResult>;
  }

  export interface KVNamespaceGetOptions {
    type?: "text" | "json" | "arrayBuffer" | "stream";
    cacheTtl?: number;
  }

  export interface KVNamespacePutOptions {
    expiration?: number;
    expirationTtl?: number;
    metadata?: Record<string, any>;
  }

  export interface KVNamespaceListOptions {
    prefix?: string;
    limit?: number;
    cursor?: string;
  }

  export interface KVNamespaceListResult {
    keys: KVNamespaceListKey[];
    list_complete: boolean;
    cursor?: string;
  }

  export interface KVNamespaceListKey {
    name: string;
    expiration?: number;
    metadata?: Record<string, any>;
  }

  export interface R2Bucket {
    get(key: string): Promise<R2Object | null>;
    put(
      key: string,
      value: string | ReadableStream | ArrayBuffer | FormData,
      options?: R2PutOptions
    ): Promise<R2Object>;
    delete(key: string): Promise<void>;
    list(options?: R2ListOptions): Promise<R2Objects>;
  }

  export interface R2Object {
    key: string;
    version: string;
    size: number;
    etag: string;
    httpEtag: string;
    checksums: R2Checksums;
    uploaded: Date;
    httpMetadata: R2HTTPMetadata;
    customMetadata: Record<string, string>;
    range?: R2Range;
    body?: ReadableStream;
    bodyUsed: boolean;
    writeHttpMetadata(headers: Headers): void;
  }

  export interface R2PutOptions {
    onlyIf?: R2Conditional;
    httpMetadata?: R2HTTPMetadata;
    customMetadata?: Record<string, string>;
    md5?: ArrayBuffer;
  }

  export interface R2ListOptions {
    prefix?: string;
    delimiter?: string;
    cursor?: string;
    limit?: number;
    include?: string[];
  }

  export interface R2Objects {
    objects: R2Object[];
    truncated: boolean;
    cursor?: string;
    delimitedPrefixes: string[];
  }

  export interface R2Checksums {
    md5?: ArrayBuffer;
    sha1?: ArrayBuffer;
    sha256?: ArrayBuffer;
    sha384?: ArrayBuffer;
    sha512?: ArrayBuffer;
  }

  export interface R2HTTPMetadata {
    contentType?: string;
    contentLanguage?: string;
    contentDisposition?: string;
    contentEncoding?: string;
    cacheControl?: string;
    cacheExpiry?: Date;
  }

  export interface R2Range {
    offset: number;
    length: number;
  }

  export interface R2Conditional {
    etagMatches?: string;
    etagDoesNotMatch?: string;
    uploadedBefore?: Date;
    uploadedAfter?: Date;
  }

  export interface Ai {
    run(model: string, options: AiOptions): Promise<AiResponse>;
  }

  export interface AiOptions {
    messages: AiMessage[];
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
    stop?: string[];
  }

  export interface AiMessage {
    role: "system" | "user" | "assistant";
    content: string;
  }

  export interface AiResponse {
    response: string;
    usage: {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
    };
  }
  export interface D1Database {
    prepare(query: string): D1PreparedStatement;
    batch<T = any>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
    dump(): Promise<ArrayBuffer>;
    exec<T = any>(query: string): Promise<D1Result<T>>;
  }

  export interface D1PreparedStatement {
    bind(...values: any[]): D1PreparedStatement;
    first<T = any>(colName?: string): Promise<T>;
    run<T = any>(): Promise<D1Result<T>>;
    all<T = any>(): Promise<D1Result<T>>;
  }

  export interface D1Result<T = any> {
    results?: T[];
    success: boolean;
    error?: string;
    meta: D1ResultMeta;
  }

  export interface D1ResultMeta {
    changes: number;
    duration: number;
    last_row_id: number;
    rows_read: number;
    rows_written: number;
    size_after: number;
  }
  export class DurableObject {
    constructor(state: DurableObjectState, env: any);
    state: DurableObjectState;
    env: any;
    fetch(request: Request): Promise<Response>;
  }

  export interface DurableObjectState {
    id: DurableObjectId;
    storage: DurableObjectStorage;
    waitUntil(promise: Promise<any>): void;
  }

  export interface DurableObjectId {
    toString(): string;
    equals(other: DurableObjectId): boolean;
    name?: string;
  }

  export interface DurableObjectStorage {
    get<T = any>(
      key: string,
      options?: { allowConcurrency?: boolean; noCache?: boolean }
    ): Promise<T | undefined>;
    get<T = any>(
      keys: string[],
      options?: { allowConcurrency?: boolean; noCache?: boolean }
    ): Promise<Map<string, T>>;
    list<T = any>(options?: {
      prefix?: string;
      start?: string;
      end?: string;
      reverse?: boolean;
      limit?: number;
      allowConcurrency?: boolean;
      noCache?: boolean;
    }): Promise<Map<string, T>>;
    put<T = any>(
      key: string,
      value: T,
      options?: { allowUnconfirmed?: boolean; noCache?: boolean }
    ): Promise<void>;
    put<T = any>(
      entries: Record<string, T>,
      options?: { allowUnconfirmed?: boolean; noCache?: boolean }
    ): Promise<void>;
    delete(
      key: string,
      options?: { allowUnconfirmed?: boolean }
    ): Promise<boolean>;
    delete(
      keys: string[],
      options?: { allowUnconfirmed?: boolean }
    ): Promise<number>;
    deleteAll(options?: { allowUnconfirmed?: boolean }): Promise<void>;
    transaction<T = any>(
      closure: (txn: DurableObjectTransaction) => Promise<T>
    ): Promise<T>;
  }

  export interface DurableObjectTransaction {
    get<T = any>(key: string): Promise<T | undefined>;
    get<T = any>(keys: string[]): Promise<Map<string, T>>;
    list<T = any>(options?: {
      prefix?: string;
      start?: string;
      end?: string;
      reverse?: boolean;
      limit?: number;
    }): Promise<Map<string, T>>;
    put<T = any>(key: string, value: T): Promise<void>;
    put<T = any>(entries: Record<string, T>): Promise<void>;
    delete(key: string): Promise<boolean>;
    delete(keys: string[]): Promise<number>;
    rollback(): void;
  }
}

export interface ApiKey {
    name: string;
    description: string | null;
    rate_limit: number | null;
    expires_in_days: number | null;
    id: string;
    created_at: string;
    expires_at: string | null;
    last_used_at: string | null;
    usage_count: number;
    is_active: boolean;
  }
  
  export interface ApiKeyResponse {
    api_key: ApiKey;
    key: string;
  }
  
  export interface ApiKeyFormData {
    name: string;
    description?: string;
    rate_limit?: number;
    expires_in_days?: number;
  }
  
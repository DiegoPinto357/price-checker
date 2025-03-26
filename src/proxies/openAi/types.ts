export type CreateResponseParams = {
  input: string;
  model?: string;
  instructions?: string;
};

export type OpenAiResponse = {
  id: string;
  object: string;
  created_at: number;
  status: 'completed' | 'failed' | 'pending';
  error: string | null;
  incomplete_details: string | null;
  instructions: string;
  max_output_tokens: number | null;
  model: string;
  output: {
    type: string;
    id: string;
    status: 'completed' | 'failed' | 'pending';
    role: 'assistant' | 'user' | 'system';
    content: {
      type: string;
      text: string;
      annotations: unknown[];
    }[];
  }[];
  parallel_tool_calls: boolean;
  previous_response_id: string | null;
  reasoning: {
    effort: string | null;
    generate_summary: string | null;
  };
  store: boolean;
  temperature: number;
  text: {
    format: {
      type: string;
    };
  };
  tool_choice: string;
  tools: unknown[];
  top_p: number;
  truncation: string;
  usage: {
    input_tokens: number;
    input_tokens_details: {
      cached_tokens: number;
    };
    output_tokens: number;
    output_tokens_details: {
      reasoning_tokens: number;
    };
    total_tokens: number;
  };
  user: string | null;
  metadata: Record<string, unknown>;
  output_text: string;
};

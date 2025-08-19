// LLM Service for integrating with actual AI providers
// This service can be easily connected to OpenAI, Anthropic, or other LLM providers

export interface LLMConfig {
  provider: 'openai' | 'anthropic' | 'local' | 'mock';
  apiKey?: string;
  model?: string;
  baseUrl?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface LLMRequest {
  prompt: string;
  context?: any;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface LLMResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model?: string;
  error?: string;
}

// Mock LLM for development/testing
class MockLLMService {
  async generateResponse(request: LLMRequest): Promise<LLMResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const { prompt, context } = request;
    
    // Generate contextual responses based on the prompt
    let response = '';
    
    if (prompt.includes('workout') || prompt.includes('training')) {
      response = this.generateWorkoutResponse(context);
    } else if (prompt.includes('nutrition') || prompt.includes('diet')) {
      response = this.generateNutritionResponse(context);
    } else if (prompt.includes('recovery') || prompt.includes('sleep')) {
      response = this.generateRecoveryResponse(context);
    } else if (prompt.includes('progression') || prompt.includes('improve')) {
      response = this.generateProgressionResponse(context);
    } else {
      response = this.generateGeneralResponse(context);
    }

    return {
      content: response,
      usage: {
        promptTokens: prompt.length,
        completionTokens: response.length,
        totalTokens: prompt.length + response.length
      },
      model: 'mock-llm-v1'
    };
  }

  private generateWorkoutResponse(context: any): string {
    const responses = [
      `Based on your profile and goals, I recommend focusing on compound movements with progressive overload. Your current equipment (${context?.equipment || 'basic'}) allows for effective strength training. Start with 3-4 sets of 6-8 reps for compound lifts, focusing on form and controlled movement. Track your RPE (Rate of Perceived Exertion) and aim for 7-8 on working sets.`,
      
      `For your ${context?.targetPhysique || 'fitness'} goals, I suggest a 4-5 day training split. Day 1: Push (chest, shoulders, triceps), Day 2: Pull (back, biceps), Day 3: Legs, Day 4: Full body or conditioning, Day 5: Active recovery. Use RPE 7-8 for main lifts and 8-9 for accessory work.`,
      
      `Your training frequency of ${context?.trainingFrequency || '3-4'} days per week is perfect for building strength while allowing adequate recovery. Focus on compound movements like squats, deadlifts, bench press, and overhead press. Start with 3 sets and gradually increase to 4-5 sets as you adapt.`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private generateNutritionResponse(context: any): string {
    const responses = [
      `Based on your activity level (${context?.activityLevel || 'moderate'}) and goals, your daily calorie target should be around ${context?.weight ? Math.round(context.weight * 15) : 2000} kcal. Protein: ${context?.weight ? Math.round(context.weight * 2.2) : 150}g, Carbs: ${context?.weight ? Math.round(context.weight * 4) : 250}g, Fat: ${context?.weight ? Math.round(context.weight * 0.8) : 70}g.`,
      
      `For optimal muscle growth and recovery, aim for 1.6-2.2g protein per kg bodyweight. Your current weight of ${context?.weight || '80'}kg means ${Math.round((context?.weight || 80) * 2.2)}g protein daily. Distribute this across 4-6 meals for consistent amino acid availability.`,
      
      `Your sleep quality of ${context?.sleepQuality || '7'}/10 affects recovery and progress. Consider increasing protein intake by 10-15% on training days and ensuring adequate hydration (3-4L daily). Pre-workout: 30-60g carbs + 20-30g protein, Post-workout: 40-60g carbs + 20-40g protein.`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private generateRecoveryResponse(context: any): string {
    const responses = [
      `Your sleep quality of ${context?.sleepQuality || '7'}/10 is crucial for recovery. Aim for 7-9 hours nightly with consistent sleep/wake times. Consider implementing a wind-down routine: no screens 1 hour before bed, cool room temperature (18-20°C), and relaxation techniques like deep breathing or meditation.`,
      
      `Based on your stress level (${context?.stressLevel || 'moderate'}), recovery should be a priority. Implement active recovery days with light cardio (30-40% max heart rate), mobility work, and foam rolling. Consider deload weeks every 4-6 weeks to prevent overtraining.`,
      
      `Your current recovery markers suggest ${context?.sleepQuality >= 8 ? 'excellent' : context?.sleepQuality >= 6 ? 'good' : 'needs improvement'} recovery capacity. Focus on sleep optimization, stress management, and proper nutrition timing. Monitor resting heart rate and subjective recovery scores to adjust training intensity.`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private generateProgressionResponse(context: any): string {
    const responses = [
      `For progressive overload, increase weight when you can complete 8 reps with RPE ≤7 for 2 consecutive sessions. Upper body: +2.5kg increments, Lower body: +5kg increments. Track your progress in a training log and aim for 2-5% weekly improvement in total volume.`,
      
      `Your progression strategy should be RPE-based. Start with 3 sets and progress to 4-5 sets before increasing weight. Use tempo variations (3-0-1-0 for strength, 2-0-2-0 for hypertrophy) and implement drop sets for intensity. Monitor recovery indicators and adjust volume accordingly.`,
      
      `Based on your experience level (${context?.fitnessExperience || 'intermediate'}), focus on consistent progression rather than rapid increases. Track RPE, rest periods, and subjective recovery. Implement deload weeks every 4-6 weeks and use autoregulation to adjust training based on daily readiness.`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private generateGeneralResponse(context: any): string {
    const responses = [
      `I'm here to help you optimize your fitness journey! Based on your profile, you're making great progress. Focus on consistency, proper form, and progressive overload. Remember to track your progress and adjust your plan based on results and recovery.`,
      
      `Your fitness journey is unique, and I'm here to provide personalized guidance. Keep asking questions about specific areas you want to improve, and I'll give you evidence-based recommendations tailored to your goals and circumstances.`,
      
      `Great question! I'm designed to help with all aspects of fitness: training, nutrition, recovery, and progress tracking. Ask me anything specific about your goals, and I'll provide actionable advice backed by scientific research.`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

// OpenAI Integration
class OpenAIService {
  private config: LLMConfig;

  constructor(config: LLMConfig) {
    this.config = config;
  }

  async generateResponse(request: LLMRequest): Promise<LLMResponse> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.config.model || 'gpt-4',
          messages: [
            {
              role: 'system',
              content: request.systemPrompt || 'You are an expert fitness coach with deep knowledge of exercise science, nutrition, and sports medicine. Provide evidence-based, actionable advice with scientific citations when appropriate.'
            },
            {
              role: 'user',
              content: this.buildPrompt(request)
            }
          ],
          temperature: request.temperature || this.config.temperature || 0.7,
          max_tokens: request.maxTokens || this.config.maxTokens || 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        content: data.choices[0].message.content,
        usage: data.usage,
        model: data.model
      };
    } catch (error) {
      return {
        content: 'I apologize, but I encountered an error connecting to my AI service. Please try again later.',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private buildPrompt(request: LLMRequest): string {
    let prompt = request.prompt;
    
    if (request.context) {
      prompt += `\n\nContext about the user:\n${JSON.stringify(request.context, null, 2)}`;
    }
    
    return prompt;
  }
}

// Anthropic Integration
class AnthropicService {
  private config: LLMConfig;

  constructor(config: LLMConfig) {
    this.config = config;
  }

  async generateResponse(request: LLMRequest): Promise<LLMResponse> {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.config.model || 'claude-3-sonnet-20240229',
          max_tokens: request.maxTokens || this.config.maxTokens || 1000,
          temperature: request.temperature || this.config.temperature || 0.7,
          messages: [
            {
              role: 'user',
              content: this.buildPrompt(request)
            }
          ],
          system: request.systemPrompt || 'You are an expert fitness coach with deep knowledge of exercise science, nutrition, and sports medicine. Provide evidence-based, actionable advice with scientific citations when appropriate.'
        }),
      });

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        content: data.content[0].text,
        usage: {
          promptTokens: data.usage.input_tokens,
          completionTokens: data.usage.output_tokens,
          totalTokens: data.usage.input_tokens + data.usage.output_tokens
        },
        model: data.model
      };
    } catch (error) {
      return {
        content: 'I apologize, but I encountered an error connecting to my AI service. Please try again later.',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private buildPrompt(request: LLMRequest): string {
    let prompt = request.prompt;
    
    if (request.context) {
      prompt += `\n\nContext about the user:\n${JSON.stringify(request.context, null, 2)}`;
    }
    
    return prompt;
  }
}

// Main LLM Service Factory
export class LLMService {
  private service: MockLLMService | OpenAIService | AnthropicService;
  private config: LLMConfig;

  constructor(config: LLMConfig) {
    this.config = config;
    
    switch (config.provider) {
      case 'openai':
        if (!config.apiKey) {
          throw new Error('OpenAI API key is required');
        }
        this.service = new OpenAIService(config);
        break;
      case 'anthropic':
        if (!config.apiKey) {
          throw new Error('Anthropic API key is required');
        }
        this.service = new AnthropicService(config);
        break;
      case 'mock':
      default:
        this.service = new MockLLMService();
        break;
    }
  }

  async generateResponse(request: LLMRequest): Promise<LLMResponse> {
    return this.service.generateResponse(request);
  }

  // Helper method for fitness-specific prompts
  async generateFitnessAdvice(
    question: string, 
    userProfile: any, 
    context?: any
  ): Promise<LLMResponse> {
    const systemPrompt = `You are an expert fitness coach specializing in strength training, nutrition, and sports science. 

Key principles:
- Always provide evidence-based advice with scientific citations (NSCA, ACSM, ISSN, peer-reviewed research)
- Consider the user's specific goals, equipment, and limitations
- Provide actionable, specific recommendations
- Include safety considerations and progression strategies
- Use RPE (Rate of Perceived Exertion) for intensity guidance
- Emphasize proper form and progressive overload

User Profile: ${JSON.stringify(userProfile, null, 2)}

Respond in a helpful, encouraging tone with clear action steps.`;

    return this.generateResponse({
      prompt: question,
      context: { userProfile, ...context },
      systemPrompt,
      temperature: 0.7,
      maxTokens: 1500
    });
  }
}

// Default configuration
export const defaultLLMConfig: LLMConfig = {
  provider: 'mock', // Change to 'openai' or 'anthropic' when ready
  temperature: 0.7,
  maxTokens: 1500
};

// Create and export default service instance
export const llmService = new LLMService(defaultLLMConfig);

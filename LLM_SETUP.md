# LLM Setup Guide for SciOptimal Fitness App

## 🚀 Connect Your App to Real AI Intelligence

Your SciOptimal app now has a foundation for real AI-powered fitness coaching! Here's how to connect it to actual LLM providers.

## 📋 Prerequisites

- Node.js and npm installed
- Access to OpenAI or Anthropic API (or both)

## 🔑 Step 1: Get API Keys

### OpenAI (Recommended for Production)
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create account and add billing information
3. Go to API Keys section
4. Generate a new API key
5. Copy the key (starts with `sk-...`)

### Anthropic (Alternative Option)
1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Create account and add billing information
3. Go to API Keys section
4. Generate a new API key
5. Copy the key (starts with `sk-ant-...`)

## ⚙️ Step 2: Configure Environment Variables

1. **Create a `.env` file** in your project root:
```bash
touch .env
```

2. **Add your API keys** to the `.env` file:
```env
# OpenAI Configuration
REACT_APP_OPENAI_API_KEY=sk-your_openai_key_here

# Anthropic Configuration
REACT_APP_ANTHROPIC_API_KEY=sk-ant-your_anthropic_key_here

# LLM Provider Selection
REACT_APP_LLM_PROVIDER=openai

# Model Selection
REACT_APP_LLM_MODEL=gpt-4

# Response Settings
REACT_APP_LLM_TEMPERATURE=0.7
REACT_APP_LLM_MAX_TOKENS=1500
```

## 🔧 Step 3: Update Configuration

1. **Open `src/config/llmConfig.ts`**
2. **Choose your preferred provider** by updating the production config:
```typescript
// For OpenAI
export const productionConfig: LLMConfig = openAIConfig;

// OR for Anthropic
export const productionConfig: LLMConfig = anthropicConfig;
```

3. **Update the LLM service** in `src/services/llmService.ts`:
```typescript
// Change this line from 'mock' to your preferred provider
export const defaultLLMConfig: LLMConfig = {
  provider: 'openai', // or 'anthropic'
  apiKey: process.env.REACT_APP_OPENAI_API_KEY, // or REACT_APP_ANTHROPIC_API_KEY
  temperature: 0.7,
  maxTokens: 1500
};
```

## 🧪 Step 4: Test the Integration

1. **Restart your development server**:
```bash
npm start
```

2. **Complete your profile setup** (if not done already)
3. **Navigate to "AI Coach"** in the main menu
4. **Ask a fitness question** like:
   - "How should I structure my workouts for my goals?"
   - "What's the best nutrition strategy for my body type?"
   - "How do I know when to increase weight?"

5. **Verify you get intelligent, contextual responses** instead of mock responses

## 💰 Cost Considerations

### OpenAI Pricing (per 1K tokens)
- **GPT-4**: $0.03 input, $0.06 output
- **GPT-3.5-turbo**: $0.0015 input, $0.002 output

### Anthropic Pricing (per 1K tokens)
- **Claude-3-Sonnet**: $0.003 input, $0.015 output
- **Claude-3-Haiku**: $0.00025 input, $0.00125 output

### Estimated Monthly Costs (100 requests/month)
- **GPT-4**: ~$4.50
- **GPT-3.5-turbo**: ~$0.35
- **Claude-3-Sonnet**: ~$1.80
- **Claude-3-Haiku**: ~$0.15

## 🛡️ Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for all sensitive data
3. **Set up billing alerts** to monitor usage
4. **Rotate API keys** periodically
5. **Use the least privileged** API access level

## 🔍 Troubleshooting

### Common Issues

**"API key not found" error**
- Ensure your `.env` file is in the project root
- Check that environment variable names start with `REACT_APP_`
- Restart the development server after adding keys

**"Rate limit exceeded" error**
- Check your API provider's rate limits
- Consider upgrading your plan or using a different model
- Implement request throttling if needed

**"Invalid API key" error**
- Verify your API key is correct
- Check that your account has billing set up
- Ensure your API key has the necessary permissions

### Debug Mode

Enable debug logging by adding to your `.env`:
```env
REACT_APP_DEBUG=true
```

## 🎯 Advanced Configuration

### Custom System Prompts

Edit the system prompts in `src/services/llmService.ts` to customize:
- Response tone and style
- Specific fitness principles
- Citation preferences
- Response length and detail

### Model Selection

Choose different models based on your needs:
- **GPT-4**: Best reasoning, highest cost
- **GPT-3.5-turbo**: Good balance, lower cost
- **Claude-3-Sonnet**: Excellent reasoning, good value
- **Claude-3-Haiku**: Fast responses, lowest cost

### Temperature Settings

Adjust creativity vs. consistency:
- **0.0-0.3**: Very consistent, focused responses
- **0.4-0.7**: Balanced (recommended)
- **0.8-1.0**: More creative, varied responses

## 🚀 Production Deployment

1. **Set environment variables** in your hosting platform
2. **Choose production LLM provider** in `llmConfig.ts`
3. **Test thoroughly** before going live
4. **Monitor costs** and usage patterns
5. **Set up error tracking** for API failures

## 📚 Additional Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Anthropic API Documentation](https://docs.anthropic.com/)
- [React Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)
- [Fitness Science Resources](https://www.nsca.com/education/position-statements/)

## 🎉 You're All Set!

Your SciOptimal app now has real AI intelligence! The AI coach will provide:
- **Personalized workout advice** based on your profile
- **Evidence-based nutrition guidance** with scientific citations
- **Recovery optimization strategies** tailored to your lifestyle
- **Progressive overload planning** for continuous improvement
- **Real-time coaching** for all your fitness questions

Start asking questions and watch your fitness journey transform with AI-powered guidance! 💪🤖

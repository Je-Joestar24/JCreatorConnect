import Groq from 'groq-sdk';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Generate AI content using Groq
 * @param {string} prompt - The prompt to send to AI
 * @param {string} purpose - Purpose of the generation (for logging)
 * @returns {Promise<string>} - AI generated response
 */
const generateAI = async (prompt, purpose = 'other') => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.1-70b-versatile', // You can change this to other Groq models
      temperature: 0.7,
      max_tokens: 1000,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Groq API Error:', error);
    throw new Error('Failed to generate AI content');
  }
};

/**
 * Generate post ideas
 * @param {string} category - Category or niche
 * @param {number} count - Number of ideas to generate
 * @returns {Promise<Array>} - Array of post ideas
 */
const generatePostIdeas = async (category, count = 10) => {
  const prompt = `Generate ${count} creative post ideas for a creator in the ${category} niche. Return only the ideas, one per line, without numbering.`;
  const response = await generateAI(prompt, 'idea_generation');
  return response.split('\n').filter((line) => line.trim().length > 0);
};

/**
 * Summarize text
 * @param {string} text - Text to summarize
 * @returns {Promise<string>} - Summarized text
 */
const summarizeText = async (text) => {
  const prompt = `Summarize the following text in 2-3 sentences:\n\n${text}`;
  return await generateAI(prompt, 'summarize');
};

/**
 * Generate post title
 * @param {string} content - Post content
 * @returns {Promise<string>} - Generated title
 */
const generateTitle = async (content) => {
  const prompt = `Generate a catchy, engaging title (max 60 characters) for the following content:\n\n${content}`;
  return await generateAI(prompt, 'title_generation');
};

/**
 * Rewrite text in specific tone
 * @param {string} text - Text to rewrite
 * @param {string} tone - Desired tone (professional, casual, friendly, etc.)
 * @returns {Promise<string>} - Rewritten text
 */
const rewriteText = async (text, tone) => {
  const prompt = `Rewrite the following text in a ${tone} tone:\n\n${text}`;
  return await generateAI(prompt, 'rewrite');
};

/**
 * Generate category tags
 * @param {string} content - Content to analyze
 * @returns {Promise<Array>} - Array of category tags
 */
const generateTags = async (content) => {
  const prompt = `Generate 5 relevant category tags for the following content. Return only the tags, separated by commas:\n\n${content}`;
  const response = await generateAI(prompt, 'tag_generation');
  return response.split(',').map((tag) => tag.trim());
};

/**
 * AI-powered search/recommendations
 * @param {string} query - Search query
 * @param {Array} userPreferences - User's browsing preferences
 * @returns {Promise<string>} - Search recommendations
 */
const aiSearch = async (query, userPreferences = []) => {
  const preferences = userPreferences.length > 0 
    ? `User preferences: ${userPreferences.join(', ')}. `
    : '';
  const prompt = `${preferences}Based on the search query "${query}", suggest relevant creators or content categories.`;
  return await generateAI(prompt, 'search');
};

export {
  generateAI,
  generatePostIdeas,
  summarizeText,
  generateTitle,
  rewriteText,
  generateTags,
  aiSearch,
};


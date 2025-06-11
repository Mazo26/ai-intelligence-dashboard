const mockReportContent = `
<h1>A Brief Timeline of AI Evolution (Mock Report)</h1>

<h2>1950s – The Dawn of AI</h2>
<p>Alan Turing introduces the concept of machines simulating human intelligence (Turing Test).</p>
<p>Early programs like Logic Theorist prove basic theorems, sparking interest in symbolic reasoning.</p>

<h2>1960s–1970s – Symbolic AI and Expert Systems</h2>
<p>Researchers develop rule-based systems (e.g., ELIZA, SHRDLU).</p>
<p>AI research receives government funding but soon hits limitations, leading to the first AI Winter.</p>

<h2>1980s – Knowledge-Based Systems Boom</h2>
<p>Expert systems like MYCIN show potential in domains like medicine.</p>
<p>The limitations in scalability and maintenance lead to another decline in hype.</p>

<h2>1990s – Machine Learning Rises</h2>
<p>AI shifts focus from hard-coded logic to learning from data.</p>
<p>IBM's Deep Blue defeats chess champion Garry Kasparov in 1997, showing the potential of brute-force + domain knowledge.</p>

<h2>2000s – Big Data and Statistical Learning</h2>
<p>Improvements in computational power and access to data lead to better machine learning models.</p>
<p>AI becomes practical in search engines, spam filters, and recommendation systems.</p>

<h2>2010s – The Deep Learning Revolution</h2>
<p>Introduction of deep neural networks and architectures like CNNs and RNNs.</p>
<p>Milestones include ImageNet breakthroughs, AlphaGo beating Go champion, and the rise of voice assistants like Siri and Alexa.</p>

<h2>2020s – Generative AI and Foundation Models</h2>
<p>Models like GPT-3, DALL·E, and ChatGPT emerge, capable of generating human-like text and images.</p>
<p>AI sees rapid adoption in creative industries, coding, education, and customer support.</p>
<p><strong>Ethical and safety concerns become a major focus.</strong></p>

<blockquote>
<p><em>This mock report was generated due to failure in accessing the OpenAI API. Please treat it as illustrative and not backed by real-time API data.</em></p>
</blockquote>
`;

const mockSummaryContent = `
<h3>Key Points Summary:</h3>
<ul>
<li><strong>AI Evolution Spans 70+ Years:</strong> From Turing's theoretical foundations in the 1950s to today's generative AI models</li>
<li><strong>Multiple AI Winters:</strong> The field experienced significant setbacks in the 1970s and 1980s due to overhype and technical limitations</li>
<li><strong>Deep Learning Revolution:</strong> The 2010s marked a breakthrough with neural networks achieving human-level performance in many tasks</li>
<li><strong>Current Era Focus:</strong> Generative AI and foundation models are transforming creative industries while raising important ethical questions</li>
<li><strong>Practical Applications:</strong> AI has evolved from academic curiosity to essential technology in search, recommendations, and automation</li>
</ul>
<p><em>Note: This is a mock summary generated for demonstration purposes.</em></p>
`;

export const openaiService = {
  async generateReport(prompt: string): Promise<string> {
    console.log(prompt, "prompt");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      return mockReportContent;
    } catch (error) {
      console.error("Error generating report:", error);
      throw new Error("Failed to generate report. Please try again.");
    }
  },

  async summarizeContent(content: string): Promise<string> {
    console.log(content, "content");
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      return mockSummaryContent;
    } catch (error) {
      console.error("Error summarizing content:", error);
      throw new Error("Failed to summarize content. Please try again.");
    }
  },
};

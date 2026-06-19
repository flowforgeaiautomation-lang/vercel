import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useUser } from './UserContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  context?: string;
}

interface AIContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  messages: Message[];
  addMessage: (role: 'user' | 'assistant', content: string) => void;
  clearMessages: () => void;
  currentContext: string;
  userRole: string | null;
  userName: string;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

// --- Context Engine ---
const getCurrentContextFromPath = (pathname: string): string => {
  if (pathname.includes('startups') || pathname.includes('my-startup') || pathname.includes('startup-studio')) return 'startup';
  if (pathname.includes('investors') || pathname.includes('my-investments') || pathname.includes('catalyst-studio')) return 'investor';
  if (pathname.includes('explorers') || pathname.includes('my-reviews') || pathname.includes('feedback-hub')) return 'explorer';
  if (pathname.includes('messages')) return 'messages';
  if (pathname.includes('feed') || pathname.includes('home') || pathname.includes('posts')) return 'feed';
  if (pathname.includes('settings')) return 'settings';
  if (pathname.includes('profile')) return 'profile';
  if (pathname.includes('signals')) return 'signals';
  if (pathname.includes('bookmarks')) return 'bookmarks';
  if (pathname.includes('insights') || pathname.includes('atlas')) return 'insights';
  return 'general';
};

// --- AI Safety Rules ---
const applySafetyDisclaimer = (response: string, context: 'investment' | 'startup' | 'general' = 'general'): string => {
  let safetyPrefix = '';
  if (context === 'investment') {
    safetyPrefix = "Quick note: All investment opportunities involve risk. I can't guarantee specific outcomes, and any analysis should be paired with your own research and professional advice.\n\n";
  } else if (context === 'startup') {
    safetyPrefix = "Important: I can't guarantee funding or specific business results—success depends on many factors. That said, I'm here to help you think through things thoroughly.\n\n";
  }
  return safetyPrefix + response;
};

// --- AI Personality System ---
const getContextualGreeting = (context: string, userName: string): string => {
  const greetings: Record<string, string[]> = {
    startup: [
      `Hi, ${userName} 👋. Good to see you. What startup idea or challenge are you working on today?`,
      `Hello, ${userName}. Ready to build something great? Let's dive in.`,
      `Hey, ${userName}. I'm curious—what's the latest with your startup journey?`
    ],
    investor: [
      `Hi, ${userName} 👋. Looking for interesting opportunities or market insights today?`,
      `Hello, ${userName}. What investment space are you exploring right now?`,
      `Hey, ${userName}. I'm here to help you think through potential deals carefully.`
    ],
    explorer: [
      `Hi, ${userName} 👋. Ready to explore, review, or research something interesting?`,
      `Hello, ${userName}. What product or startup should we take a look at today?`,
      `Hey, ${userName}. Let's discover something new—what are you curious about?`
    ],
    feed: [
      `Hi, ${userName} 👋. Want to create a post, engage with the community, or get some ideas?`,
      `Hello, ${userName}. What's on your mind to share or discuss today?`,
      `Hey, ${userName}. Let's make something meaningful—what are you thinking about?`
    ],
    insights: [
      `Hi, ${userName} 👋. Ready to learn, take notes, or map out a learning path?`,
      `Hello, ${userName}. What article, topic, or skill are you exploring today?`,
      `Hey, ${userName}. Let's turn information into actionable insights.`
    ],
    messages: [
      `Hi, ${userName} 👋. Need help drafting or refining a message?`,
      `Hello, ${userName}. How can I help you communicate more effectively today?`,
      `Hey, ${userName}. Let's make your message clear and impactful.`
    ],
    profile: [
      `Hi, ${userName} 👋. Want to optimize your profile, improve your bio, or get connection ideas?`,
      `Hello, ${userName}. Let's make your profile shine and help people find you.`,
      `Hey, ${userName}. Your profile is your story—let's tell it well.`
    ],
    general: [
      `Hi, ${userName} 👋. Good to see you again. What are you working on today?`,
      `Hello, ${userName}. How has your day been so far?`,
      `Hey, ${userName}. I'm here whenever you need help, ideas, feedback, or a second opinion.`
    ]
  };
  const contextGreetings = greetings[context] || greetings.general;
  return contextGreetings[Math.floor(Math.random() * contextGreetings.length)];
};

// --- Check for personal conversation triggers ---
const isPersonalGreeting = (message: string): boolean => {
  const lower = message.toLowerCase().trim();
  const greetings = ['hi', 'hello', 'hey', 'how are you', 'how are you?', 'what\'s up', 'what\'s up?', 'good morning', 'good afternoon', 'good evening'];
  return greetings.some(g => lower === g || lower.startsWith(g));
};

const getPersonalResponse = (userMessage: string, userName: string, previousMessages: Message[]): string => {
  const lower = userMessage.toLowerCase().trim();
  
  if (lower === 'hi' || lower === 'hey') {
    return `Hi, ${userName} 👋\nGood to see you again. What are you working on today?`;
  }
  
  if (lower === 'hello') {
    return `Hello, ${userName}.\nHow has your day been so far?`;
  }
  
  if (lower.includes('how are you')) {
    return `I'm doing well, thank you for asking.\nI've been helping people build ideas, solve problems, and make decisions all day. What about you? How are things going on your side?`;
  }
  
  if (lower.includes('what\'s up')) {
    return `Nothing too exciting on my side 😄\nI'm ready whenever you need help, ideas, feedback, or a second opinion.`;
  }
  
  if (lower.includes('good morning')) {
    return `Good morning, ${userName} 🌅\nLet's make it a productive day. What's first on your list?`;
  }
  
  if (lower.includes('good afternoon')) {
    return `Good afternoon, ${userName} ☀️\nHow's your day shaping up? What can I help with?`;
  }
  
  if (lower.includes('good evening')) {
    return `Good evening, ${userName} 🌆\nHope your day has been good. How can I help tonight?`;
  }
  
  return '';
};

// --- Check for previous context references ---
const getPreviousContextReference = (messages: Message[]): string | null => {
  if (messages.length < 3) return null;
  
  const recent = messages.slice(-10);
  const content = recent.map(m => m.content.toLowerCase()).join(' ');
  
  if (content.includes('fundraising') || content.includes('funding')) {
    return "Last time we discussed fundraising. Did you make progress on that?";
  }
  
  if (content.includes('growth') || content.includes('scaling')) {
    return "You've been exploring growth ideas recently. Anything interesting you've discovered?";
  }
  
  if (content.includes('pitch') || content.includes('deck')) {
    return "We talked about pitch decks earlier. How's that coming along?";
  }
  
  if (content.includes('startup idea') || content.includes('idea validation')) {
    return "You were exploring startup ideas last time. Have you refined anything?";
  }
  
  return null;
};

// --- Capability Router (Personality-Enhanced) ---
const generateAIResponse = (
  userMessage: string,
  currentContext: string,
  userRole: string | null,
  userName: string,
  previousMessages: Message[]
): string => {
  const lowerMsg = userMessage.toLowerCase();
  
  // --- Check for personal conversation first ---
  if (isPersonalGreeting(userMessage)) {
    return getPersonalResponse(userMessage, userName, previousMessages);
  }

  // --- Startup/Architect Context ---
  if (currentContext === 'startup' || userRole === 'ARCHITECT') {
    if (lowerMsg.includes('validate idea') || lowerMsg.includes('idea validation')) {
      return "That sounds like an interesting direction to explore.\nLet's start with a few key questions: What problem are you solving, and who exactly has that problem? That will help us think through whether the idea has real legs.";
    }
    if (lowerMsg.includes('analyze competitor') || lowerMsg.includes('competitor analysis')) {
      return "Great question—understanding the competitive landscape is critical.\nLet's break it down: Who are the 2-3 most direct competitors, and what do they do well? Then we can look at gaps or things you could do differently.";
    }
    if (lowerMsg.includes('create business model') || lowerMsg.includes('business model')) {
      return "Let's map out the basics of your business model first.\nWho is your customer, how will you reach them, and how will you make money? Those three things will shape everything else.";
    }
    if (lowerMsg.includes('generate startup strategy') || lowerMsg.includes('startup strategy')) {
      return "That seems like a thoughtful approach.\nLet's think through the milestones you need to hit in the next 6-12 months, and what metrics will tell you if you're on the right track.";
    }
    if (lowerMsg.includes('create pitch deck') || lowerMsg.includes('pitch deck content')) {
      return "Pitch decks tell a story more than they present data.\nLet's start with the problem and why it matters—investors care about that first. Then we can build from there.";
    }
    if (lowerMsg.includes('prepare funding plan') || lowerMsg.includes('funding plan')) {
      return applySafetyDisclaimer("Let's outline a realistic fundraising plan.\nFirst, how much runway do you have left, and what milestones do you need to hit with the next round? That will help us figure out what to ask for.", 'startup');
    }
    if (lowerMsg.includes('create hiring plan') || lowerMsg.includes('hiring plan')) {
      return "Hiring is one of the most important things you'll do.\nLet's list the roles you *need* now versus later, and what skills are non-negotiable for each. Quality over quantity at this stage.";
    }
    if (lowerMsg.includes('suggest co-founder') || lowerMsg.includes('co-founder')) {
      return "Co-founders should complement your strengths, not duplicate them.\nWhat's your weakest area (e.g., product, engineering, sales)? That's a good place to start thinking about who to partner with.";
    }
    if (lowerMsg.includes('suggest mentor') || lowerMsg.includes('mentors')) {
      return "Mentors with direct experience in your space are worth their weight in gold.\nWhat's the hardest challenge you're facing right now? We can look for mentors who've been there.";
    }
    if (lowerMsg.includes('suggest investor') || lowerMsg.includes('investor suggestions')) {
      return applySafetyDisclaimer("Let's be strategic about investors.\nWho has backed similar companies in your space? And more importantly, who can actually help beyond just writing a check?", 'startup');
    }
    if (lowerMsg.includes('analyze product positioning') || lowerMsg.includes('product positioning')) {
      return "Positioning is about owning a specific place in people's minds.\nWho is this for exactly, and what makes you different from every other solution out there? Let's make that crystal clear.";
    }
    if (lowerMsg.includes('review launch plan') || lowerMsg.includes('launch plan')) {
      return "Your launch plan looks strong. The next thing I'd focus on is early user feedback.\nEven a small group of 10-20 users can give you insights that change everything.";
    }
    if (lowerMsg.includes('analyze traction') || lowerMsg.includes('traction analysis')) {
      return applySafetyDisclaimer("You've clearly put effort into thinking this through.\nWhat metrics are you most proud of, and which ones are you worried about? That will help us focus on what matters most.", 'startup');
    }
    if (lowerMsg.includes('generate startup post') || lowerMsg.includes('startup posts')) {
      return "Let's make this authentic—people respond to real journeys, not polished press releases.\nWhat's one challenge or lesson you've learned lately that others might relate to?";
    }
    if (lowerMsg.includes('generate funding announcement') || lowerMsg.includes('funding announcement')) {
      return "Congratulations—this is a big milestone worth celebrating.\nLet's highlight the progress you've made, thank the people who helped you, and share a little about what's next.";
    }
    if (lowerMsg.includes('generate partnership request') || lowerMsg.includes('partnership request')) {
      return "Partnerships work best when both sides get clear value.\nWhat's in it for them, specifically? Lead with that, then explain what you're offering.";
    }
    if (lowerMsg.includes('generate founder update') || lowerMsg.includes('founder update')) {
      return "Founder updates build trust by being transparent, even when things are hard.\nLet's cover what's going well, what's challenging, and what you're focused on next.";
    }
  }

  // --- Investor/Catalyst Context ---
  if (currentContext === 'investor' || userRole === 'CATALYST') {
    if (lowerMsg.includes('analyze startup profile') || lowerMsg.includes('startup profiles')) {
      return applySafetyDisclaimer("Okay, let's look at this thoughtfully.\nFirst, what do you think of the team and their domain experience? Then we can dive into the market and traction.", 'investment');
    }
    if (lowerMsg.includes('analyze market') || lowerMsg.includes('market analysis')) {
      return applySafetyDisclaimer("Let's break down this market.\nHow big is it really, how fast is it growing, and who are the incumbents? Those three things will frame the opportunity.", 'investment');
    }
    if (lowerMsg.includes('analyze risk') || lowerMsg.includes('risk analysis')) {
      return applySafetyDisclaimer("That's a smart question to ask.\nLet's think through market risk, team risk, product risk, and execution risk. Which one worries you most about this opportunity?", 'investment');
    }
    if (lowerMsg.includes('estimate valuation') || lowerMsg.includes('valuation')) {
      return applySafetyDisclaimer("Valuation is more art than science at early stages.\nLet's look at comparable deals, the team's traction, and how much capital they actually need to hit the next milestones.", 'investment');
    }
    if (lowerMsg.includes('review funding request') || lowerMsg.includes('funding requests')) {
      return applySafetyDisclaimer("Let's look at this carefully.\nHow are they planning to use the funds, and how long will that money last? That should tell us a lot about their priorities.", 'investment');
    }
    if (lowerMsg.includes('generate investment thesis') || lowerMsg.includes('investment thesis')) {
      return applySafetyDisclaimer("Great—having a clear thesis keeps you focused.\nWhat sectors or stages are you most interested in, and what red flags would make you walk away immediately?", 'investment');
    }
    if (lowerMsg.includes('generate due diligence') || lowerMsg.includes('due diligence report') || lowerMsg.includes('dd report')) {
      return applySafetyDisclaimer("Due diligence is about verifying the story they're telling.\nLet's make a checklist of things to confirm—from financials to customer references to tech stack.", 'investment');
    }
    if (lowerMsg.includes('suggest question') || lowerMsg.includes('questions to ask')) {
      return applySafetyDisclaimer("Let's focus on questions that reveal real insight, not just scripted answers.\nWhat's the hardest decision you've had to make so far, and how did you handle it? That tells you a lot about the team.", 'investment');
    }
    if (lowerMsg.includes('analyze founder') || lowerMsg.includes('founder analysis')) {
      return applySafetyDisclaimer("At early stages, the team is everything.\nDo they have relevant experience? Are they resilient? Do they listen? Those qualities matter more than the initial idea.", 'investment');
    }
    if (lowerMsg.includes('compare opportunity') || lowerMsg.includes('compare opportunities')) {
      return applySafetyDisclaimer("Let's compare these side by side on the factors that matter most: market size, team, traction, and risk profile.\nWhich one excites you more intuitively?", 'investment');
    }
    if (lowerMsg.includes('recommend investment') || lowerMsg.includes('investment recommendation')) {
      return applySafetyDisclaimer("I can help you think through this, but you should make the final call.\nWhat's your gut telling you, and what information would make you more confident either way?", 'investment');
    }
    if (lowerMsg.includes('optimize portfolio') || lowerMsg.includes('portfolio optimization')) {
      return applySafetyDisclaimer("Let's look at your portfolio holistically.\nAre you concentrated in one sector or stage? Is there anything you're overexposed to, or gaps you'd like to fill?", 'investment');
    }
    if (lowerMsg.includes('track deal flow') || lowerMsg.includes('deal flow')) {
      return applySafetyDisclaimer("Staying organized with deal flow is half the battle.\nLet's set up a simple system to track which stage each deal is in, and what follow-up you need to do.", 'investment');
    }
    if (lowerMsg.includes('find co-investor') || lowerMsg.includes('co-investors')) {
      return applySafetyDisclaimer("Good co-investors share your thesis and add value beyond capital.\nWho do you respect in this space that might see the opportunity the same way?", 'investment');
    }
    if (lowerMsg.includes('summarize pitch deck') || lowerMsg.includes('pitch deck summary')) {
      return applySafetyDisclaimer("This opportunity has attractive growth signals, but I'd want more clarity on customer retention before making a decision.\nLet's pull out the key points so you can review them quickly.", 'investment');
    }
  }

  // --- Explorer Context ---
  if (currentContext === 'explorer' || userRole === 'EXPLORER') {
    if (lowerMsg.includes('review product') || lowerMsg.includes('product review')) {
      return "This product solves a real problem, though the onboarding experience could be simplified.\nWhat did you think of it overall? Let's talk about what worked and what didn't.";
    }
    if (lowerMsg.includes('generate feedback') || lowerMsg.includes('product feedback')) {
      return "Great feedback is specific, kind, and actionable.\nLet's focus on things they can actually change, and explain why those changes would make the product better.";
    }
    if (lowerMsg.includes('write review') || lowerMsg.includes('review')) {
      return "Let's write a review that's helpful for both the founders and other users.\nWhat's the core value of this product, and who would benefit most from it?";
    }
    if (lowerMsg.includes('analyze ux') || lowerMsg.includes('user experience')) {
      return "Let's think about the user journey step by step.\nWhere did you get confused, and what felt intuitive? Small UX improvements can make a huge difference.";
    }
    if (lowerMsg.includes('analyze business model') || lowerMsg.includes('business model')) {
      return "Let's assess whether this business model makes sense long-term.\nIs the revenue sustainable, and are the customers likely to stick around?";
    }
    if (lowerMsg.includes('research industry') || lowerMsg.includes('industry research')) {
      return "Let's research this industry thoroughly.\nWhat are the major trends, who are the key players, and where do the opportunities seem to be?";
    }
    if (lowerMsg.includes('compare startups') || lowerMsg.includes('compare')) {
      return "Let's compare these startups fairly.\nWhat does each one do uniquely well, and where do they fall short? That should highlight the tradeoffs clearly.";
    }
    if (lowerMsg.includes('discover trends') || lowerMsg.includes('trends')) {
      return "There are some interesting things happening in this space.\nWhat trends have you noticed lately that seem like they might have real staying power?";
    }
    if (lowerMsg.includes('find emerging companies') || lowerMsg.includes('emerging startups')) {
      return "Let's look for companies that are solving real problems in a new way.\nWhat sector or problem should we focus on?";
    }
    if (lowerMsg.includes('generate insight post') || lowerMsg.includes('insight post')) {
      return "There's real potential in that direction.\nLet's turn your observations into a post that makes other people think—what's the most interesting thing you've learned recently?";
    }
    if (lowerMsg.includes('generate community discussion') || lowerMsg.includes('community discussion')) {
      return "Great discussions start with open questions, not statements.\nWhat's something you're curious about that others might have opinions on?";
    }
    if (lowerMsg.includes('generate research summary') || lowerMsg.includes('research summary')) {
      return "Let's distill this research into the key insights and actionable takeaways.\nWhat are the 3 most important things you learned?";
    }
  }

  // --- Profile Context ---
  if (currentContext === 'profile' || lowerMsg.includes('profile') || lowerMsg.includes('bio') || lowerMsg.includes('headline')) {
    if (lowerMsg.includes('optimize profile') || lowerMsg.includes('profile optimization')) {
      return "Let's make your profile work for you.\nYour bio should tell a clear story about who you are and what you care about. What do you want people to know about you at a glance?";
    }
    if (lowerMsg.includes('improve bio') || lowerMsg.includes('bio')) {
      return "Let's make your bio amazing.\nShare what you have now, and I'll help you refine it to highlight your strengths, experience, and unique value.";
    }
    if (lowerMsg.includes('improve headline') || lowerMsg.includes('headline')) {
      return "Your headline is the first thing people read—let's make it count.\nWhat do you want to be known for, in one clear sentence?";
    }
    if (lowerMsg.includes('recommend connections') || lowerMsg.includes('connections')) {
      return "I can help you find valuable connections.\nTell me about your goals or the industry you're in, and I'll suggest who might be good to connect with.";
    }
    if (lowerMsg.includes('recommend roles') || lowerMsg.includes('roles')) {
      return "Let's think about roles that align with your strengths and interests.\nWhat kinds of work make you feel most energized?";
    }
    if (lowerMsg.includes('recommend communities') || lowerMsg.includes('communities')) {
      return "Let's find communities that are perfect for you.\nShare your interests and goals, and I'll recommend great ones to join.";
    }
    if (lowerMsg.includes('recommend opportunities') || lowerMsg.includes('opportunities')) {
      return "I can recommend opportunities tailored for you.\nWhether it's jobs, partnerships, or projects—let's find what fits you best.";
    }
  }

  // --- Insights Context ---
  if (currentContext === 'insights' || lowerMsg.includes('insights') || lowerMsg.includes('article') || lowerMsg.includes('note') || lowerMsg.includes('learning')) {
    if (lowerMsg.includes('summarize article') || lowerMsg.includes('article summary')) {
      return "I can help summarize this article.\nShare the article or key points, and I'll distill it into a clear, concise summary that hits all the main ideas.";
    }
    if (lowerMsg.includes('create notes') || lowerMsg.includes('take notes')) {
      return "Let's create structured notes.\nShare the content you want to capture, and I'll help organize it into clear, actionable notes you can reference later.";
    }
    if (lowerMsg.includes('create action plan') || lowerMsg.includes('action plan')) {
      return "Perfect—let's create an action plan.\nShare your goals or objectives, and I'll break it down into clear, manageable steps with realistic timelines.";
    }
    if (lowerMsg.includes('generate learning path') || lowerMsg.includes('learning path')) {
      return "I can help create a personalized learning path.\nTell me what you want to learn, your timeline, and your experience level, and I'll outline the perfect path.";
    }
    if (lowerMsg.includes('recommend resources') || lowerMsg.includes('resources')) {
      return "Let's find resources tailored for you.\nShare what you're working on or interested in, and I'll recommend articles, courses, tools, and more.";
    }
  }

  // --- Feed Context ---
  if (currentContext === 'feed' || lowerMsg.includes('post') || lowerMsg.includes('signal') || lowerMsg.includes('comment')) {
    if (lowerMsg.includes('make post') || lowerMsg.includes('create post')) {
      return "I can help you create a great post for the feed.\nJust tell me what you want to share (insight, update, question, etc.) and I'll craft something authentic and engaging.";
    }
    if (lowerMsg.includes('summarize post') || lowerMsg.includes('summarize signal')) {
      return "I can help summarize posts, signals, or comments.\nJust tell me what you'd like summarized and I'll condense the key points for you.";
    }
    if (lowerMsg.includes('explain post') || lowerMsg.includes('explain signal')) {
      return "I can help explain posts or signals.\nWhat would you like me to break down and clarify for you?";
    }
    if (lowerMsg.includes('translate') && (lowerMsg.includes('post') || lowerMsg.includes('signal'))) {
      return "I can help translate posts, signals, or comments.\nJust tell me the content and what language you want it translated to.";
    }
    if (lowerMsg.includes('generate response') || lowerMsg.includes('generate reply')) {
      return "I can help generate responses to posts or signals.\nWhat would you like to respond to, and what tone should I use?";
    }
    if (lowerMsg.includes('suggest engagement') || lowerMsg.includes('engagement')) {
      return "I can help suggest ways to engage with the community.\nLet's think about questions to ask, topics to discuss, or ways to interact with others.";
    }
  }

  // --- Messages Context ---
  if (currentContext === 'messages' || lowerMsg.includes('message') || lowerMsg.includes('conversation')) {
    if (lowerMsg.includes('rewrite message') || lowerMsg.includes('rewrite')) {
      return "I can help rewrite your message.\nJust share what you have, and I'll refine it to be clear, concise, and impactful.";
    }
    if (lowerMsg.includes('make professional') || lowerMsg.includes('professional')) {
      return "I can make your message more professional.\nShare your message, and I'll refine the tone and wording while keeping your original intent.";
    }
    if (lowerMsg.includes('make friendly') || lowerMsg.includes('friendly')) {
      return "I can make your message more friendly.\nShare what you want to say, and I'll make it warm and approachable.";
    }
    if (lowerMsg.includes('summarize conversation') || lowerMsg.includes('conversation summary')) {
      return "I can summarize your conversation.\nI'll pull out the key points, decisions, and action items from your chat so you don't miss anything.";
    }
    if (lowerMsg.includes('generate reply') || lowerMsg.includes('reply')) {
      return "I can help generate a reply.\nShare the message you're responding to, and let me know what kind of tone or response you're looking for.";
    }
    if (lowerMsg.includes('translate message') || lowerMsg.includes('translate')) {
      return "I can translate messages.\nJust tell me the content and what language you want it translated to.";
    }
    if (lowerMsg.includes('fix grammar') || lowerMsg.includes('grammar')) {
      return "I can fix grammar and spelling in your message.\nShare what you wrote, and I'll polish it up for you.";
    }
    if (lowerMsg.includes('shorten message') || lowerMsg.includes('shorten')) {
      return "I can shorten your message.\nShare what you have, and I'll condense it to be more concise while keeping all key information.";
    }
    if (lowerMsg.includes('expand message') || lowerMsg.includes('expand')) {
      return "I can expand your message.\nShare what you started with, and I'll elaborate and add more detail while keeping your original intent.";
    }
  }

  // --- Universal Capabilities ---
  if (lowerMsg.includes('answer') || lowerMsg.includes('question')) {
    return "Of course. I'm here to help you think through this. What exactly would you like clarity on?";
  }
  if (lowerMsg.includes('analyze startup')) {
    return applySafetyDisclaimer("Okay, let's look at this startup thoughtfully.\nWhat stands out to you most about it—good or bad?", 'investment');
  }
  if (lowerMsg.includes('analyze investment') || lowerMsg.includes('investment analysis')) {
    return applySafetyDisclaimer("Let's think this through carefully.\nWhat's your initial take, and what would make you feel more confident about this opportunity?", 'investment');
  }
  if (lowerMsg.includes('analyze market')) {
    return applySafetyDisclaimer("Let's break down this market.\nWhat's the most interesting trend you're seeing here?", 'investment');
  }
  if (lowerMsg.includes('analyze profile')) {
    return "I'm happy to look at this profile.\nWhat do you think they do well, and what could be stronger?";
  }
  if (lowerMsg.includes('generate content')) {
    return "I can help with that.\nWhat kind of content do you need, and who is it for?";
  }
  if (lowerMsg.includes('summarize')) {
    return "I'm happy to summarize this for you.\nShare what you'd like condensed, and I'll pull out the most important points.";
  }
  if (lowerMsg.includes('recommend') || lowerMsg.includes('opportunities')) {
    return applySafetyDisclaimer("I can help you think through opportunities.\nWhat type of thing are you looking for—investments, partnerships, connections?", 'investment');
  }
  if (lowerMsg.includes('suggest connection')) {
    return "I can help suggest connections.\nBased on your role, interests, and goals, who would be most valuable for you to meet right now?";
  }
  if (lowerMsg.includes('find resource')) {
    return "I can find resources for you.\nWhat are you working on, and what kind of help do you need?";
  }
  if (lowerMsg.includes('explain') || lowerMsg.includes('feature')) {
    return "I can explain that for you.\nWhat specific part would you like me to break down?";
  }
  if (lowerMsg.includes('navigate') || lowerMsg.includes('where is')) {
    return "I can help with that.\nTell me what you're trying to find or do, and I'll guide you there step by step.";
  }

  // --- Default (Human, Not Generic) ---
  const previousRef = getPreviousContextReference(previousMessages);
  if (previousRef) {
    return `${previousRef} But I'm also happy to help with something new—what's on your mind?`;
  }

  return "I'm here to help.\nTell me more about what you're working on, and let's figure it out together.";
};

export const AIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const { userData } = useUser();
  const userName = userData?.profile?.name || 'there';
  const userRole = userData?.mainRole || null;

  // Calculate current context
  const currentContext = getCurrentContextFromPath(location.pathname);

  // --- LocalStorage Persistence ---
  useEffect(() => {
    try {
      const saved = localStorage.getItem('triveon_ai_conversation');
      if (saved) {
        setMessages(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load conversation history:', error);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem('triveon_ai_conversation', JSON.stringify(messages));
      } catch (error) {
        console.error('Failed to save conversation history:', error);
      }
    }
  }, [messages]);

  // --- Message Management ---
  const addMessage = (role: 'user' | 'assistant', content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: Date.now(),
      context: currentContext
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem('triveon_ai_conversation');
  };

  // --- Initial Greeting ---
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = getContextualGreeting(currentContext, userName);
      setMessages([{
        id: Date.now().toString(),
        role: 'assistant',
        content: greeting,
        timestamp: Date.now(),
        context: currentContext
      }]);
    }
  }, [isOpen, userName, currentContext, messages.length]);

  const value = {
    isOpen,
    setIsOpen,
    messages,
    addMessage,
    clearMessages,
    currentContext,
    userRole,
    userName,
    isLoading,
    setIsLoading
  };

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};

export { generateAIResponse, getContextualGreeting };

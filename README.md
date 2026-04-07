# MEETRIX— AI Meeting Intelligence Hub

## The Problem

Organizations conduct many internal and client meetings every week, producing long transcript files that are difficult to review manually. Important decisions, action items, concerns, and follow-ups often get buried inside pages of dialogue, leading to confusion, repeated discussions, and wasted time.

## The Solution

Meetrix is an AI-powered Meeting Intelligence Hub that transforms raw meeting transcripts into structured, actionable insights. It allows users to upload transcripts, extract summaries, decisions, action items, and sentiment, and ask natural language questions across one or multiple meetings.

## Key Features

- Multi-transcript upload interface
- Support for transcript file ingestion
- AI-generated meeting summaries
- Decision extraction
- Action item extraction with owner and deadline
- Structured table view for decisions and action items
- Cross-meeting AI chatbot
- Meeting-specific AI chatbot
- Sentiment tagging and analytics
- Project-wise meeting grouping
- Search across meetings
- CSV and PDF export
- Hosted web deployment

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend / Workflow Automation
- n8n
- Webhooks

### AI / LLM
- Groq API

### Database / Storage
- Supabase

### Deployment
- Vercel
https://meetrix-nine.vercel.app/

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/arjunbabu942/Meetrix.git
cd Meetrix
 
### 2. install dependencies 
npm install
 
### 3. run project loacally
 npm run dev

###  4.open in browser
  https://localhost:3000

### HOW IT WORKS


1. Users upload one or more meeting transcript files.
2. The system processes and stores each meeting.
3. Meetrix extracts:
   - Summary
   - Decisions
   - Action Items
   - Sentiment
4. Users can open each meeting to inspect structured outputs.
5. Users can ask AI questions within a meeting or across all meetings.

## Example Questions

- Why was the API launch delayed?
- What blockers were discussed across meetings?
- Who is responsible for the homepage redesign?
- What decisions were made in the finance review meeting?

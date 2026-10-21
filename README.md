# LAKSHYA – AI-Powered Athlete Talent Assessment Platform

LAKSHYA is a web-based sports assessment platform designed to make athlete performance evaluation more transparent, accessible, and data-driven.

The platform allows athletes to create an account, log in, upload performance-assessment videos, and receive AI-generated performance metrics along with anomaly-detection results.

## Live Demo

🔗 **[Visit LAKSHYA](https://avinashbaliyan.github.io/5th-sem-Mini-project/)**

## Project Team
| Name | Roll Number | Course and Year |
|---|---:|---|
| Avinash Kumar Baliyan | 2400680100137 | 3rd Year, Computer Science and Engineering |
| Ayush Sharma | 2400680100144 | 3rd Year, Computer Science and Engineering |

## Features

- Athlete registration and login
- Google authentication support
- Athlete dashboard
- Video-based fitness assessment
- AI-powered performance analysis
- Automatic detection of possible video anomalies or manipulation
- Extraction of performance metrics, including:
  - Jump height
  - Sit-up count
  - Run time
  - Squat count
  - Lunge count
  - Push-up count
- Anomaly confidence score
- Workout streak tracking
- Responsive and modern user interface
- Form validation using Zod and React Hook Form
- Toast notifications for success and error states

## How It Works

1. Create an athlete account or log in using an Athlete ID and password.
2. Open the athlete dashboard.
3. Select the fitness assessment being performed.
4. Upload a video of the assessment.
5. LAKSHYA analyzes the video using generative AI.
6. View the extracted performance metrics and anomaly-detection results.
7. Submit the performance data for assessment tracking.

## Technology Stack

### Frontend

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide React](https://lucide.dev/)

### Authentication and Backend Services

- [Firebase Authentication](https://firebase.google.com/products/auth)
- Firebase Google Sign-In
- Next.js Server Actions

### AI and Validation

- [Genkit](https://firebase.google.com/docs/genkit)
- Google AI
- [Zod](https://zod.dev/)
- React Hook Form

### Data Visualization and Utilities

- Recharts
- date-fns
- Embla Carousel
- Tailwind Merge

## Project Structure

```text
5th-sem-Mini-project/
├── src/
│   ├── ai/
│   │   ├── flows/
│   │   │   └── analyze-video-performance-metrics.ts
│   │   └── genkit.ts
│   ├── app/
│   │   ├── dashboard/
│   │   ├── signup/
│   │   ├── actions.ts
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── video-assessment.tsx
│   │   ├── workout-streak.tsx
│   │   ├── login-form.tsx
│   │   ├── signup-form.tsx
│   │   └── ui/
│   ├── hooks/
│   └── lib/
├── public/
├── package.json
└── README.md

# 3D Pergola Visualizer

An AI-powered 3D Pergola Visualization tool with premium UI/UX.

## Features

- Interactive 3D visualization of pergolas and gazebos
- Customizable dimensions, materials, and designs
- Quick preview of preset designs
- Export to PDF
- Voice control
- Dark/Light mode
- Responsive design

## Deployment to AWS via GitHub

This project is set up for automatic deployment to AWS S3 and CloudFront using GitHub Actions.

### Prerequisites

1. AWS Account with S3 and CloudFront set up
2. GitHub repository

### AWS Setup

1. Create an S3 bucket for hosting the website
   - Enable static website hosting
   - Configure bucket policy for public access

2. Create a CloudFront distribution
   - Use the S3 bucket as the origin
   - Configure cache behaviors
   - Set up HTTPS

3. Create an IAM user with permissions for S3 and CloudFront
   - Generate access keys

### GitHub Setup

1. Add the following secrets to your GitHub repository:
   - `AWS_ACCESS_KEY_ID`: Your IAM user access key
   - `AWS_SECRET_ACCESS_KEY`: Your IAM user secret key
   - `AWS_REGION`: The AWS region (e.g., `us-east-1`)
   - `AWS_S3_BUCKET`: Your S3 bucket name
   - `AWS_CLOUDFRONT_DISTRIBUTION_ID`: Your CloudFront distribution ID

2. Push your code to the main branch to trigger deployment

### Manual Deployment

If you prefer to deploy manually:

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Deploy to S3
aws s3 sync ./dist s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Technologies Used

- React
- Three.js with React Three Fiber
- Tailwind CSS
- Framer Motion
- Vite

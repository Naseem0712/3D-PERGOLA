/**
 * AWS Configuration Helper
 * 
 * This file contains configuration settings for AWS deployment.
 * It's used by the GitHub Actions workflow to deploy the application.
 */

module.exports = {
  // S3 Configuration
  s3: {
    region: process.env.AWS_REGION || 'us-east-1',
    bucket: process.env.AWS_S3_BUCKET || '3d-pergola-visualizer',
    // Set cache control for different file types
    cacheControl: {
      html: 'public, max-age=0, must-revalidate',
      css: 'public, max-age=31536000, immutable',
      js: 'public, max-age=31536000, immutable',
      images: 'public, max-age=31536000, immutable',
      fonts: 'public, max-age=31536000, immutable'
    }
  },
  
  // CloudFront Configuration
  cloudfront: {
    distributionId: process.env.AWS_CLOUDFRONT_DISTRIBUTION_ID || '',
    // Paths to invalidate on deployment
    invalidationPaths: ['/*']
  }
};

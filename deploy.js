/**
 * AWS Deployment Script
 * 
 * This script handles the deployment of the 3D Pergola Visualizer to AWS S3 and CloudFront.
 * It can be run manually or through the GitHub Actions workflow.
 */

const { execSync } = require('child_process');
const awsConfig = require('./aws-config');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

// Log with color
const log = (message, color = colors.reset) => {
  console.log(`${color}${message}${colors.reset}`);
};

// Execute a command and return the output
const exec = (command) => {
  try {
    return execSync(command, { encoding: 'utf8' });
  } catch (error) {
    log(`Error executing command: ${command}`, colors.red);
    log(error.message, colors.red);
    process.exit(1);
  }
};

// Main deployment function
const deploy = async () => {
  try {
    // Check if AWS CLI is installed
    try {
      exec('aws --version');
      log('AWS CLI is installed', colors.green);
    } catch (error) {
      log('AWS CLI is not installed. Please install it first.', colors.red);
      process.exit(1);
    }

    // Check for required environment variables
    const requiredEnvVars = [
      'AWS_ACCESS_KEY_ID',
      'AWS_SECRET_ACCESS_KEY',
      'AWS_REGION',
      'AWS_S3_BUCKET'
    ];

    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    if (missingEnvVars.length > 0) {
      log(`Missing required environment variables: ${missingEnvVars.join(', ')}`, colors.red);
      log('Please set these environment variables before running this script.', colors.yellow);
      process.exit(1);
    }

    // Build the project
    log('Building the project...', colors.cyan);
    exec('npm run build');
    log('Build completed successfully!', colors.green);

    // Deploy to S3
    const s3Bucket = awsConfig.s3.bucket;
    const s3Region = awsConfig.s3.region;
    
    log(`Deploying to S3 bucket: ${s3Bucket} in region: ${s3Region}...`, colors.cyan);
    
    // Upload different file types with different cache control settings
    const fileTypes = [
      { pattern: '*.html', cacheControl: awsConfig.s3.cacheControl.html },
      { pattern: '*.css', cacheControl: awsConfig.s3.cacheControl.css },
      { pattern: '*.js', cacheControl: awsConfig.s3.cacheControl.js },
      { pattern: '*.png *.jpg *.jpeg *.gif *.svg', cacheControl: awsConfig.s3.cacheControl.images },
      { pattern: '*.woff *.woff2 *.eot *.ttf *.otf', cacheControl: awsConfig.s3.cacheControl.fonts }
    ];

    for (const { pattern, cacheControl } of fileTypes) {
      exec(`aws s3 sync ./dist s3://${s3Bucket} --exclude "*" --include "${pattern}" --cache-control "${cacheControl}" --delete`);
    }

    // Upload remaining files with default cache control
    exec(`aws s3 sync ./dist s3://${s3Bucket} --exclude "*.html" --exclude "*.css" --exclude "*.js" --exclude "*.png" --exclude "*.jpg" --exclude "*.jpeg" --exclude "*.gif" --exclude "*.svg" --exclude "*.woff" --exclude "*.woff2" --exclude "*.eot" --exclude "*.ttf" --exclude "*.otf" --delete`);
    
    log('Deployment to S3 completed successfully!', colors.green);

    // Invalidate CloudFront cache if distribution ID is provided
    if (process.env.AWS_CLOUDFRONT_DISTRIBUTION_ID) {
      const distributionId = process.env.AWS_CLOUDFRONT_DISTRIBUTION_ID;
      const invalidationPaths = awsConfig.cloudfront.invalidationPaths.join(' ');
      
      log(`Invalidating CloudFront cache for distribution: ${distributionId}...`, colors.cyan);
      exec(`aws cloudfront create-invalidation --distribution-id ${distributionId} --paths ${invalidationPaths}`);
      log('CloudFront cache invalidation initiated successfully!', colors.green);
    } else {
      log('CloudFront distribution ID not provided. Skipping cache invalidation.', colors.yellow);
    }

    log('Deployment completed successfully!', colors.bright + colors.green);
    
    // Output the website URL
    log(`\nWebsite URL: http://${s3Bucket}.s3-website-${s3Region}.amazonaws.com`, colors.cyan);
    if (process.env.AWS_CLOUDFRONT_DOMAIN) {
      log(`CloudFront URL: https://${process.env.AWS_CLOUDFRONT_DOMAIN}`, colors.cyan);
    }
    
  } catch (error) {
    log('Deployment failed!', colors.red);
    log(error.message, colors.red);
    process.exit(1);
  }
};

// Run the deployment
deploy();

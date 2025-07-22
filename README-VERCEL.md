# 🚀 Vercel Deployment Guide

This guide will help you deploy the B2B Automotive Parts Procurement MCP Demo to Vercel.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **OpenAI API Key**: You'll need this for the AI functionality

## 🔧 Deployment Steps

### 1. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository: `leonardo-vtex/mcp`

### 2. Configure Environment Variables

In the Vercel project settings, add these environment variables:

```
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Configure Build Settings

Vercel will automatically detect the configuration from `vercel.json`, but you can verify:

- **Framework Preset**: Other
- **Build Command**: Leave empty (handled by vercel.json)
- **Output Directory**: Leave empty (handled by vercel.json)
- **Install Command**: `pip install -r requirements-vercel.txt`

### 4. Deploy

Click "Deploy" and wait for the build to complete.

## 🌐 Access Your App

Once deployed, you'll get a URL like:
```
https://your-project-name.vercel.app
```

## 🔍 Testing the Deployment

### 1. Health Check
```bash
curl https://your-project-name.vercel.app/api/health
```

### 2. Test API Endpoints
```bash
# Get products
curl https://your-project-name.vercel.app/api/products?limit=5

# Get suppliers
curl https://your-project-name.vercel.app/api/suppliers

# Test procurement
curl -X POST https://your-project-name.vercel.app/api/procure \
  -H "Content-Type: application/json" \
  -d '{"query": "I need 50 brake pads for Toyota Camry", "quantity": 50}'
```

### 3. Frontend Testing
Open your Vercel URL in a browser and test the interface.

## ⚠️ Important Notes

### Cold Starts
- The first request might take 2-5 seconds due to cold starts
- Subsequent requests will be faster
- Consider using Vercel Pro for better performance

### API Limits
- Vercel has a 10-second timeout for Hobby plans
- Pro plans have 60-second timeout
- Our functions are optimized to complete within 30 seconds

### Environment Variables
- Never commit your OpenAI API key to the repository
- Use Vercel's environment variable system
- The key is automatically injected into the serverless functions

## 🔧 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check that all files are committed to GitHub
   - Verify `vercel.json` is in the root directory
   - Ensure `requirements-vercel.txt` exists

2. **API Key Not Found**
   - Verify the environment variable is set in Vercel
   - Check the variable name matches exactly: `OPENAI_API_KEY`

3. **CORS Errors**
   - The serverless functions include CORS headers
   - If you still get errors, check the browser console

4. **Function Timeout**
   - Reduce the complexity of your queries
   - Consider upgrading to Vercel Pro for longer timeouts

### Debug Mode

To debug issues, check the Vercel function logs:

1. Go to your Vercel dashboard
2. Click on your project
3. Go to "Functions" tab
4. Check the logs for any errors

## 📊 Performance Optimization

### For Better Performance

1. **Use Vercel Pro** for:
   - Longer function timeouts (60s vs 10s)
   - Better cold start performance
   - More concurrent executions

2. **Optimize Queries**:
   - Keep queries specific and focused
   - Avoid very large quantities in single requests
   - Use specific product categories

3. **Monitor Usage**:
   - Check Vercel analytics for function performance
   - Monitor OpenAI API usage and costs

## 🔄 Updates and Maintenance

### Updating the App

1. Make changes to your local code
2. Commit and push to GitHub
3. Vercel will automatically redeploy

### Environment Variable Updates

1. Go to Vercel project settings
2. Update environment variables
3. Redeploy the project

## 🎯 Production Considerations

### Security
- ✅ API keys are secure in Vercel environment variables
- ✅ CORS is properly configured
- ✅ Input validation is implemented

### Scalability
- ✅ Serverless functions auto-scale
- ✅ No server maintenance required
- ✅ Global CDN for static assets

### Monitoring
- ✅ Vercel provides built-in analytics
- ✅ Function logs are available
- ✅ Performance metrics are tracked

## 🚀 Next Steps

After successful deployment:

1. **Test thoroughly** with various queries
2. **Monitor performance** in Vercel dashboard
3. **Set up custom domain** if needed
4. **Configure analytics** for usage tracking
5. **Set up alerts** for function failures

Your MCP demo is now live and ready to showcase! 🎉 
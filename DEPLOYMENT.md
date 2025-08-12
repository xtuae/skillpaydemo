# Deployment Guide for SkillPay Demo on Vercel

## Prerequisites
- GitHub repository: https://github.com/xtuae/skillpaydemo.git ✅
- Vercel account (free tier works)
- Neon database configured

## Step-by-Step Deployment

### 1. Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Select **"Import Git Repository"**
4. Choose the `skillpaydemo` repository
5. Click **"Import"**

### 2. Configure Environment Variables

In the Vercel project settings, add these environment variables:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `postgres://neondb_owner:npg_wpDNCEe97xBi@ep-round-rice-adl20x6k-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require` |
| `NEXT_PUBLIC_SKILLPAY_AUTH_ID` | `M00006572` |
| `NEXT_PUBLIC_SKILLPAY_AUTH_KEY` | `Qv0rg4oN8cS9sm6PS3rr6fu7MN2FB0Oo` |
| `NEXT_PUBLIC_SKILLPAY_API_URL` | `https://dashboard.skill-pay.in/pay` |
| `NEXT_PUBLIC_APP_URL` | `https://[your-project-name].vercel.app` |

**Important**: Replace `[your-project-name]` with your actual Vercel project URL.

### 3. Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (usually 2-3 minutes)
3. Your app will be live at `https://[your-project-name].vercel.app`

### 4. Post-Deployment Configuration

#### Update Callback URL
After deployment, the SkillPay callback URL will automatically use your production domain. The middleware will handle this dynamically based on the `NEXT_PUBLIC_APP_URL` environment variable.

#### Verify Database Connection
1. Visit your deployed app
2. Try making a test payment
3. Check the transactions page to ensure data is being stored

### 5. Custom Domain (Optional)

To add a custom domain:
1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update `NEXT_PUBLIC_APP_URL` to your custom domain

## API Endpoints

Your deployed API endpoints will be:
- Payment Init: `https://[your-domain]/api/payment/init`
- Payment Status: `https://[your-domain]/api/payment/status`
- Payment Callback: `https://[your-domain]/api/payment/callback`
- Transactions: `https://[your-domain]/api/transactions`

## Testing the Deployment

1. **Test Payment Flow**:
   - Go to your deployed app
   - Enter test payment details
   - Complete the UPI payment
   - Verify the transaction appears in the list

2. **Test API Directly**:
   ```bash
   curl https://[your-domain]/api/transactions
   ```

## Monitoring

- Check Vercel Functions logs for API debugging
- Monitor Neon database dashboard for queries
- Use Vercel Analytics for performance tracking

## Troubleshooting

### Common Issues:

1. **Database Connection Error**
   - Verify DATABASE_URL is correct
   - Check if Neon database is active
   - Ensure SSL mode is enabled

2. **Payment Callback Not Working**
   - Verify NEXT_PUBLIC_APP_URL is set correctly
   - Check Vercel function logs
   - Ensure SkillPay can reach your callback URL

3. **Environment Variables Not Loading**
   - Redeploy after adding environment variables
   - Check variable names match exactly
   - Verify no trailing spaces in values

## Security Notes

- Never commit `.env.local` to git
- Use Vercel's environment variable encryption
- Consider implementing rate limiting for production
- Add authentication for sensitive endpoints

## Support

- Vercel Documentation: https://vercel.com/docs
- Neon Documentation: https://neon.tech/docs
- SkillPay Integration: Refer to provided PDF documentation

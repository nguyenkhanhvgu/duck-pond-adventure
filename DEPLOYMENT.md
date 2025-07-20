# Deployment Configuration for Duck Pond Adventure

## GitHub Pages

1. **Push to GitHub**: Commit and push your code to a GitHub repository
2. **Enable Pages**: Go to repository Settings → Pages
3. **Source**: Deploy from main branch / (root)
4. **Custom Domain**: Optional - add your domain in the settings

### GitHub Actions (Optional)
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./
```

## Netlify

### Method 1: Git Integration
1. Connect your GitHub repository to Netlify
2. Build settings: No build command needed (static files)
3. Publish directory: `/` (root)
4. Auto-deploy on every commit

### Method 2: Drag & Drop
1. Zip your project files
2. Drag the zip to Netlify's deploy area
3. Get instant deployment URL

### netlify.toml (Optional)
```toml
[build]
  publish = "."
  
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Vercel

### Method 1: Git Integration
1. Import project from GitHub in Vercel dashboard
2. No build configuration needed
3. Auto-deploy on every commit

### Method 2: Vercel CLI
```bash
npm i -g vercel
vercel --prod
```

### vercel.json (Optional)
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options", 
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

## Firebase Hosting

1. **Install Firebase CLI**: `npm install -g firebase-tools`
2. **Initialize**: `firebase init hosting`
3. **Configure**: Public directory as `.` (current directory)
4. **Deploy**: `firebase deploy`

### firebase.json
```json
{
  "hosting": {
    "public": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

## Surge.sh

1. **Install Surge**: `npm install -g surge`
2. **Deploy**: `surge . your-domain.surge.sh`
3. **Custom domain**: Use your own domain or get a surge.sh subdomain

## Apache/Nginx Configuration

### Apache (.htaccess)
```apache
# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css application/javascript
</IfModule>

# Set cache headers
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
</IfModule>

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
```

### Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /path/to/duck-game;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1M;
        add_header Cache-Control "public, immutable";
    }
    
    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

## Performance Optimization

### Pre-deployment Checklist
- [ ] Test on multiple devices and browsers
- [ ] Optimize images (if using actual image assets)
- [ ] Minify CSS/JS (optional for this small project)
- [ ] Test offline functionality
- [ ] Verify responsive design
- [ ] Check meta tags for SEO
- [ ] Test loading speed

### Optional Optimizations
- Enable gzip compression on server
- Add service worker for offline play
- Implement lazy loading for assets
- Add preload hints for critical resources
- Use CDN for global distribution

## Domain Configuration

### Custom Domain Setup
1. Purchase domain from registrar
2. Add DNS records pointing to your hosting service
3. Configure HTTPS/SSL certificate
4. Update meta tags and Open Graph URLs

### DNS Records (Example)
```
Type: CNAME
Name: www
Value: your-hosting-service.com

Type: A
Name: @
Value: [hosting service IP]
```

## Monitoring & Analytics

### Google Analytics
Add to `<head>` in index.html:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Performance Monitoring
- Google PageSpeed Insights
- Lighthouse audits
- Web Vitals monitoring
- Uptime monitoring services

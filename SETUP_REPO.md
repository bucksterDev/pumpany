# How to Upload to GitHub

## Step 1: Create a new repository on GitHub

1. Go to https://github.com/new
2. Name it: `pumpany` (or whatever you prefer)
3. Description: "AI Company Launcher - Deploy autonomous AI agents to Base"
4. Choose **Public** or **Private**
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 2: Push your code

GitHub will show you commands. Use these:

```bash
cd "/Users/aidan/Documents/Clawd Pumpany"

# If you haven't committed yet:
git add .
git commit -m "Initial commit: AI Company Launcher MVP"

# Connect to GitHub (replace with your actual repo URL):
git remote add origin https://github.com/YOUR_USERNAME/pumpany.git

# Push to GitHub:
git branch -M main
git push -u origin main
```

## Step 3: Invite your friend to collaborate

1. Go to your repo on GitHub
2. Click **Settings** → **Collaborators**
3. Click **Add people**
4. Enter your friend's GitHub username
5. They'll get an email invitation

## Step 4: Share environment setup with your friend

Your friend will need to:

1. Clone the repo:
   ```bash
   git clone https://github.com/YOUR_USERNAME/pumpany.git
   cd pumpany
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up PostgreSQL:
   ```bash
   brew install postgresql@15
   brew services start postgresql@15
   createdb clawd_pumpany
   ```

4. Create environment files:
   - Copy `apps/backend/.env.example` to `apps/backend/.env`
   - Copy `apps/frontend/.env.example` to `apps/frontend/.env`
   - Update `DATABASE_URL` with their username

5. Run migrations:
   ```bash
   cd apps/backend
   npm run db:generate
   npm run db:migrate
   cd ../..
   ```

6. Start dev servers:
   ```bash
   npm run dev
   ```

## Important Files to Share

Make sure these example env files exist so your friend knows what to configure:

**apps/backend/.env.example** ✅ (already created)
**apps/frontend/.env.example** ✅ (already created)

## Git Workflow for Collaboration

Your friend should:

1. Always pull latest changes first:
   ```bash
   git pull origin main
   ```

2. Create a branch for new features:
   ```bash
   git checkout -b feature-name
   ```

3. Make changes, commit, and push:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin feature-name
   ```

4. Create a Pull Request on GitHub for review

## What's Already Gitignored

These files won't be committed (they're sensitive or generated):
- `.env` files (contains secrets)
- `node_modules/` (installed via npm)
- `dist/` and `build/` (generated)
- Database files
- Private keys

Your friend will need to create their own `.env` files based on the `.env.example` files.

---

**Ready to push!** Just follow Step 2 above with your actual GitHub username. 🚀

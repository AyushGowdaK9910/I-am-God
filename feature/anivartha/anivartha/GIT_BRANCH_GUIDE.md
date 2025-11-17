# Git Branch Guide for Anivartha - CON-1, CON-5, CON-3, CON-6, CON-8

This guide will help you create and push separate branches for each CON task.

## 📋 Prerequisites

1. Make sure you have Git installed
2. Make sure you have a GitHub repository created
3. Navigate to the project root: `cd /Users/ayushgowda/Documents/DUUUPPP/final_Final`

## 🚀 Step-by-Step Guide

### Step 1: Initialize Git Repository (if not already done)

```bash
# Navigate to project root
cd /Users/ayushgowda/Documents/DUUUPPP/final_Final

# Initialize git (if not already initialized)
git init

# Add remote repository (replace with your actual repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Or if using SSH:
# git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
```

### Step 2: Create and Push Branch for CON-1 (File Upload)

```bash
# Create and switch to CON-1 branch
git checkout -b feature/anivartha/CON-1-file-upload

# Add CON-1 related files
git add feature/anivartha/backend/src/services/uploadService.ts
git add feature/anivartha/backend/src/controllers/upload.ts
git add feature/anivartha/backend/src/routes/upload.routes.ts
git add feature/anivartha/frontend/src/components/file-upload/

# Commit
git commit -m "feat(CON-1): File upload handling

- Implement file upload service with Multer
- Create upload controller and routes
- Build file upload UI component
- Add upload progress tracking"

# Push to remote
git push -u origin feature/anivartha/CON-1-file-upload
```

### Step 3: Create and Push Branch for CON-5 (File Validation)

```bash
# Switch back to main/master first
git checkout main
# Or if main doesn't exist yet:
# git checkout -b main

# Create new branch for CON-5
git checkout -b feature/anivartha/CON-5-file-validation

# Add CON-5 related files
git add feature/anivartha/backend/src/services/validateFile.ts
git add feature/anivartha/backend/src/middleware/uploadValidation.ts
git add feature/anivartha/frontend/src/components/validation-errors/

# Commit
git commit -m "feat(CON-5): Reject unsupported and corrupted files

- Implement file validation service
- Add MIME type validation
- Detect file corruption using magic numbers
- Create validation error UI component
- Add upload validation middleware"

# Push to remote
git push -u origin feature/anivartha/CON-5-file-validation
```

### Step 4: Create and Push Branch for CON-3 (File Download)

```bash
# Switch back to main
git checkout main

# Create new branch for CON-3
git checkout -b feature/anivartha/CON-3-file-download

# Add CON-3 related files
git add feature/anivartha/backend/src/services/downloadService.ts
git add feature/anivartha/backend/src/controllers/download.ts
git add feature/anivartha/backend/src/routes/download.routes.ts
git add feature/anivartha/frontend/src/components/downloader/

# Commit
git commit -m "feat(CON-3): File download endpoint

- Implement file download service
- Add download controller with streaming support
- Create download routes
- Build download UI component"

# Push to remote
git push -u origin feature/anivartha/CON-3-file-download
```

### Step 5: Create and Push Branch for CON-6 (Performance Optimization)

```bash
# Switch back to main
git checkout main

# Create new branch for CON-6
git checkout -b feature/anivartha/CON-6-performance

# Add CON-6 related files
git add feature/anivartha/backend/src/performance-optimizations/

# Commit
git commit -m "feat(CON-6): Conversion speed optimization (<3s)

- Implement caching system for performance
- Add performance optimization utilities
- Optimize file streaming for large files
- Configure response headers for caching"

# Push to remote
git push -u origin feature/anivartha/CON-6-performance
```

### Step 6: Create and Push Branch for CON-8 (Fast Conversion UX)

```bash
# Switch back to main
git checkout main

# Create new branch for CON-8
git checkout -b feature/anivartha/CON-8-fast-ux

# Add CON-8 related files
git add feature/anivartha/frontend/src/components/progress-loader/
git add feature/anivartha/frontend/src/pages/home/

# Commit
git commit -m "feat(CON-8): Fast conversion user experience

- Create progress loader component
- Add loading states and visual feedback
- Implement fast UX patterns
- Build home page with upload/download interface"

# Push to remote
git push -u origin feature/anivartha/CON-8-fast-ux
```

## 🔄 Alternative: Push All CON Tasks in One Branch (Simpler Approach)

If you prefer to push all your tasks in one feature branch:

```bash
# Create single feature branch
git checkout -b feature/anivartha

# Add all your files
git add feature/anivartha/

# Commit all CON tasks
git commit -m "feat: implement CON-1, CON-5, CON-3, CON-6, CON-8

CON-1: File upload handling
CON-5: Reject unsupported and corrupted files
CON-3: File download endpoint
CON-6: Conversion speed optimization (<3s)
CON-8: Fast conversion user experience"

# Push to remote
git push -u origin feature/anivartha
```

## 📝 Creating Pull Requests

After pushing each branch, create a Pull Request on GitHub:

1. Go to your GitHub repository
2. Click "Pull Requests" → "New Pull Request"
3. Select your branch (e.g., `feature/anivartha/CON-1-file-upload`)
4. Add description mentioning the CON task
5. Request review from team members
6. Merge after approval

## 🎯 Recommended Workflow

### Option A: One Branch Per CON Task (More Granular)
- ✅ Easier to review individual features
- ✅ Can merge tasks independently
- ✅ Better for tracking specific changes
- ❌ More branches to manage

### Option B: One Branch for All Tasks (Simpler)
- ✅ Easier to manage
- ✅ Single PR for all your work
- ✅ Faster to push
- ❌ All tasks reviewed together

## 🔍 Useful Git Commands

```bash
# View all branches
git branch -a

# View current branch
git branch

# Switch between branches
git checkout branch-name

# View commit history
git log --oneline

# View changes in a branch
git diff main..feature/anivartha/CON-1-file-upload

# Update main branch
git checkout main
git pull origin main
```

## ⚠️ Important Notes

1. **Always pull latest changes** before creating new branches:
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Keep branches focused**: Each branch should contain code for one CON task

3. **Write clear commit messages**: Follow the format `feat(CON-XX): description`

4. **Test before pushing**: Make sure your code works locally before pushing

5. **Update README**: Keep your README_ANIVARTHA.md updated with branch information

## 🚨 Troubleshooting

### If you get "branch already exists" error:
```bash
# Delete local branch
git branch -D feature/anivartha/CON-1-file-upload

# Create again
git checkout -b feature/anivartha/CON-1-file-upload
```

### If you need to update a pushed branch:
```bash
# Make your changes
git add .
git commit -m "fix: update CON-1 implementation"

# Push updates
git push origin feature/anivartha/CON-1-file-upload
```

### If you want to combine branches later:
```bash
# Merge CON-5 into CON-1
git checkout feature/anivartha/CON-1-file-upload
git merge feature/anivartha/CON-5-file-validation
```

## ✅ Checklist Before Pushing

- [ ] Code is tested locally
- [ ] All files are added (`git add`)
- [ ] Commit message follows format
- [ ] Branch name is descriptive
- [ ] README is updated (if needed)
- [ ] No sensitive data in commits

## 🎉 You're Ready!

Follow the steps above to push each CON task as a separate branch. Good luck! 🚀


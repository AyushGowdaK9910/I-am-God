#!/bin/bash

# Anivartha's Branch Pushing Script
# This script helps you push each CON task as a separate branch

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Anivartha's Branch Pushing Script${NC}"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}⚠️  Git not initialized. Initializing...${NC}"
    git init
    echo -e "${GREEN}✅ Git initialized${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  Don't forget to add your remote:${NC}"
    echo "   git remote add origin YOUR_GITHUB_REPO_URL"
    echo ""
    read -p "Press Enter to continue after adding remote..."
fi

# Function to create and push a branch
push_branch() {
    local branch_name=$1
    local con_number=$2
    local description=$3
    local files_path=$4
    
    echo -e "${BLUE}📦 Creating branch: ${branch_name}${NC}"
    
    # Create branch from main (or master)
    if git show-ref --verify --quiet refs/heads/main; then
        git checkout main
    elif git show-ref --verify --quiet refs/heads/master; then
        git checkout master
    else
        echo -e "${YELLOW}⚠️  No main/master branch found. Creating main...${NC}"
        git checkout -b main
        git commit --allow-empty -m "Initial commit"
    fi
    
    # Create feature branch
    git checkout -b "$branch_name" 2>/dev/null || git checkout "$branch_name"
    
    # Add files
    echo -e "${BLUE}📝 Adding files for ${con_number}...${NC}"
    git add $files_path
    
    # Commit
    echo -e "${BLUE}💾 Committing changes...${NC}"
    git commit -m "feat(${con_number}): ${description}" || {
        echo -e "${YELLOW}⚠️  No changes to commit for ${con_number}${NC}"
        return
    }
    
    # Push
    echo -e "${BLUE}🚀 Pushing to remote...${NC}"
    git push -u origin "$branch_name" || {
        echo -e "${YELLOW}⚠️  Could not push. Make sure remote is set up.${NC}"
        echo "   Run: git remote add origin YOUR_GITHUB_REPO_URL"
        return
    }
    
    echo -e "${GREEN}✅ Successfully pushed ${branch_name}${NC}"
    echo ""
}

# Ask user which approach they want
echo "Choose an option:"
echo "1) Push each CON task as separate branch (Recommended)"
echo "2) Push all CON tasks in one branch"
read -p "Enter choice (1 or 2): " choice

if [ "$choice" == "1" ]; then
    # Push each CON task separately
    
    # CON-1: File Upload
    push_branch "feature/anivartha/CON-1" "CON-1" \
        "File upload handling" \
        "feature/anivartha/backend/src/services/uploadService.ts feature/anivartha/backend/src/controllers/upload.ts feature/anivartha/backend/src/routes/upload.routes.ts feature/anivartha/frontend/src/components/file-upload/"
    
    # CON-5: File Validation
    push_branch "feature/anivartha/CON-5" "CON-5" \
        "Reject unsupported and corrupted files" \
        "feature/anivartha/backend/src/services/validateFile.ts feature/anivartha/backend/src/middleware/uploadValidation.ts feature/anivartha/frontend/src/components/validation-errors/"
    
    # CON-3: File Download
    push_branch "feature/anivartha/CON-3" "CON-3" \
        "File download endpoint" \
        "feature/anivartha/backend/src/services/downloadService.ts feature/anivartha/backend/src/controllers/download.ts feature/anivartha/backend/src/routes/download.routes.ts feature/anivartha/frontend/src/components/downloader/"
    
    # CON-6: Performance
    push_branch "feature/anivartha/CON-6" "CON-6" \
        "Conversion speed optimization (<3s)" \
        "feature/anivartha/backend/src/performance-optimizations/"
    
    # CON-8: Fast UX
    push_branch "feature/anivartha/CON-8" "CON-8" \
        "Fast conversion user experience" \
        "feature/anivartha/frontend/src/components/progress-loader/ feature/anivartha/frontend/src/pages/home/"
    
    echo -e "${GREEN}🎉 All branches pushed successfully!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Go to GitHub and create Pull Requests for each branch"
    echo "2. Request reviews from your team"
    echo "3. Merge after approval"
    
elif [ "$choice" == "2" ]; then
    # Push all in one branch
    echo -e "${BLUE}📦 Creating single feature branch...${NC}"
    
    if git show-ref --verify --quiet refs/heads/main; then
        git checkout main
    elif git show-ref --verify --quiet refs/heads/master; then
        git checkout master
    else
        git checkout -b main
        git commit --allow-empty -m "Initial commit"
    fi
    
    git checkout -b feature/anivartha 2>/dev/null || git checkout feature/anivartha
    
    echo -e "${BLUE}📝 Adding all files...${NC}"
    git add feature/anivartha/
    
    echo -e "${BLUE}💾 Committing...${NC}"
    git commit -m "feat: implement CON-1, CON-5, CON-3, CON-6, CON-8

- CON-1: File upload handling
- CON-5: Reject unsupported and corrupted files
- CON-3: File download endpoint
- CON-6: Conversion speed optimization (<3s)
- CON-8: Fast conversion user experience"
    
    echo -e "${BLUE}🚀 Pushing to remote...${NC}"
    git push -u origin feature/anivartha || {
        echo -e "${YELLOW}⚠️  Could not push. Make sure remote is set up.${NC}"
        echo "   Run: git remote add origin YOUR_GITHUB_REPO_URL"
        exit 1
    }
    
    echo -e "${GREEN}✅ Successfully pushed feature/anivartha${NC}"
else
    echo -e "${YELLOW}Invalid choice. Exiting.${NC}"
    exit 1
fi


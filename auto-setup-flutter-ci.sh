#!/bin/bash
# Auto Setup Flutter CI/CD
# Script ini otomatis menambahkan workflow ke semua repo Flutter Anda
# 
# Usage: 
#   chmod +x auto-setup-flutter-ci.sh
#   ./auto-setup-flutter-ci.sh

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

WORKFLOW_URL="https://raw.githubusercontent.com/ohmyno17-cmyk/flutter-apk-app/main/.github/workflows/flutter-apk-release.yml"
REUSABLE_WORKFLOW_REPO="ohmyno17-cmyk/flutter-apk-app"

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Flutter GitHub Actions Auto Setup                    ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to setup workflow for a single repository
setup_repo() {
    local repo_name=$1
    local repo_full=$2
    
    echo -e "${YELLOW}Processing: ${repo_full}${NC}"
    
    # Check if repo has pubspec.yaml (Flutter project)
    echo "Checking if Flutter project..."
    
    # Get default branch
    DEFAULT_BRANCH=$(gh repo view "$repo_full" --json defaultBranchRef --jq '.defaultBranchRef.name' 2>/dev/null || echo "main")
    
    # Check for pubspec.yaml
    HAS_PUBSPEC=$(gh api "repos/$repo_full/contents/pubspec.yaml" 2>/dev/null && echo "true" || echo "false")
    
    if [ "$HAS_PUBSPEC" != "true" ]; then
        echo -e "${YELLOW}  ⚠ Not a Flutter project, skipping...${NC}"
        return 0
    fi
    
    # Check if workflow already exists
    HAS_WORKFLOW=$(gh api "repos/$repo_full/contents/.github/workflows/flutter-apk-release.yml" 2>/dev/null && echo "true" || echo "false")
    
    if [ "$HAS_WORKFLOW" = "true" ]; then
        echo -e "${GREEN}  ✓ Workflow already exists, updating...${NC}"
        # Delete old workflow first
        SHA=$(gh api "repos/$repo_full/contents/.github/workflows/flutter-apk-release.yml" --jq '.sha' 2>/dev/null)
        if [ -n "$SHA" ]; then
            gh api --method DELETE "repos/$repo_full/contents/.github/workflows/flutter-apk-release.yml" \
                -f message="Update Flutter CI workflow" \
                -f sha="$SHA" \
                -f branch="$DEFAULT_BRANCH" 2>/dev/null || true
        fi
    fi
    
    # Create workflow file content
    WORKFLOW_CONTENT=$(cat << 'WORKFLOW_EOF'
name: Flutter APK Release

on:
  workflow_dispatch:
    inputs:
      build_type:
        description: 'Tipe build'
        required: true
        default: 'release'
        type: choice
        options:
          - release
          - debug
          - profile
  push:
    tags:
      - 'v*'
  pull_request:
    branches:
      - main
      - master

jobs:
  call-builder:
    name: Build APK
    uses: ohmyno17-cmyk/flutter-apk-app/.github/workflows/flutter-apk-builder.yml@main
    with:
      flutter-version: '3.24.0'
      build-type: ${{ github.event.inputs.build_type || 'release' }}
    secrets: inherit
WORKFLOW_EOF
)

    # Create .github/workflows directory if needed
    echo "Creating workflow directory..."
    
    # Encode content to base64
    CONTENT_BASE64=$(echo "$WORKFLOW_CONTENT" | base64 -w 0)
    
    # Create the workflow file
    gh api --method PUT "repos/$repo_full/contents/.github/workflows/flutter-apk-release.yml" \
        -f message="Add Flutter CI/CD workflow" \
        -f content="$CONTENT_BASE64" \
        -f branch="$DEFAULT_BRANCH" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}  ✓ Workflow added successfully!${NC}"
    else
        echo -e "${RED}  ✗ Failed to add workflow${NC}"
    fi
    
    echo ""
}

# Main logic
echo -e "${YELLOW}Select option:${NC}"
echo "1) Setup ALL my Flutter repositories"
echo "2) Setup specific repository"
echo "3) Setup multiple repositories (comma separated)"
echo ""
read -p "Enter choice [1-3]: " choice

case $choice in
    1)
        echo -e "${BLUE}Fetching all your repositories...${NC}"
        echo ""
        
        # Get all repos
        REPOS=$(gh repo list --json nameWithOwner,owner --jq '.[] | select(.owner.login == "ohmyno17-cmyk") | .nameWithOwner' 2>/dev/null)
        
        if [ -z "$REPOS" ]; then
            # Fallback: get all repos user has access to
            REPOS=$(gh repo list --limit 100 --json nameWithOwner --jq '.[].nameWithOwner')
        fi
        
        COUNT=0
        for repo in $REPOS; do
            setup_repo "$(basename $repo)" "$repo"
            ((COUNT++))
        done
        
        echo -e "${GREEN}══════════════════════════════════════${NC}"
        echo -e "${GREEN}✓ Processed $COUNT repositories${NC}"
        ;;
        
    2)
        read -p "Enter repository name (e.g., username/repo-name): " repo
        if [ -n "$repo" ]; then
            setup_repo "$(basename $repo)" "$repo"
        fi
        ;;
        
    3)
        read -p "Enter repositories (comma separated, e.g., user/repo1,user/repo2): " repos_input
        IFS=',' read -ra REPOS <<< "$repos_input"
        for repo in "${REPOS[@]}"; do
            repo=$(echo "$repo" | xargs)  # trim whitespace
            if [ -n "$repo" ]; then
                setup_repo "$(basename $repo)" "$repo"
            fi
        done
        ;;
        
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              Setup Complete!                              ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "To trigger build:"
echo -e "  ${BLUE}Manual:${NC} Go to Actions tab → Flutter APK Release → Run workflow"
echo -e "  ${BLUE}Auto:${NC}  Push a tag: git tag v1.0.0 && git push origin v1.0.0"
echo ""

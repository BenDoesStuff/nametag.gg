#!/bin/bash

# Nametag Rebrand Verification Script
# Checks that all instances of "Gamefolio" have been replaced with "Nametag"

echo "🔍 Verifying Gamefolio → Nametag rebrand..."
echo "============================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track issues
ISSUES_FOUND=0

echo "1. Checking for remaining 'Gamefolio' references..."
GAMEFOLIO_MATCHES=$(git grep -i "gamefolio" -- "src/" "public/" "*.json" "*.md" "*.ts" "*.tsx" 2>/dev/null || true)

if [[ -n "$GAMEFOLIO_MATCHES" ]]; then
    echo -e "${RED}❌ Found remaining 'Gamefolio' references:${NC}"
    echo "$GAMEFOLIO_MATCHES"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo -e "${GREEN}✅ No remaining 'Gamefolio' references found${NC}"
fi

echo ""
echo "2. Checking package.json branding..."
PACKAGE_NAME=$(jq -r '.name' package.json 2>/dev/null)
PACKAGE_DESC=$(jq -r '.description' package.json 2>/dev/null)

if [[ "$PACKAGE_NAME" == "nametag" ]]; then
    echo -e "${GREEN}✅ Package name updated to 'nametag'${NC}"
else
    echo -e "${RED}❌ Package name not updated (current: $PACKAGE_NAME)${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

if [[ "$PACKAGE_DESC" == *"Nametag"* ]]; then
    echo -e "${GREEN}✅ Package description contains 'Nametag'${NC}"
else
    echo -e "${YELLOW}⚠️  Package description may need manual review${NC}"
fi

echo ""
echo "3. Checking key files for 'Nametag' branding..."

# Check layout.tsx
if grep -q "Nametag" src/app/layout.tsx 2>/dev/null; then
    echo -e "${GREEN}✅ layout.tsx contains 'Nametag'${NC}"
else
    echo -e "${RED}❌ layout.tsx missing 'Nametag' branding${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

# Check page.tsx
if grep -q "Nametag" src/app/page.tsx 2>/dev/null; then
    echo -e "${GREEN}✅ page.tsx contains 'Nametag'${NC}"
else
    echo -e "${RED}❌ page.tsx missing 'Nametag' branding${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

echo ""
echo "4. Checking for Nametag assets..."

# Check for logo files
if ls public/*nametag* 1> /dev/null 2>&1; then
    echo -e "${GREEN}✅ Nametag assets found in public/${NC}"
    ls public/*nametag* | sed 's/^/   /'
else
    echo -e "${YELLOW}⚠️  No Nametag-specific assets found (may need manual creation)${NC}"
fi

echo ""
echo "5. TypeScript compilation check..."
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ TypeScript compiles successfully${NC}"
else
    echo -e "${RED}❌ TypeScript compilation failed${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

echo ""
echo "============================================"

if [[ $ISSUES_FOUND -eq 0 ]]; then
    echo -e "${GREEN}🎉 Rebrand verification passed! All checks successful.${NC}"
    echo ""
    echo "Next steps:"
    echo "• Run 'npm run dev' to test the application"
    echo "• Deploy to Vercel with new project name"
    echo "• Update domain settings if applicable"
    exit 0
else
    echo -e "${RED}❌ Rebrand verification failed with $ISSUES_FOUND issue(s).${NC}"
    echo "Please fix the issues above and run this script again."
    exit 1
fi
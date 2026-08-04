#!/usr/bin/env python3
"""
Backend test suite for alaolo.com resource aggregator
Tests Next.js server components + Supabase integration
"""

import os
import sys
import json
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

BASE_URL = os.getenv('NEXT_PUBLIC_BASE_URL', 'https://478e7093-a2e9-4fdd-be42-65710e66001b.preview.emergentagent.com')
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_ANON_KEY = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
SUPABASE_SERVICE_ROLE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

# Test configuration
TIMEOUT = 30  # seconds
EXPECTED_RESOURCES = ['Claude', 'ChatGPT', 'MDN Web Docs', 'Public APIs', 'Awesome Self-Hosted', 'Papers with Code']
LOCALES = ['zh', 'en', 'ja', 'ko']

def print_test_header(test_name):
    print(f"\n{'='*80}")
    print(f"TEST: {test_name}")
    print('='*80)

def print_success(message):
    print(f"✅ SUCCESS: {message}")

def print_failure(message):
    print(f"❌ FAILURE: {message}")

def print_info(message):
    print(f"ℹ️  INFO: {message}")

# ============================================================================
# Test 1: Homepage across locales
# ============================================================================
def test_homepage_locales():
    print_test_header("Homepage across locales")
    results = {'passed': 0, 'failed': 0}
    
    # Test 1.1: Root redirect to /zh
    try:
        print_info("Testing GET / -> should redirect to /zh")
        response = requests.get(f"{BASE_URL}/", timeout=TIMEOUT, allow_redirects=True)
        if response.status_code == 200 and '/zh' in response.url:
            print_success(f"Root / redirects to {response.url}")
            results['passed'] += 1
        else:
            print_failure(f"Root / did not redirect properly. Status: {response.status_code}, URL: {response.url}")
            results['failed'] += 1
    except Exception as e:
        print_failure(f"Root / test failed with error: {str(e)}")
        results['failed'] += 1
    
    # Test 1.2: /zh homepage with Chinese content
    try:
        print_info("Testing GET /zh -> should contain Chinese hero title and resource names")
        response = requests.get(f"{BASE_URL}/zh", timeout=TIMEOUT)
        if response.status_code == 200:
            html = response.text
            # Check for Chinese hero title
            if '发现最好用的资源' in html or '发现' in html:
                print_success("/zh contains Chinese hero title")
                results['passed'] += 1
            else:
                print_failure("/zh does not contain expected Chinese hero title")
                results['failed'] += 1
            
            # Check for resource names
            found_resources = [r for r in EXPECTED_RESOURCES if r in html]
            if len(found_resources) >= 4:  # At least 4 out of 6
                print_success(f"/zh contains {len(found_resources)} resource names: {found_resources}")
                results['passed'] += 1
            else:
                print_failure(f"/zh only contains {len(found_resources)} resource names: {found_resources}")
                results['failed'] += 1
        else:
            print_failure(f"/zh returned status {response.status_code}")
            results['failed'] += 2
    except Exception as e:
        print_failure(f"/zh test failed with error: {str(e)}")
        results['failed'] += 2
    
    # Test 1.3: /en homepage with English content
    try:
        print_info("Testing GET /en -> should contain English hero title")
        response = requests.get(f"{BASE_URL}/en", timeout=TIMEOUT)
        if response.status_code == 200:
            html = response.text
            if 'Discover the best resources' in html or 'Discover' in html:
                print_success("/en contains English hero title")
                results['passed'] += 1
            else:
                print_failure("/en does not contain expected English hero title")
                results['failed'] += 1
        else:
            print_failure(f"/en returned status {response.status_code}")
            results['failed'] += 1
    except Exception as e:
        print_failure(f"/en test failed with error: {str(e)}")
        results['failed'] += 1
    
    # Test 1.4: /ja homepage with Japanese content
    try:
        print_info("Testing GET /ja -> should contain Japanese hero title")
        response = requests.get(f"{BASE_URL}/ja", timeout=TIMEOUT)
        if response.status_code == 200:
            html = response.text
            if '最高のリソースを発見' in html or '発見' in html:
                print_success("/ja contains Japanese hero title")
                results['passed'] += 1
            else:
                print_failure("/ja does not contain expected Japanese hero title")
                results['failed'] += 1
        else:
            print_failure(f"/ja returned status {response.status_code}")
            results['failed'] += 1
    except Exception as e:
        print_failure(f"/ja test failed with error: {str(e)}")
        results['failed'] += 1
    
    # Test 1.5: /ko homepage with Korean content
    try:
        print_info("Testing GET /ko -> should contain Korean hero title")
        response = requests.get(f"{BASE_URL}/ko", timeout=TIMEOUT)
        if response.status_code == 200:
            html = response.text
            if '최고의 리소스를 발견하세요' in html or '발견' in html:
                print_success("/ko contains Korean hero title")
                results['passed'] += 1
            else:
                print_failure("/ko does not contain expected Korean hero title")
                results['failed'] += 1
        else:
            print_failure(f"/ko returned status {response.status_code}")
            results['failed'] += 1
    except Exception as e:
        print_failure(f"/ko test failed with error: {str(e)}")
        results['failed'] += 1
    
    # Test 1.6: Check hreflang alternates in /zh
    try:
        print_info("Testing hreflang alternates in /zh")
        response = requests.get(f"{BASE_URL}/zh", timeout=TIMEOUT)
        if response.status_code == 200:
            html = response.text
            hreflang_count = sum(1 for locale in LOCALES if f'hreflang="{locale}"' in html.lower() or f"hreflang='{locale}'" in html.lower())
            if hreflang_count >= 3:  # At least 3 out of 4
                print_success(f"Found {hreflang_count} hreflang alternates in /zh")
                results['passed'] += 1
            else:
                print_failure(f"Only found {hreflang_count} hreflang alternates in /zh")
                results['failed'] += 1
        else:
            print_failure(f"/zh returned status {response.status_code}")
            results['failed'] += 1
    except Exception as e:
        print_failure(f"hreflang test failed with error: {str(e)}")
        results['failed'] += 1
    
    print(f"\n📊 Homepage Tests: {results['passed']} passed, {results['failed']} failed")
    return results

# ============================================================================
# Test 2: Detail pages
# ============================================================================
def test_detail_pages():
    print_test_header("Resource detail pages")
    results = {'passed': 0, 'failed': 0}
    
    # Test 2.1: /zh/resource/claude
    try:
        print_info("Testing GET /zh/resource/claude -> should contain Claude details")
        response = requests.get(f"{BASE_URL}/zh/resource/claude", timeout=TIMEOUT)
        if response.status_code == 200:
            html = response.text
            expected_content = ['Claude', 'Anthropic', '200K', '访问官网', 'Claude 3.5 Sonnet', '优点', '缺点']
            found_content = [c for c in expected_content if c in html]
            
            if len(found_content) >= 5:  # At least 5 out of 7
                print_success(f"/zh/resource/claude contains {len(found_content)} expected elements: {found_content}")
                results['passed'] += 1
            else:
                print_failure(f"/zh/resource/claude only contains {len(found_content)} expected elements: {found_content}")
                results['failed'] += 1
            
            # Check for pricing tiers
            pricing_tiers = ['Pro', 'Free', 'Team', 'API']
            found_tiers = [t for t in pricing_tiers if t in html]
            if len(found_tiers) >= 3:
                print_success(f"/zh/resource/claude contains {len(found_tiers)} pricing tiers: {found_tiers}")
                results['passed'] += 1
            else:
                print_failure(f"/zh/resource/claude only contains {len(found_tiers)} pricing tiers: {found_tiers}")
                results['failed'] += 1
        else:
            print_failure(f"/zh/resource/claude returned status {response.status_code}")
            results['failed'] += 2
    except Exception as e:
        print_failure(f"/zh/resource/claude test failed with error: {str(e)}")
        results['failed'] += 2
    
    # Test 2.2: /en/resource/chatgpt
    try:
        print_info("Testing GET /en/resource/chatgpt -> should contain ChatGPT details in English")
        response = requests.get(f"{BASE_URL}/en/resource/chatgpt", timeout=TIMEOUT)
        if response.status_code == 200:
            html = response.text
            expected_content = ['ChatGPT', 'OpenAI', 'GPT-4o', 'Visit website']
            found_content = [c for c in expected_content if c in html]
            
            if len(found_content) >= 3:
                print_success(f"/en/resource/chatgpt contains {len(found_content)} expected elements: {found_content}")
                results['passed'] += 1
            else:
                print_failure(f"/en/resource/chatgpt only contains {len(found_content)} expected elements: {found_content}")
                results['failed'] += 1
        else:
            print_failure(f"/en/resource/chatgpt returned status {response.status_code}")
            results['failed'] += 1
    except Exception as e:
        print_failure(f"/en/resource/chatgpt test failed with error: {str(e)}")
        results['failed'] += 1
    
    # Test 2.3: /zh/resource/mdn
    try:
        print_info("Testing GET /zh/resource/mdn -> should render MDN Web Docs page")
        response = requests.get(f"{BASE_URL}/zh/resource/mdn", timeout=TIMEOUT)
        if response.status_code == 200:
            html = response.text
            if 'MDN' in html or 'Mozilla' in html:
                print_success("/zh/resource/mdn renders successfully")
                results['passed'] += 1
            else:
                print_failure("/zh/resource/mdn does not contain expected content")
                results['failed'] += 1
        else:
            print_failure(f"/zh/resource/mdn returned status {response.status_code}")
            results['failed'] += 1
    except Exception as e:
        print_failure(f"/zh/resource/mdn test failed with error: {str(e)}")
        results['failed'] += 1
    
    # Test 2.4: /zh/resource/nonexistent-slug -> should return 404
    try:
        print_info("Testing GET /zh/resource/nonexistent-slug -> should return 404")
        response = requests.get(f"{BASE_URL}/zh/resource/nonexistent-slug", timeout=TIMEOUT)
        if response.status_code == 404:
            print_success("/zh/resource/nonexistent-slug correctly returns 404")
            results['passed'] += 1
        else:
            print_failure(f"/zh/resource/nonexistent-slug returned status {response.status_code} instead of 404")
            results['failed'] += 1
    except Exception as e:
        print_failure(f"/zh/resource/nonexistent-slug test failed with error: {str(e)}")
        results['failed'] += 1
    
    # Test 2.5: Check metadata in detail page
    try:
        print_info("Testing metadata in /zh/resource/claude")
        response = requests.get(f"{BASE_URL}/zh/resource/claude", timeout=TIMEOUT)
        if response.status_code == 200:
            html = response.text
            has_title = '<title>' in html.lower() and 'claude' in html.lower()
            has_canonical = 'rel="canonical"' in html.lower() or "rel='canonical'" in html.lower()
            
            if has_title and has_canonical:
                print_success("Detail page has proper metadata (title and canonical)")
                results['passed'] += 1
            else:
                print_failure(f"Detail page missing metadata - title: {has_title}, canonical: {has_canonical}")
                results['failed'] += 1
        else:
            print_failure(f"/zh/resource/claude returned status {response.status_code}")
            results['failed'] += 1
    except Exception as e:
        print_failure(f"Metadata test failed with error: {str(e)}")
        results['failed'] += 1
    
    print(f"\n📊 Detail Page Tests: {results['passed']} passed, {results['failed']} failed")
    return results

# ============================================================================
# Test 3: SEO endpoints
# ============================================================================
def test_seo_endpoints():
    print_test_header("SEO endpoints (sitemap.xml, robots.txt)")
    results = {'passed': 0, 'failed': 0}
    
    # Test 3.1: /sitemap.xml
    try:
        print_info("Testing GET /sitemap.xml -> should return valid XML")
        response = requests.get(f"{BASE_URL}/sitemap.xml", timeout=TIMEOUT)
        if response.status_code == 200:
            xml = response.text
            # Check for XML structure
            if '<?xml' in xml and '<urlset' in xml:
                print_success("/sitemap.xml returns valid XML structure")
                results['passed'] += 1
            else:
                print_failure("/sitemap.xml does not contain valid XML structure")
                results['failed'] += 1
            
            # Check for locale URLs
            locale_count = sum(1 for locale in LOCALES if f'/{locale}<' in xml or f'/{locale}/' in xml)
            if locale_count >= 3:
                print_success(f"/sitemap.xml contains URLs for {locale_count} locales")
                results['passed'] += 1
            else:
                print_failure(f"/sitemap.xml only contains URLs for {locale_count} locales")
                results['failed'] += 1
            
            # Check for resource URLs
            resource_count = xml.count('/resource/')
            if resource_count >= 20:  # 6 resources x 4 locales = 24
                print_success(f"/sitemap.xml contains {resource_count} resource URLs")
                results['passed'] += 1
            else:
                print_failure(f"/sitemap.xml only contains {resource_count} resource URLs (expected ~24)")
                results['failed'] += 1
        else:
            print_failure(f"/sitemap.xml returned status {response.status_code}")
            results['failed'] += 3
    except Exception as e:
        print_failure(f"/sitemap.xml test failed with error: {str(e)}")
        results['failed'] += 3
    
    # Test 3.2: /robots.txt
    try:
        print_info("Testing GET /robots.txt -> should return valid robots.txt")
        response = requests.get(f"{BASE_URL}/robots.txt", timeout=TIMEOUT)
        if response.status_code == 200:
            txt = response.text
            # Check for robots.txt structure
            if 'User-agent:' in txt or 'user-agent:' in txt.lower():
                print_success("/robots.txt returns valid robots.txt structure")
                results['passed'] += 1
            else:
                print_failure("/robots.txt does not contain valid robots.txt structure")
                results['failed'] += 1
            
            # Check for sitemap URL
            if 'sitemap' in txt.lower() and BASE_URL in txt:
                print_success("/robots.txt contains sitemap URL")
                results['passed'] += 1
            else:
                print_failure("/robots.txt does not contain sitemap URL")
                results['failed'] += 1
        else:
            print_failure(f"/robots.txt returned status {response.status_code}")
            results['failed'] += 2
    except Exception as e:
        print_failure(f"/robots.txt test failed with error: {str(e)}")
        results['failed'] += 2
    
    print(f"\n📊 SEO Endpoint Tests: {results['passed']} passed, {results['failed']} failed")
    return results

# ============================================================================
# Test 4: Supabase DB verification
# ============================================================================
def test_supabase_db():
    print_test_header("Supabase DB verification (using service_role key)")
    results = {'passed': 0, 'failed': 0}
    
    if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
        print_failure("Supabase credentials not found in environment")
        results['failed'] += 5
        return results
    
    headers = {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': f'Bearer {SUPABASE_SERVICE_ROLE_KEY}',
        'Content-Type': 'application/json'
    }
    
    # Test 4.1: Query resources table
    try:
        print_info("Querying resources table -> should have 6 rows")
        response = requests.get(f"{SUPABASE_URL}/rest/v1/resources?select=*", headers=headers, timeout=TIMEOUT)
        if response.status_code == 200:
            resources = response.json()
            if len(resources) == 6:
                print_success(f"Resources table has {len(resources)} rows")
                results['passed'] += 1
            else:
                print_failure(f"Resources table has {len(resources)} rows (expected 6)")
                results['failed'] += 1
        else:
            print_failure(f"Resources query returned status {response.status_code}")
            results['failed'] += 1
    except Exception as e:
        print_failure(f"Resources query failed with error: {str(e)}")
        results['failed'] += 1
    
    # Test 4.2: Query categories table
    try:
        print_info("Querying categories table -> should have 5 rows")
        response = requests.get(f"{SUPABASE_URL}/rest/v1/categories?select=*", headers=headers, timeout=TIMEOUT)
        if response.status_code == 200:
            categories = response.json()
            if len(categories) == 5:
                print_success(f"Categories table has {len(categories)} rows")
                results['passed'] += 1
            else:
                print_failure(f"Categories table has {len(categories)} rows (expected 5)")
                results['failed'] += 1
        else:
            print_failure(f"Categories query returned status {response.status_code}")
            results['failed'] += 1
    except Exception as e:
        print_failure(f"Categories query failed with error: {str(e)}")
        results['failed'] += 1
    
    # Test 4.3: Query info_grid table
    try:
        print_info("Querying info_grid table -> should have multiple rows")
        response = requests.get(f"{SUPABASE_URL}/rest/v1/info_grid?select=*", headers=headers, timeout=TIMEOUT)
        if response.status_code == 200:
            info_grid = response.json()
            if len(info_grid) > 0:
                print_success(f"Info_grid table has {len(info_grid)} rows")
                results['passed'] += 1
            else:
                print_failure("Info_grid table is empty")
                results['failed'] += 1
        else:
            print_failure(f"Info_grid query returned status {response.status_code}")
            results['failed'] += 1
    except Exception as e:
        print_failure(f"Info_grid query failed with error: {str(e)}")
        results['failed'] += 1
    
    # Test 4.4: Query pros_cons table
    try:
        print_info("Querying pros_cons table -> should have rows with type='pro' and type='con'")
        response = requests.get(f"{SUPABASE_URL}/rest/v1/pros_cons?select=*", headers=headers, timeout=TIMEOUT)
        if response.status_code == 200:
            pros_cons = response.json()
            pros = [pc for pc in pros_cons if pc.get('type') == 'pro']
            cons = [pc for pc in pros_cons if pc.get('type') == 'con']
            if len(pros) > 0 and len(cons) > 0:
                print_success(f"Pros_cons table has {len(pros)} pros and {len(cons)} cons")
                results['passed'] += 1
            else:
                print_failure(f"Pros_cons table has {len(pros)} pros and {len(cons)} cons")
                results['failed'] += 1
        else:
            print_failure(f"Pros_cons query returned status {response.status_code}")
            results['failed'] += 1
    except Exception as e:
        print_failure(f"Pros_cons query failed with error: {str(e)}")
        results['failed'] += 1
    
    # Test 4.5: Query pricing_plans table
    try:
        print_info("Querying pricing_plans table -> should have rows for Claude")
        response = requests.get(f"{SUPABASE_URL}/rest/v1/pricing_plans?select=*", headers=headers, timeout=TIMEOUT)
        if response.status_code == 200:
            pricing = response.json()
            if len(pricing) >= 4:  # At least 4 tiers for Claude
                print_success(f"Pricing_plans table has {len(pricing)} rows")
                results['passed'] += 1
            else:
                print_failure(f"Pricing_plans table has {len(pricing)} rows (expected at least 4)")
                results['failed'] += 1
        else:
            print_failure(f"Pricing_plans query returned status {response.status_code}")
            results['failed'] += 1
    except Exception as e:
        print_failure(f"Pricing_plans query failed with error: {str(e)}")
        results['failed'] += 1
    
    # Test 4.6: Verify JSONB name column has all 4 languages
    try:
        print_info("Verifying JSONB name column has all 4 languages for Claude")
        response = requests.get(f"{SUPABASE_URL}/rest/v1/resources?select=name&slug=eq.claude", headers=headers, timeout=TIMEOUT)
        if response.status_code == 200:
            resources = response.json()
            if len(resources) > 0:
                name_obj = resources[0].get('name', {})
                if isinstance(name_obj, dict):
                    has_all_langs = all(locale in name_obj for locale in LOCALES)
                    if has_all_langs:
                        print_success(f"Claude resource has all 4 languages in name JSONB: {list(name_obj.keys())}")
                        results['passed'] += 1
                    else:
                        print_failure(f"Claude resource missing some languages in name JSONB: {list(name_obj.keys())}")
                        results['failed'] += 1
                else:
                    print_failure(f"Claude resource name is not a JSONB object: {name_obj}")
                    results['failed'] += 1
            else:
                print_failure("Claude resource not found")
                results['failed'] += 1
        else:
            print_failure(f"Claude query returned status {response.status_code}")
            results['failed'] += 1
    except Exception as e:
        print_failure(f"JSONB verification failed with error: {str(e)}")
        results['failed'] += 1
    
    print(f"\n📊 Supabase DB Tests: {results['passed']} passed, {results['failed']} failed")
    return results

# ============================================================================
# Test 5: RLS check
# ============================================================================
def test_rls():
    print_test_header("RLS check (using anon key)")
    results = {'passed': 0, 'failed': 0}
    
    if not SUPABASE_URL or not SUPABASE_ANON_KEY:
        print_failure("Supabase credentials not found in environment")
        results['failed'] += 2
        return results
    
    headers = {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': f'Bearer {SUPABASE_ANON_KEY}',
        'Content-Type': 'application/json'
    }
    
    # Test 5.1: Public read on resources should succeed
    try:
        print_info("Testing public read on resources table with anon key")
        response = requests.get(f"{SUPABASE_URL}/rest/v1/resources?select=*&limit=1", headers=headers, timeout=TIMEOUT)
        if response.status_code == 200:
            print_success("Public read on resources table succeeded")
            results['passed'] += 1
        else:
            print_failure(f"Public read on resources table failed with status {response.status_code}")
            results['failed'] += 1
    except Exception as e:
        print_failure(f"Public read test failed with error: {str(e)}")
        results['failed'] += 1
    
    # Test 5.2: Insert into favorites without auth should fail
    try:
        print_info("Testing insert into favorites table without auth (should fail)")
        payload = {
            'user_id': '00000000-0000-0000-0000-000000000000',
            'resource_id': '00000000-0000-0000-0000-000000000000'
        }
        response = requests.post(f"{SUPABASE_URL}/rest/v1/favorites", headers=headers, json=payload, timeout=TIMEOUT)
        if response.status_code in [401, 403]:
            print_success(f"Insert into favorites without auth correctly blocked (status {response.status_code})")
            results['passed'] += 1
        else:
            print_failure(f"Insert into favorites without auth returned unexpected status {response.status_code}")
            results['failed'] += 1
    except Exception as e:
        print_failure(f"RLS insert test failed with error: {str(e)}")
        results['failed'] += 1
    
    print(f"\n📊 RLS Tests: {results['passed']} passed, {results['failed']} failed")
    return results

# ============================================================================
# Test 6: Auth callback route
# ============================================================================
def test_auth_callback():
    print_test_header("Auth callback route")
    results = {'passed': 0, 'failed': 0}
    
    # Test 6.1: /auth/callback without code param should redirect
    try:
        print_info("Testing GET /auth/callback without code param -> should redirect")
        response = requests.get(f"{BASE_URL}/auth/callback", timeout=TIMEOUT, allow_redirects=False)
        if response.status_code in [302, 307, 308]:
            redirect_location = response.headers.get('Location', '')
            if '/zh' in redirect_location or redirect_location.endswith('/zh'):
                print_success(f"/auth/callback redirects to {redirect_location}")
                results['passed'] += 1
            else:
                print_failure(f"/auth/callback redirects to unexpected location: {redirect_location}")
                results['failed'] += 1
        else:
            print_failure(f"/auth/callback returned status {response.status_code} instead of redirect")
            results['failed'] += 1
    except Exception as e:
        print_failure(f"/auth/callback test failed with error: {str(e)}")
        results['failed'] += 1
    
    print(f"\n📊 Auth Callback Tests: {results['passed']} passed, {results['failed']} failed")
    return results

# ============================================================================
# Main test runner
# ============================================================================
def main():
    print("\n" + "="*80)
    print("BACKEND TEST SUITE FOR ALAOLO.COM")
    print("="*80)
    print(f"Base URL: {BASE_URL}")
    print(f"Supabase URL: {SUPABASE_URL}")
    print(f"Timeout: {TIMEOUT}s")
    print("="*80)
    
    all_results = {
        'passed': 0,
        'failed': 0
    }
    
    # Run all tests
    test_suites = [
        ("Homepage across locales", test_homepage_locales),
        ("Detail pages", test_detail_pages),
        ("SEO endpoints", test_seo_endpoints),
        ("Supabase DB verification", test_supabase_db),
        ("RLS check", test_rls),
        ("Auth callback route", test_auth_callback),
    ]
    
    for suite_name, test_func in test_suites:
        try:
            results = test_func()
            all_results['passed'] += results['passed']
            all_results['failed'] += results['failed']
        except Exception as e:
            print_failure(f"Test suite '{suite_name}' crashed with error: {str(e)}")
            all_results['failed'] += 1
    
    # Print final summary
    print("\n" + "="*80)
    print("FINAL SUMMARY")
    print("="*80)
    total_tests = all_results['passed'] + all_results['failed']
    pass_rate = (all_results['passed'] / total_tests * 100) if total_tests > 0 else 0
    print(f"Total tests: {total_tests}")
    print(f"✅ Passed: {all_results['passed']}")
    print(f"❌ Failed: {all_results['failed']}")
    print(f"Pass rate: {pass_rate:.1f}%")
    print("="*80)
    
    # Exit with appropriate code
    sys.exit(0 if all_results['failed'] == 0 else 1)

if __name__ == '__main__':
    main()

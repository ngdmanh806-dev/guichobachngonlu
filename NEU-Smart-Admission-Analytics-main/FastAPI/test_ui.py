import urllib.request
import json
import sys

endpoints = [
    "http://localhost:8000/ui/dashboard",
    "http://localhost:8000/ui/charts",
    "http://localhost:8000/ui/insights",
    "http://localhost:8000/ui/students?page=1&pageSize=5"
]

for url in endpoints:
    print(f"Testing {url}...")
    try:
        with urllib.request.urlopen(url) as response:
            status = response.getcode()
            content = response.read().decode()
            print(f"Status: {status}")
            # print(f"Content: {content[:100]}...")
            print("Successfully fetched data.")
    except Exception as e:
        print(f"Error testing {url}: {e}")

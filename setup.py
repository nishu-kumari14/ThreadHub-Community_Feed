from setuptools import setup, find_packages

setup(
    name="threadhub",
    version="1.0.0",
    description="ThreadHub - Community Feed with Threaded Discussions",
    packages=find_packages(where="backend"),
    package_dir={"": "backend"},
    python_requires=">=3.11",
    install_requires=[
        "Django>=5.0,<6.0",
        "djangorestframework>=3.15,<4.0",
        "django-cors-headers>=4.3,<5.0",
        "gunicorn>=21.0,<22.0",
        "python-dotenv>=1.0,<2.0",
        "whitenoise>=6.6,<7.0",
        "dj-database-url>=2.1,<3.0",
        "psycopg2-binary>=2.9,<3.0",
    ],
)

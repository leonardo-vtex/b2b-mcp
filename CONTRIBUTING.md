# Contributing to B2B Automotive Parts Procurement MCP Demo

Thank you for your interest in contributing to our project! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### 1. Fork the Repository
- Click the "Fork" button on the GitHub repository page
- Clone your forked repository to your local machine

### 2. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 3. Make Your Changes
- Follow the coding standards (see below)
- Add tests for new functionality
- Update documentation as needed

### 4. Test Your Changes
```bash
# Run the system tests
python3 test_system.py

# Start the backend server
python3 backend/main.py

# Test the frontend
open frontend/index.html
```

### 5. Commit Your Changes
```bash
git add .
git commit -m "feat: add new feature description"
```

### 6. Push and Create a Pull Request
```bash
git push origin feature/your-feature-name
```

## 📋 Coding Standards

### Python
- Follow PEP 8 style guidelines
- Use type hints where appropriate
- Add docstrings to functions and classes
- Keep functions small and focused

### JavaScript/HTML/CSS
- Use consistent indentation (2 spaces)
- Follow modern ES6+ practices
- Use semantic HTML elements
- Maintain responsive design principles

### Git Commit Messages
Use conventional commit format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

## 🧪 Testing

### Running Tests
```bash
# Run system validation
python3 test_system.py

# Test API endpoints
curl http://localhost:8000/health
curl http://localhost:8000/products
```

### Adding Tests
- Add test functions to `test_system.py`
- Test both success and error cases
- Include edge cases and boundary conditions

## 📚 Documentation

### Updating Documentation
- Update README.md for major changes
- Add inline comments for complex logic
- Update API documentation if endpoints change

### Code Comments
- Use clear, concise comments
- Explain "why" not just "what"
- Comment complex business logic

## 🐛 Reporting Bugs

### Before Reporting
1. Check if the bug has already been reported
2. Try to reproduce the bug consistently
3. Check the logs for error messages

### Bug Report Template
```
**Bug Description:**
Brief description of the issue

**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Environment:**
- OS: [e.g., macOS, Windows, Linux]
- Python Version: [e.g., 3.9.0]
- Browser: [if applicable]

**Additional Information:**
Any other relevant details
```

## 💡 Feature Requests

### Before Submitting
1. Check if the feature has already been requested
2. Consider if it aligns with the project's goals
3. Think about implementation complexity

### Feature Request Template
```
**Feature Description:**
Brief description of the requested feature

**Use Case:**
Why this feature would be useful

**Proposed Implementation:**
How you think it could be implemented

**Additional Information:**
Any other relevant details
```

## 🔧 Development Setup

### Prerequisites
- Python 3.9+
- Git
- OpenAI API Key (for testing)

### Local Development
```bash
# Clone the repository
git clone <your-fork-url>
cd MCP

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp env.example .env
# Edit .env with your OpenAI API key

# Run the system
python3 backend/main.py
```

## 📞 Getting Help

- Open an issue for bugs or feature requests
- Check existing issues and pull requests
- Review the documentation in the `docs/` folder

## 🎯 Areas for Contribution

### High Priority
- Additional product categories
- More sophisticated pricing algorithms
- Enhanced AI recommendations
- Performance optimizations

### Medium Priority
- Additional frontend features
- More supplier agents
- Enhanced error handling
- Unit tests

### Low Priority
- Documentation improvements
- Code refactoring
- UI/UX enhancements
- Additional demo examples

## 🙏 Recognition

Contributors will be recognized in:
- The project README
- Release notes
- GitHub contributors list

Thank you for contributing to the future of B2B procurement! 🚗⚡ 
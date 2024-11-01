# CleanMail

## Overview

CleanMail is an automation tool designed to help you keep your inbox clutter-free. This app allows you to delete emails periodically based on a set of predefined conditions, ensuring that your Gmail account stays organized without the hassle of manual cleaning.

### Features (WIP)

- [x] Support gmail(only) accounts
- [x] Read emails
- [ ] Automated Email Deletion: Set conditions to delete emails automatically, reducing inbox clutter.
- [ ] Customizable Rules: Create rules based on email age, sender, subject, labels, or keywords.
- [ ] Scheduled Cleanups: Define how often the cleanup process runs (daily, weekly, monthly).
- [ ] Safe Deletions: Review emails flagged for deletion before they are removed permanently.
- [ ] Secure: Operates using OAuth 2.0 authentication, ensuring your data is safe and secure.
- [ ] Support Multiple Accounts: Manage multiple Gmail accounts with ease.


### Setup

Setup a google project and enable the Gmail API. 

1. Copy `env.example` to `.env.local` and fill in the required fields.
2. Run the following commands to start the app:
```bash
bun install
bun run dev
```

